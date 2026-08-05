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
    pending_sales: "++id,status"
});