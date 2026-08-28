import { useEffect, useState } from 'react';
import './cart.css';
import CheckoutModal from '../Checkout-Modal/Checkout';
import PrintReceipt from '../print-receipt/print-receipt.component';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    id: number;
    name: string;
    selling_price: string;
    quantity: number;
    subtotal: number;
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
    onClear
}: CartProps) {
     const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    // Receipt nga i-print
    const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);

    const total = items.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    const openCheckout = () => {
        console.log("Checkout opened");
        setShowCheckout(true);
    };
    const completeSale = (payment:any) => {
        console.log(payment);
         // Create sale BEFORE clearing cart
        const sale: Sale = {
            items: [...items],
            total: total,
            paymentMethod: payment.paymentMethod,
            cashReceived: payment.cashReceived,
            change: payment.change,
            date: new Date().toLocaleString()
        };
        
        /*
        {
            paymentMethod: "Cash",
            cashReceived: 12000,
            change: 660
        }
        */

        // Set receipt
        setSaleToPrint(sale);


        // TODO:
        // Save Sale API
        // Print Receipt
        // Clear Cart

       

        setShowCheckout(false);
    };
    const goToQuotation = () => {
       
        navigate("/quotation");
    };
  useEffect(() => {
    const handleKeyDown = (e:any) => {
        if (e.key === "F8") {
            e.preventDefault();
            goToQuotation();
        }
        if (e.key === "F9") {
            e.preventDefault(); // para dili mo-trigger ang browser default
            openCheckout();
        }

        if(e.key === "Escape"){
            e.preventDefault(); 
            setShowCheckout(false);
        }

        if(e.key === "F10"){
            e.preventDefault(); 
            onClear();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

    return (
        <>
        <div className="card shadow h-100" >
            <div className="card-header">
                <h5 className="mb-0">Current Sales</h5>
            </div>
            <div className="card-body" style={{ minHeight: "30rem", maxHeight: "30rem", overflowY: "auto" }}>
                {items.length === 0 ? (
                    <p className="text-muted">
                        No items in cart.
                    </p>
                ) : (
                    <>
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="border-bottom py-2 hover"
                            >
                                <div className="fw-bold">
                                    {item.name}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-2">

                                    <div>

                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => onDecrease(item.id)}
                                        >
                                            -
                                        </button>

                                        <span className="mx-2">
                                            {item.quantity}  
                                            
                                        </span>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => onIncrease(item.id)}
                                        >
                                            +
                                        </button>

                                    </div>

                                    <div>

                                        ₱{item.subtotal.toFixed(2)}

                                        <button
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={() => onRemove(item.id)}
                                        >
                                            ×
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}
                    </>

                )}

            </div>

            <div className="card-footer">
                <div className="d-flex justify-content-between">

                            <strong>Total</strong>

                            <strong>
                                ₱{total.toFixed(2)}
                            </strong>

                        </div>

                        <button className="btn btn-success w-100 mt-3" onClick={openCheckout}>
                            <b>F9</b> - Checkout
                        </button>

                        <CheckoutModal
                            show={showCheckout}
                            onClose={() => setShowCheckout(false)}
                            total={total}
                            onComplete={completeSale}
                        />
            </div>
        </div>

        {saleToPrint && (
            <PrintReceipt
                sale={saleToPrint}
                onPrinted={() => {
                     onClear();
                    // Remove receipt component
                    setSaleToPrint(null);

                }}
            />
        )}
        </>
    );
}