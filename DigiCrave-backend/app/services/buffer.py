from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
import uuid

from app.models.order import Order, OrderItem
from app.models.menu import MenuItem
from app.core.websocket import manager

BUFFER_SECONDS = 60  # 1 minute buffer


def get_buffer_expiry() -> datetime:
    """Returns buffer expiry time = now + 60 seconds"""
    return datetime.now(timezone.utc) + timedelta(seconds=BUFFER_SECONDS)


def is_buffer_active(order: Order) -> bool:
    """Check if order is still within buffer period"""
    if order.is_locked:
        return False
    if not order.buffer_expires_at:
        return False

    expiry = order.buffer_expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    return datetime.now(timezone.utc) < expiry


def get_remaining_seconds(order: Order) -> int:
    """Returns seconds remaining in buffer"""
    if not is_buffer_active(order):
        return 0

    expiry = order.buffer_expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    remaining = (expiry - datetime.now(timezone.utc)).total_seconds()
    return max(0, int(remaining))


async def lock_order_and_notify_kitchen(
    order: Order,
    db: AsyncSession,
):
    """
    Called when buffer expires:
    1. Lock the order
    2. Change status from buffering → received
    3. Notify kitchen via WebSocket
    """
    order.is_locked = True
    order.kitchen_status = "received"
    await db.commit()

    # Notify kitchen — order is now confirmed
    await manager.emit_to_role(
        restaurant_id=str(order.restaurant_id),
        role="kitchen",
        event="new_order",
        data={
            "order_id": str(order.id),
            "source": order.source,
            "table_id": str(order.table_id) if order.table_id else None,
            "message": "New confirmed order ready for preparation",
        }
    )

    # Notify cashier
    await manager.emit_to_role(
        restaurant_id=str(order.restaurant_id),
        role="cashier",
        event="new_order",
        data={
            "order_id": str(order.id),
            "kitchen_status": "received",
        }
    )

    print(f"[BUFFER] Order {order.id} locked and sent to kitchen")