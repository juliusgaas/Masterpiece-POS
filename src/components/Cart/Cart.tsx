import { useEffect, useMemo, useState } from "react";
import "./cart.css";
import CheckoutModal from "../Checkout-Modal/Checkout";
import PrintReceipt from "../print-receipt/print-receipt.component";
import { useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    UserRound,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    MoreHorizontal,
    Pause,
    X,
    Percent,
    ChevronDown,
} from "lucide-react";

interface CartItem {
    id: number;
    name: string;
    selling_price: string;
    quantity: number;
    subtotal: number;
    image?: string;
    sku?: string;
}

interface Sale {
    items: CartItem[];
    total: number;
    paymentMethod: string;
    cashReceived: number;
    change: number;
    date: string;
}

interface CartProps {
    items: CartItem[];
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
    onClear: () => void;
}

export default function Cart({
    items,
    onIncrease,
    onDecrease,
    onRemove,
    onClear,
}: CartProps) {
    const navigate = useNavigate();

    const [showCheckout, setShowCheckout] = useState(false);
    const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);

    const [discount, setDiscount] = useState<number>(0);
    const [discountType, setDiscountType] = useState<"percent" | "amount">(
        "percent"
    );

    const [taxRate] = useState<number>(0);

    const subtotal = useMemo(() => {
        return items.reduce(
            (sum, item) => sum + Number(item.subtotal || 0),
            0
        );
    }, [items]);

    const discountAmount = useMemo(() => {
        if (!discount) return 0;

        if (discountType === "percent") {
            return Math.min(
                subtotal,
                subtotal * (Number(discount) / 100)
            );
        }

        return Math.min(subtotal, Number(discount));
    }, [discount, discountType, subtotal]);

    const taxableAmount = Math.max(0, subtotal - discountAmount);

    const taxAmount = useMemo(() => {
        return taxableAmount * (taxRate / 100);
    }, [taxableAmount, taxRate]);

    const total = Math.max(
        0,
        taxableAmount + taxAmount
    );

    const openCheckout = () => {
        if (items.length === 0) return;
        setShowCheckout(true);
    };

    const completeSale = (payment: any) => {
        const sale: Sale = {
            items: [...items],
            total,
            paymentMethod: payment.paymentMethod,
            cashReceived: payment.cashReceived,
            change: payment.change,
            date: new Date().toLocaleString(),
        };

        setSaleToPrint(sale);
        setShowCheckout(false);
    };

    const goToQuotation = () => {
        navigate("/quotation");
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F8") {
                e.preventDefault();
                goToQuotation();
            }

            if (e.key === "F9") {
                e.preventDefault();
                openCheckout();
            }

            if (e.key === "Escape") {
                e.preventDefault();
                setShowCheckout(false);
            }

            if (e.key === "F10") {
                e.preventDefault();
                onClear();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [items, total]);

    return (
        <>
            <div className="pos-cart">

                {/* =========================================
                    CART HEADER
                ========================================= */}

                <div className="cart-header">

                    <div className="cart-title">
                        <ShoppingCart size={21} strokeWidth={2} />

                        <h5>Current Sale</h5>
                    </div>

                    <div className="cart-actions">

                        <button
                            className="cart-top-btn"
                            title="Hold Sale"
                        >
                            <Pause size={15} />
                            <span>Hold Sale</span>
                        </button>

                        <button
                            className="cart-top-btn danger-btn"
                            onClick={onClear}
                            disabled={items.length === 0}
                            title="Clear Cart"
                        >
                            <Trash2 size={15} />
                            <span>Clear Cart</span>
                        </button>

                        <button
                            className="cart-more-btn"
                            title="More"
                        >
                            <MoreHorizontal size={19} />
                        </button>

                    </div>
                </div>


                {/* =========================================
                    CUSTOMER
                ========================================= */}

                <div className="customer-section">

                    <div className="customer-label">
                        <UserRound size={17} />
                        <span>Customer</span>
                    </div>

                    <button className="customer-select">
                        <span>Walk-in Customer</span>
                        <ChevronDown size={14} />
                    </button>

                    <button className="add-customer-btn">
                        <Plus size={17} />
                        <span>Add Customer</span>
                    </button>

                </div>


                {/* =========================================
                    TABLE HEADER
                ========================================= */}

                <div className="cart-table-header">

                    <span className="col-number">#</span>
                    <span className="col-product">Product</span>
                    <span className="col-price">Price</span>
                    <span className="col-qty">Qty</span>
                    <span className="col-total">Total</span>
                    <span className="col-delete"></span>

                </div>


                {/* =========================================
                    PRODUCTS
                ========================================= */}

                <div className="cart-items">

                    {items.length === 0 ? (

                        <div className="empty-cart">

                            <ShoppingCart size={38} />

                            <strong>No items in cart</strong>

                            <span>
                                Add a product to start a sale
                            </span>

                        </div>

                    ) : (

                        items.map((item, index) => (

                            <div
                                key={item.id}
                                className="cart-product"
                            >

                                {/* NUMBER */}

                                <div className="product-number">
                                    {index + 1}
                                </div>


                                {/* PRODUCT */}

                                <div className="product-info">

                                    <div className="product-image">

                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        ) : (
                                            <ShoppingCart size={18} />
                                        )}

                                    </div>

                                    <div className="product-details">

                                        <div className="product-name">
                                            {item.name}
                                        </div>

                                        <div className="product-sku">
                                            SKU: {item.sku || item.id}
                                        </div>

                                    </div>

                                </div>


                                {/* PRICE */}

                                <div className="product-price">
                                    ₱
                                    {Number(
                                        item.selling_price
                                    ).toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>


                                {/* QTY */}

                                <div className="quantity-control">

                                    <button
                                        onClick={() =>
                                            onDecrease(item.id)
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={13} />
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            onIncrease(item.id)
                                        }
                                    >
                                        <Plus size={13} />
                                    </button>

                                </div>


                                {/* TOTAL */}

                                <div className="product-total">
                                    ₱
                                    {Number(
                                        item.subtotal
                                    ).toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>


                                {/* DELETE */}

                                <button
                                    className="delete-item-btn"
                                    onClick={() =>
                                        onRemove(item.id)
                                    }
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        ))

                    )}

                </div>


                {/* =========================================
                    SUMMARY
                ========================================= */}

                <div className="cart-summary">

                    {/* SUBTOTAL */}

                    <div className="summary-row">
                        <span>Subtotal</span>

                        <strong>
                            ₱
                            {subtotal.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                            })}
                        </strong>
                    </div>


                    {/* DISCOUNT */}

                    <div className="summary-row">

                        <span>Discount</span>

                        <div className="discount-control">

                            <button
                                className="discount-type"
                                onClick={() =>
                                    setDiscountType(
                                        discountType === "percent"
                                            ? "amount"
                                            : "percent"
                                    )
                                }
                            >
                                {discountType === "percent" ? (
                                    <Percent size={15} />
                                ) : (
                                    <span>₱</span>
                                )}
                            </button>

                            <input
                                type="number"
                                min="0"
                                value={discount || ""}
                                onChange={(e) =>
                                    setDiscount(
                                        Number(e.target.value)
                                    )
                                }
                                placeholder="0.00"
                            />

                        </div>

                        <strong>
                            ₱
                            {discountAmount.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                            })}
                        </strong>

                    </div>


                    {/* TAX */}

                    <div className="summary-row">

                        <span>
                            Tax ({taxRate}%)
                        </span>

                        <strong>
                            ₱
                            {taxAmount.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                            })}
                        </strong>

                    </div>


                    {/* TOTAL */}

                    <div className="grand-total">

                        <span>Total</span>

                        <strong>
                            ₱
                            {total.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                            })}
                        </strong>

                    </div>


                    {/* CHECKOUT */}

                    <button
                        className="checkout-btn"
                        onClick={openCheckout}
                        disabled={items.length === 0}
                    >
                        <CreditCard size={22} />

                        <span>
                            <b>F9</b>
                            {" - "}
                            Checkout
                        </span>
                    </button>

                </div>

            </div>


            {/* CHECKOUT MODAL */}

            <CheckoutModal
                show={showCheckout}
                onClose={() => setShowCheckout(false)}
                total={total}
                onComplete={completeSale}
            />


            {/* RECEIPT */}

            {saleToPrint && (
                <PrintReceipt
                    sale={saleToPrint}
                    onPrinted={() => {
                        onClear();
                        setSaleToPrint(null);
                    }}
                />
            )}
        </>
    );
}