import uuid
from decimal import Decimal
from sqlalchemy import String, Integer, Numeric, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Order(Base, TimestampMixin):
    """
    Blueprint Module 3: Omnichannel Orders
    Buffer Feature: 
    - kitchen_status starts as "buffering"
    - buffer_expires_at = created_at + 60 seconds
    - is_locked = False during buffer, True after
    """
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    restaurant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("restaurants.id"), nullable=False)
    table_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tables.id"), nullable=True)
    customer_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(20), nullable=False)

    # Buffer Feature — new fields
    kitchen_status: Mapped[str] = mapped_column(String(20), default="buffering")
    buffer_expires_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)

    payment_status: Mapped[str] = mapped_column(String(20), default="pending")
    aggregator_order_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    idempotency_key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    preparation_deadline: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    restaurant = relationship("Restaurant", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    transaction = relationship("Transaction", back_populates="order", uselist=False)


class OrderItem(Base, TimestampMixin):
    """Historical price locked at time of order"""
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False)
    menu_item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("menu_items.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    historical_price_at_order: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    notes: Mapped[str | None] = mapped_column(String(255), nullable=True)

    order = relationship("Order", back_populates="items")