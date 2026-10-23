
import './ProductRow.css';
import { Package } from "lucide-react";

interface Props {
    product: any;
    index: number;
    onClick: (product: any) => void;
}

export default function ProductTableRow({
    product,
    index,
    onClick,
}: Props) {
    const stock = Number(product.stock_qty ?? 0);
    const price = Number(product.selling_price ?? 0);
    const sku = product.item_code ?? product.sku ?? "N/A";
    const unit = product.unit ?? product.uom ?? "pcs";
    const isActive =
        product.is_active === undefined ||
        Number(product.is_active) === 1;

    return (
        <tr
            className={`product-table-row ${
                stock <= 0 ? "out-of-stock" : "row-item"
            }`}
        >
            <td className="text-center">{index + 1}</td>

            <td>
                <div className="product-table-image">
                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <Package size={32} />
                    )}
                </div>
            </td>

            <td>
                <div className="product-table-name" title={product.name}>
                    {product.name}
                </div>
            </td>

            <td>
                <span className="product-table-sku">
                    SKU: {sku}
                </span>
            </td>

            <td className="text-end">
                <strong>
                    ₱{price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </strong>
            </td>

            <td className="text-center">
                <span className={stock > 0 ? "stock-available" : "stock-empty"}>
                    {stock}
                </span>
            </td>

            <td className="text-center">{unit}</td>

            <td className="text-center">
                <button
                    type="button"
                    className="btn btn-success btn-sm product-add-btn"
                    disabled={stock <= 0 || !isActive}
                    onClick={() => onClick(product)}
                    title={!isActive ? "Product is inactive" : stock <= 0 ? "Out of stock" : "Add product"}
                >
                    <span className="me-1">+</span>
                    Add
                </button>
            </td>
        </tr>
    );
}
