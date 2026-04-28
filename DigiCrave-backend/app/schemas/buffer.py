from pydantic import BaseModel, UUID4
from typing import List, Optional
from decimal import Decimal


class BufferStatusResponse(BaseModel):
    order_id: str
    is_buffer_active: bool
    seconds_remaining: int
    is_locked: bool
    kitchen_status: str
    message: str


class ModifyOrderItem(BaseModel):
    menu_item_id: UUID4
    quantity: int  # 0 = remove item


class ModifyOrderRequest(BaseModel):
    items: List[ModifyOrderItem]


class ModifyOrderResponse(BaseModel):
    order_id: str
    message: str
    seconds_remaining: int
    new_total: Decimal
    items_updated: int


class CancelOrderResponse(BaseModel):
    order_id: str
    message: str
    refund_initiated: bool