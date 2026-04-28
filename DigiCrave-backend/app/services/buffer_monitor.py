import asyncio
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.order import Order
from app.services.buffer import lock_order_and_notify_kitchen


async def check_expired_buffers():
    """
    Runs every 10 seconds
    Finds orders where:
    - kitchen_status == buffering
    - buffer_expires_at < now
    - is_locked == False
    Locks them and notifies kitchen
    """
    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)

        result = await db.execute(
            select(Order).where(
                Order.kitchen_status == "buffering",
                Order.is_locked == False,
                Order.buffer_expires_at <= now,
                Order.deleted_at == None,
            )
        )
        expired_orders = result.scalars().all()

        for order in expired_orders:
            try:
                await lock_order_and_notify_kitchen(order, db)
                print(f"[BUFFER MONITOR] Order {order.id} buffer expired → sent to kitchen")
            except Exception as e:
                print(f"[BUFFER MONITOR ERROR] {order.id}: {e}")


async def start_buffer_monitor():
    """Runs every 10 seconds checking for expired buffers"""
    while True:
        try:
            await check_expired_buffers()
        except Exception as e:
            print(f"[Buffer Monitor Error] {e}")
        await asyncio.sleep(10)