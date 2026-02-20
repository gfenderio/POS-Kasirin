export type PromoType = "DISCOUNT_PERCENT" | "DISCOUNT_AMOUNT" | "BUY_X_GET_Y";

export interface PromoParams {
    type: PromoType;
    value: number; // For PERCENT: 10 means 10%. For AMOUNT: 10000 flat idr. 
    minQty?: number;
    rewardQty?: number;
}

export interface CartItem {
    productId: string;
    qty: number;
    unitPrice: number;
    itemPromo?: PromoParams; // Promo specific to this product
}

export interface CalculateSaleResult {
    items: Array<{
        productId: string;
        qty: number;
        unitPrice: number;
        subtotalBase: number; // qty * unitPrice
        discountAmount: number; // total discount for this item
        subtotalFinal: number; // subtotalBase - discountAmount
    }>;
    totalBase: number;
    totalDiscount: number;
    finalAmount: number;
}

/**
 * Pure function to calculate tiered sales structure.
 * 
 * Rules:
 * 1. Product-level promos applied first (itemPromo)
 * 2. Member discount applied to the rest of the bill
 * 3. Additional global discount applied last 
 */
export function calculateSale(
    items: CartItem[],
    memberDiscountPercent: number = 0,
    globalDiscountAmount: number = 0
): CalculateSaleResult {
    let totalBase = 0;
    let totalDiscount = 0;

    const processedItems = items.map((item) => {
        const subtotalBase = item.qty * item.unitPrice;
        let itemDiscount = 0;

        // 1. Calculate Product-specific Promo
        if (item.itemPromo) {
            const { type, value, minQty, rewardQty } = item.itemPromo;

            if (type === "DISCOUNT_PERCENT") {
                itemDiscount += subtotalBase * (value / 100);
            } else if (type === "DISCOUNT_AMOUNT") {
                itemDiscount += value * item.qty; // Discount per item qty
            } else if (type === "BUY_X_GET_Y" && minQty && rewardQty) {
                // e.g. Buy 2 Get 1 Free -> every complete set of (minQty + rewardQty) gets (rewardQty) free
                const setSize = minQty + rewardQty;
                const freeItems = Math.floor(item.qty / setSize) * rewardQty;
                itemDiscount += freeItems * item.unitPrice;
            }
        }

        // Ensure discount doesn't exceed base
        itemDiscount = Math.min(itemDiscount, subtotalBase);

        totalBase += subtotalBase;
        totalDiscount += itemDiscount;

        return {
            productId: item.productId,
            qty: item.qty,
            unitPrice: item.unitPrice,
            subtotalBase,
            discountAmount: itemDiscount,
            subtotalFinal: subtotalBase - itemDiscount,
        };
    });

    // 2. Member Discount (applied to the total after product promos)
    let subtotalAfterItemPromo = totalBase - totalDiscount;
    let memberDiscountAmount = 0;
    if (memberDiscountPercent > 0) {
        memberDiscountAmount = subtotalAfterItemPromo * (memberDiscountPercent / 100);
        totalDiscount += memberDiscountAmount;
    }

    // 3. Global Discount Amount
    totalDiscount += globalDiscountAmount;

    // Cap total discount to total base
    totalDiscount = Math.min(totalDiscount, totalBase);
    const finalAmount = totalBase - totalDiscount;

    return {
        items: processedItems,
        totalBase,
        totalDiscount,
        finalAmount
    };
}
