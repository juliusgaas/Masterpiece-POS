import ProductTableRow from "../ProductTableRow/page";

interface Props {
    products: any[];
    onSelect: (product: any) => void;
}

export default function ProductTable({
    products,
    onSelect,
}: Props) {
    return (
        <div className="card table-responsive">
            <table className="table product-table align-middle mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th className="text-end">Price</th>
                        <th className="text-center">Stock</th>
                        <th className="text-center">UOM</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product, index) => (
                        <ProductTableRow
                            key={product.id}
                            product={product}
                            index={index}
                            onClick={onSelect}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}