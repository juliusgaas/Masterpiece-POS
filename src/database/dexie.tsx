import Dexie, { type Table } from "dexie";

export interface User {
    token: string;
    username?: string;
    id?: number;
}

export interface Product {
    id: number;
    item_code: string;
    name: string;
    description?: string;
    category_id?: number;
    company_id?: number;
    supplier_id?: number;
    unit?: string;
    cost?: number;
    selling_price: number;
    price_retail?: number;
    price_wholesale?: number;
    price_dealer?: number;
    stock_qty: number;
    min_stock?: number;
    is_active?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Customer {
    id: number;
    name?: string;
    [key: string]: any;
}

export interface Sale {
    id: number;
    user_id?: number;
    invoice_no?: string;
    customer_id?: number;
    payment_status?: string;
    sale_status?: string;
    sync_status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SaleItem {
    id: number;
    sale_id: number;
    product_id: number;
    item_code?: string;
    quantity: number;
    selling_price: number;
    subtotal: number;
}

export interface Payment {
    id: number;
    sale_id: number;
    payment_method: string;
    cash_received: number;
    change: number;
    created_at?: string;
    updated_at?: string;
}

class MasterpiecePOSDatabase extends Dexie {

    users!: Table<User, string>;
    products!: Table<Product, number>;
    customers!: Table<Customer, number>;
    sales!: Table<Sale, number>;
    sale_items!: Table<SaleItem, number>;
    payments!: Table<Payment, number>;

    constructor() {

        super("MasterpiecePOS");

        this.version(1).stores({

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

            sales: `
                id,
                user_id,
                invoice_no,
                customer_id,
                payment_status,
                sale_status,
                sync_status,
                created_at,
                updated_at
            `,

            sale_items: `
                id,
                sale_id,
                product_id,
                item_code,
                quantity,
                selling_price,
                subtotal
            `,

            payments: `
                id,
                sale_id,
                payment_method,
                cash_received,
                change,
                created_at,
                updated_at
            `
        });
    }
}

export const db = new MasterpiecePOSDatabase();

