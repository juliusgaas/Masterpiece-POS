import "./ProductsCard.css";
import { Plus, Package } from "lucide-react";

interface Product {
    id: number;
    name: string;
    selling_price: string;
    stock_qty: number;
    sku?: string;
    image?: string;
}

interface Props {
    product: Product;
    onClick: (product: Product) => void;
}

export default function ProductCard({
    product,
    onClick,
}: Props) {

    const isOutOfStock = product.stock_qty <= 0;

    return (
        <div
            className={`product-card ${isOutOfStock ? "out-of-stock" : ""
                }`}
        >

            {/* PRODUCT IMAGE */}
            <div className="product-card-image">

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                    />
                ) : (
                    <Package size={42} />
                )}

            </div>


            {/* PRODUCT INFO */}
            <div className="product-card-info">

                <div className="product-card-name">
                    {product.name}
                </div>

                <div className="product-card-sku">
                    SKU: {product.sku || product.id}
                </div>

                <div className="product-card-price">
                    ₱
                    {Number(
                        product.selling_price
                    ).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                    })}
                </div>


                {/* STOCK */}
                {isOutOfStock ? (

                    <div className="stock-badge out">
                        <span></span>
                        Out of Stock
                    </div>

                ) : (

                    <div className="stock-badge available">
                        Stock: {product.stock_qty}
                    </div>

                )}

            </div>


            {/* ADD BUTTON */}
            <button
                className="product-add-btn"
                disabled={isOutOfStock}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(product);
                }}
            >
                <Plus size={15} />
                Add
            </button>

        </div>
    );
}