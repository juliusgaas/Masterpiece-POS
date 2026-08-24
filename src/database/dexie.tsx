import Dexie from "dexie";

export const db = new Dexie("MasterpiecePOS");

db.version(1).stores({
    users: "token",
    products: `
        id,
        item_code,
        name,
        description,
        category_id,
        company_id,
        supplier_id,
        unit,
        cost,
        selling_price,
        price_retail,
        price_wholesale,
        price_dealer,
        stock_qty,
        min_stock,
        is_active,
        created_at,
        updated_at
    `,
    customers: "id",
    sales: "id, user_id,invoice_no, customer_id, payment_status, sale_status, sync_status, created_at, updated_at",
    sale_items: `
        id,
        sale_id,
        product_id,
        item_code,
        quantity,
        selling_price,
        subtotal
    `,
    payments: "id, sale_id, payment_method, cash_received, change, created_at, updated_at"
});