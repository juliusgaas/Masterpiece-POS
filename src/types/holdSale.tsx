export interface HoldSalePayload {
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
