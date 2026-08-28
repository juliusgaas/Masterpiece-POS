import './ProductsCard.css'
interface Product {
    id: number;
    name: string;
    selling_price: string;
    stock_qty: number;
}

interface Props {
    product: Product;
    onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: Props) {
    return (
        <div
            className="card bg-success text-white product-card h-100 shadow"
            onClick={() => onClick(product)}
        >
            <div className="card-body">
                <h6>{product.name}</h6>

                <div className="fw-bold ">
                    ₱{Number(product.selling_price).toFixed(2)}
                </div>

                <small>Stock: {product.stock_qty}</small>
               
            </div>
        </div>
    );
}