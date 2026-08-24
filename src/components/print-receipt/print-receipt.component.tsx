import { useEffect } from 'react';
import './PrintReceipt.css';

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

interface PrintReceiptProps {
    sale: Sale;
    onPrinted?: () => void;
}

export default function PrintReceipt({
    sale,
    onPrinted
}: PrintReceiptProps) {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
            if (onPrinted) {
                onPrinted();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [sale, onPrinted]);

    return (
        <div className="receipt-print">

            <div className="receipt">

                {/* STORE */}
                <div className="receipt-center">

                    <h2>
                        MY POS
                    </h2>

                    <div>
                        Store Address
                    </div>

                    <div>
                        Contact Number
                    </div>

                </div>


                <div className="receipt-line">
                    --------------------------------
                </div>


                {/* DATE */}
                <div>
                    Date: {sale.date}
                </div>


                <div className="receipt-line">
                    --------------------------------
                </div>


                {/* ITEMS */}
                {sale.items.map(item => (

                    <div
                        key={item.id}
                        className="receipt-item"
                    >

                        <div className="receipt-item-name">

                            {item.name}

                        </div>


                        <div className="receipt-item-row">

                            <span>
                                {item.quantity} x ₱
                                {Number(
                                    item.selling_price
                                ).toFixed(2)}
                            </span>


                            <span>
                                ₱
                                {item.subtotal.toFixed(2)}
                            </span>

                        </div>

                    </div>

                ))}


                <div className="receipt-line">
                    --------------------------------
                </div>


                {/* TOTAL */}
                <div className="receipt-row receipt-total">

                    <strong>
                        TOTAL
                    </strong>

                    <strong>
                        ₱{sale.total.toFixed(2)}
                    </strong>

                </div>


                {/* PAYMENT */}
                <div className="receipt-row">

                    <span>
                        Payment
                    </span>

                    <span>
                        {sale.paymentMethod}
                    </span>

                </div>


                {/* CASH */}
                <div className="receipt-row">

                    <span>
                        Cash
                    </span>

                    <span>
                        ₱
                        {sale.cashReceived.toFixed(2)}
                    </span>

                </div>


                {/* CHANGE */}
                <div className="receipt-row">

                    <span>
                        Change
                    </span>

                    <span>
                        ₱
                        {sale.change.toFixed(2)}
                    </span>

                </div>


                <div className="receipt-line">
                    --------------------------------
                </div>


                {/* THANK YOU */}
                <div className="receipt-center">

                    <strong>
                        Thank you!
                    </strong>

                    <div>
                        Please come again.
                    </div>

                </div>

            </div>

        </div>

    );
}