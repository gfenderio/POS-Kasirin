import { describe, it, expect } from "vitest";
import { calculateSale, CartItem } from "./saleEngine";

describe("saleEngine", () => {
    it("should calculate base subtotal correctly with no discounts", () => {
        const items: CartItem[] = [
            { productId: "p1", qty: 2, unitPrice: 10000 },
            { productId: "p2", qty: 1, unitPrice: 20000 },
        ];

        const result = calculateSale(items);

        expect(result.totalBase).toBe(40000);
        expect(result.totalDiscount).toBe(0);
        expect(result.finalAmount).toBe(40000);

        expect(result.items[0].subtotalFinal).toBe(20000);
        expect(result.items[1].subtotalFinal).toBe(20000);
    });

    it("should calculate DISCOUNT_PERCENT item promo correctly", () => {
        const items: CartItem[] = [
            {
                productId: "p1",
                qty: 2,
                unitPrice: 10000,
                itemPromo: { type: "DISCOUNT_PERCENT", value: 10 } // 10% off
            }
        ];

        const result = calculateSale(items);

        expect(result.totalBase).toBe(20000);
        expect(result.totalDiscount).toBe(2000); // 10% of 20k
        expect(result.finalAmount).toBe(18000);
    });

    it("should calculate BUY_X_GET_Y item promo correctly", () => {
        const items: CartItem[] = [
            {
                productId: "p1",
                qty: 3,
                unitPrice: 10000,
                itemPromo: { type: "BUY_X_GET_Y", value: 0, minQty: 2, rewardQty: 1 } // Buy 2 Get 1
            }
        ];

        const result = calculateSale(items);

        // Base is 30k. Buy 2 get 1 -> 1 free out of 3. Discount is 10k.
        expect(result.totalBase).toBe(30000);
        expect(result.totalDiscount).toBe(10000);
        expect(result.finalAmount).toBe(20000);
    });

    it("should apply tiered discounts correctly (Item Promo + Member + Global)", () => {
        const items: CartItem[] = [
            {
                productId: "p1",
                qty: 2,
                unitPrice: 50000, // 100k
                itemPromo: { type: "DISCOUNT_PERCENT", value: 10 } // 10k off -> 90k
            }
        ];

        // 5% member discount on 90k -> 4.5k off. Total subtotal -> 85.5k.
        // 5.5k global discount -> 80k.
        const result = calculateSale(items, 5, 5500);

        expect(result.totalBase).toBe(100000);
        const expectedDiscount = 10000 + 4500 + 5500; // 20000
        expect(result.totalDiscount).toBe(expectedDiscount);
        expect(result.finalAmount).toBe(80000);
    });
});
