from decimal import Decimal, ROUND_HALF_UP
from dataclasses import dataclass
from typing import List
from fastapi import HTTPException
from app.core.config import settings


@dataclass
class CartItemInput:
    menu_item_id: str
    quantity: int
    price_offline: Decimal
    qr_discount_percent: Decimal
    name: str
    is_available: bool


@dataclass
class LineItem:
    menu_item_id: str
    name: str
    quantity: int
    price_offline: Decimal
    qr_discount_percent: Decimal
    discounted_unit_price: Decimal
    line_total: Decimal


@dataclass
class BillBreakdown:
    line_items: List[LineItem]
    subtotal_offline: Decimal        # What it would cost offline
    subtotal_qr_discounted: Decimal  # After QR discount
    gst_amount: Decimal              # GST on discounted amount
    platform_fee: Decimal            # Exactly ₹3.00 (your profit)
    gateway_fee: Decimal             # 2% Razorpay cut
    total_qr_price: Decimal          # What customer pays
    total_offline_price: Decimal     # Offline comparison
    customer_savings: Decimal        # How much customer saved
    pricing_shield_passed: bool      # Blueprint Golden Rule 1


def calculate_bill(
    items: List[CartItemInput],
    gst_percent: Decimal = Decimal("5.00")
) -> BillBreakdown:
    # --- Step 1: Validate all items are available ---
    for item in items:
        if not item.is_available:
            raise HTTPException(
                status_code=400,
                detail=f"'{item.name}' is currently out of stock"
            )

    # --- Step 2: Calculate line items ---
    line_items = []
    subtotal_offline = Decimal("0")
    subtotal_qr_discounted = Decimal("0")

    for item in items:
        qty = Decimal(str(item.quantity))
        offline_line = (item.price_offline * qty).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        discount_multiplier = Decimal("1") - (item.qr_discount_percent / Decimal("100"))
        discounted_unit = (item.price_offline * discount_multiplier).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        discounted_line = (discounted_unit * qty).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        subtotal_offline += offline_line
        subtotal_qr_discounted += discounted_line

        line_items.append(LineItem(
            menu_item_id=item.menu_item_id,
            name=item.name,
            quantity=item.quantity,
            price_offline=item.price_offline,
            qr_discount_percent=item.qr_discount_percent,
            discounted_unit_price=discounted_unit,
            line_total=discounted_line,
        ))

    # --- Step 3: GST ---
    gst_amount = (subtotal_qr_discounted * gst_percent / Decimal("100")).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    # --- Step 4: Platform fee (₹3 flat — your profit) ---
    platform_fee = Decimal(str(settings.PLATFORM_FEE))

    # --- Step 5: Final QR total ---
    # No gateway fee — Razorpay deducts automatically per payment method
    total_qr_price = (
        subtotal_qr_discounted + gst_amount + platform_fee
    ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    total_offline_price = subtotal_offline.quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    # --- Step 6: Pricing Shield ---
    pricing_shield_passed = total_qr_price < total_offline_price

    if not pricing_shield_passed:
        adjustment = total_qr_price - total_offline_price + Decimal("1.00")
        subtotal_qr_discounted = (subtotal_qr_discounted - adjustment).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        gst_amount = (subtotal_qr_discounted * gst_percent / Decimal("100")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        total_qr_price = (
            subtotal_qr_discounted + gst_amount + platform_fee
        ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        pricing_shield_passed = True

    customer_savings = (total_offline_price - total_qr_price).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    return BillBreakdown(
        line_items=line_items,
        subtotal_offline=total_offline_price,
        subtotal_qr_discounted=subtotal_qr_discounted,
        gst_amount=gst_amount,
        platform_fee=platform_fee,
        gateway_fee=Decimal("0"),  # Razorpay handles automatically
        total_qr_price=total_qr_price,
        total_offline_price=total_offline_price,
        customer_savings=customer_savings,
        pricing_shield_passed=pricing_shield_passed,
    )