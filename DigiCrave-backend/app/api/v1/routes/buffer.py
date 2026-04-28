from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from decimal import Decimal
import uuid

from app.core.database import get_db
from app.api.v1.dependencies import get_valid_restaurant, get_current_customer
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem
from app.models.restaurant import Restaurant
from app.schemas.buffer import (
    BufferStatusResponse,
    ModifyOrderRequest,
    ModifyOrderResponse,
    CancelOrderResponse,
)
from app.services.buffer import is_buffer_active, get_remaining_seconds
from app.core.websocket import manager

router = APIRouter()


@router.get("/order/{order_id}/buffer-status", response_model=BufferStatusResponse)
async def get_buffer_status(
    order_id: uuid.UUID,
    restaurant: Restaurant = Depends(get_valid_restaurant),
    token_data: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """
    Customer checks if their order is still in buffer period.
    Frontend uses this to show/hide the modify button with countdown.
    """
    customer_id = uuid.UUID(token_data["sub"])

    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.restaurant_id == restaurant.id,
            Order.customer_id == customer_id,
            Order.deleted_at == None,
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    active = is_buffer_active(order)
    remaining = get_remaining_seconds(order)

    return BufferStatusResponse(
        order_id=str(order.id),
        is_buffer_active=active,
        seconds_remaining=remaining,
        is_locked=order.is_locked,
        kitchen_status=order.kitchen_status,
        message=(
            f"You have {remaining} seconds to modify your order"
            if active else
            "Order is locked and sent to kitchen"
        )
    )


@router.patch("/order/{order_id}/modify", response_model=ModifyOrderResponse)
async def modify_order(
    order_id: uuid.UUID,
    request: ModifyOrderRequest,
    restaurant: Restaurant = Depends(get_valid_restaurant),
    token_data: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """
    Customer modifies order within 1 minute buffer.
    - quantity > 0 → add/update item
    - quantity = 0 → remove item
    """
    customer_id = uuid.UUID(token_data["sub"])

    # Fetch order
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.restaurant_id == restaurant.id,
            Order.customer_id == customer_id,
            Order.deleted_at == None,
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check buffer is active
    if not is_buffer_active(order):
        raise HTTPException(
            status_code=400,
            detail="Buffer period expired. Order is locked and sent to kitchen."
        )

    remaining = get_remaining_seconds(order)
    items_updated = 0

    for modify_item in request.items:
        item_id = uuid.UUID(str(modify_item.menu_item_id))

        # Check item exists in restaurant
        menu_result = await db.execute(
            select(MenuItem).where(
                MenuItem.id == item_id,
                MenuItem.restaurant_id == restaurant.id,
                MenuItem.is_available == True,
                MenuItem.deleted_at == None,
            )
        )
        menu_item = menu_result.scalar_one_or_none()
        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=f"Menu item {item_id} not found or unavailable"
            )

        # Find existing order item
        existing_result = await db.execute(
            select(OrderItem).where(
                OrderItem.order_id == order_id,
                OrderItem.menu_item_id == item_id,
            )
        )
        existing_item = existing_result.scalar_one_or_none()

        if modify_item.quantity == 0:
            # Remove item
            if existing_item:
                await db.delete(existing_item)
                items_updated += 1

        elif existing_item:
            # Update quantity
            existing_item.quantity = modify_item.quantity
            items_updated += 1

        else:
            # Add new item
            new_item = OrderItem(
                id=uuid.uuid4(),
                order_id=order_id,
                menu_item_id=item_id,
                quantity=modify_item.quantity,
                historical_price_at_order=menu_item.price_offline,
            )
            db.add(new_item)
            items_updated += 1

    await db.commit()

    # Recalculate new total
    items_result = await db.execute(
        select(OrderItem).where(OrderItem.order_id == order_id)
    )
    all_items = items_result.scalars().all()
    new_total = sum(
        item.historical_price_at_order * item.quantity
        for item in all_items
    )

    # Notify customer via WebSocket
    await manager.emit_to_role(
        restaurant_id=str(restaurant.id),
        role="customer",
        event="order_modified",
        data={
            "order_id": str(order_id),
            "seconds_remaining": remaining,
            "new_total": float(new_total),
            "message": "Order updated successfully",
        }
    )

    return ModifyOrderResponse(
        order_id=str(order_id),
        message="Order updated successfully",
        seconds_remaining=remaining,
        new_total=new_total,
        items_updated=items_updated,
    )


@router.delete("/order/{order_id}/cancel", response_model=CancelOrderResponse)
async def cancel_order(
    order_id: uuid.UUID,
    restaurant: Restaurant = Depends(get_valid_restaurant),
    token_data: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """
    Customer cancels order within 1 minute buffer.
    - Digital payment → initiate Razorpay refund
    - Cash order → simply soft delete
    """
    customer_id = uuid.UUID(token_data["sub"])

    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.restaurant_id == restaurant.id,
            Order.customer_id == customer_id,
            Order.deleted_at == None,
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check buffer is active
    if not is_buffer_active(order):
        raise HTTPException(
            status_code=400,
            detail="Buffer period expired. Cannot cancel — contact staff."
        )

    refund_initiated = False

    # Handle refund for digital payments
    if order.payment_status == "paid_digital":
        refund_initiated = await _initiate_razorpay_refund(order, db)

    # Handle cash order — deduct ₹3 from platform debt
    elif order.payment_status == "pending":
        from app.models.billing import RestaurantBilling
        billing_result = await db.execute(
            select(RestaurantBilling).where(
                RestaurantBilling.restaurant_id == restaurant.id
            )
        )
        billing = billing_result.scalar_one_or_none()
        if billing:
            from app.core.config import settings
            billing.unpaid_manual_fees = max(
                Decimal("0"),
                billing.unpaid_manual_fees - Decimal(str(settings.PLATFORM_FEE))
            )

    # Soft delete order
    from datetime import datetime, timezone
    order.deleted_at = datetime.now(timezone.utc)
    order.kitchen_status = "cancelled"
    await db.commit()

    # Notify cashier
    await manager.emit_to_role(
        restaurant_id=str(restaurant.id),
        role="cashier",
        event="order_cancelled",
        data={
            "order_id": str(order_id),
            "message": "Customer cancelled order within buffer period",
        }
    )

    return CancelOrderResponse(
        order_id=str(order_id),
        message="Order cancelled successfully",
        refund_initiated=refund_initiated,
    )


async def _initiate_razorpay_refund(order: Order, db: AsyncSession) -> bool:
    """Initiate Razorpay refund for digital payments"""
    try:
        import razorpay
        from app.core.config import settings
        from app.models.transaction import Transaction

        # Get transaction
        tx_result = await db.execute(
            select(Transaction).where(Transaction.order_id == order.id)
        )
        transaction = tx_result.scalar_one_or_none()

        if not transaction or not transaction.razorpay_payment_id:
            return False

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Full refund
        client.payment.refund(
            transaction.razorpay_payment_id,
            {
                "amount": int(transaction.gross_amount * 100),
                "notes": {
                    "reason": "Customer cancelled within buffer period",
                    "order_id": str(order.id),
                }
            }
        )

        # Update payment status
        order.payment_status = "refunded"
        transaction.razorpay_transfer_id = "refunded"
        return True

    except Exception as e:
        print(f"[REFUND ERROR] {e}")
        return False