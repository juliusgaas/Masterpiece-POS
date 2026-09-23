import { db } from "../database/dexie";

interface HoldSalePayload {
    customer_id?: number;
    cashier_id?: number;
    branch_id?: number;

    subtotal: number;
    discount: number;
    tax: number;
    total: number;

    notes?: string;

    items?: {
        product_id: number;
        quantity: number;
        unit_price: number;
        discount?: number;
        subtotal: number;
    }[];
}

export const generateHoldNumber = async (): Promise<string> => {

    const lastSale = await db.held_sales
        .orderBy("id")
        .last();

    const nextId = (lastSale?.id ?? 0) + 1;

    return `HOLD-${String(nextId).padStart(6, "0")}`;
};

export const createHoldSale = async (
    payload: HoldSalePayload
) => {

    if (!payload.items?.length) {
        throw new Error("Cannot hold an empty cart.");
    }

    const holdNumber = await generateHoldNumber();

    const now = new Date();

    const heldSaleId = await db.transaction(
        "rw",
        db.held_sales,
        db.held_sale_items,
        async () => {

            const id = await db.held_sales.add({
                hold_number: holdNumber,

                customer_id: payload.customer_id,
                cashier_id: payload.cashier_id,
                branch_id: payload.branch_id,

                subtotal: payload.subtotal,
                discount: payload.discount,
                tax: payload.tax,
                total: payload.total,

                notes: payload.notes,

                status: "HELD",

                held_at: now.toISOString(),

                // optional: 24 hours expiration
                expires_at: new Date(
                    now.getTime() + 24 * 60 * 60 * 1000
                ).toISOString()
            } as unknown as Parameters<typeof db.held_sales.add>[0]);

            await db.held_sale_items.bulkAdd(
                payload.items?.map(item => ({
                    held_sale_id: id,

                    product_id: item.product_id,

                    quantity: item.quantity,

                    unit_price: item.unit_price,

                    discount: item.discount ?? 0,

                    subtotal: item.subtotal
                })) as unknown as Parameters<
                    typeof db.held_sale_items.bulkAdd
                >[0]
            );

            return id;
        }
    );

    return {
        id: heldSaleId,
        hold_number: holdNumber
    };
};