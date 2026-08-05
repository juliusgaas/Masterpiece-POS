import ProductCard from "../ProductsCard/ProductsCard";

interface Props {
    products: any[];
    onSelect: (product: any) => void;
}

export default function ProductGrid({
    products,
    onSelect,
}: Props) {
    return (
        <div className="row">
            {products.map(product => (
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