
import ProductCard from "../ProductsCard/ProductsCard";

interface Props {
    products: any[];
    onSelect: (product: any) => void;
}

export default function ProductGrid({
    products,
    onSelect,
}: Props) {
    const activeProducts = products.filter(
        (product) =>
            product.is_active === undefined ||
            Number(product.is_active) === 0
    );

    if (activeProducts.length === 0) {
        return (
            <div className="col-12">
                <div className="text-center py-5 px-3 border rounded bg-light">
                    <div className="mb-3">
                        <i className="bi bi-box-seam fs-1 text-secondary"></i>
                    </div>

                    <h5 className="fw-semibold">
                        No Active Products
                    </h5>

                    <p className="text-muted mb-0">
                        {products.length === 0
                            ? "No products found in your inventory."
                            : "No active products available. Please activate products in your inventory."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {activeProducts.map((product) => (
                <div
                    key={product.id}
                    className="col-lg-3 col-md-4 col-6 mb-3"
                >
                    <ProductCard
                        product={product}
                        onClick={onSelect}
                    />
                </div>
            ))}
        </div>
    );
}
