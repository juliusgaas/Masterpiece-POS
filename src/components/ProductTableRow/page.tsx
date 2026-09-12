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

    return (
        <tr className={`product-table-row ${stock <= 0 ? "out-of-stock" : " row-item"} `}>
            {/* # */}
            <td className="text-center">
                {index + 1}
            </td>

            {/* IMAGE */}
            <td>
                <div className="product-table-image">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <Package size={32} />
                    )}
                </div>
            </td>

            {/* PRODUCT NAME */}
            <td>
                <div
                    className="product-table-name"
                    title={product.name}
                >
                    {product.name}
                </div>
            </td>

            {/* SKU */}
            <td>
                <span className="product-table-sku">
                    SKU: {product.sku}
                </span>
            </td>

            {/* PRICE */}
            <td className="text-end">
                <strong>
                    ₱
                    {price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                    })}
                </strong>
            </td>

            {/* STOCK */}
            <td className="text-center">
                <span
                    className={
                        stock > 0
                            ? "stock-available"
                            : "stock-empty"
                    }
                >
                    {product.stock_qty}
                </span>
            </td>

            {/* UOM */}
            <td className="text-center">
                {product.uom ?? "pcs"}
            </td>

            {/* ACTION */}
            <td className="text-center">
                <button
                    type="button"
                    className="btn btn-success btn-sm product-add-btn"
                    disabled={stock <= 0}
                    onClick={() => onClick(product)}
                >
                    <span className="me-1">+</span>
                    Add
                </button>
            </td>
        </tr>
    );
}