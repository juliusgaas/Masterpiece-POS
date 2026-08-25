
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [sale]);


    useEffect(() => {

        const handleAfterPrint = () => {
            if (onPrinted) {
                onPrinted();
            }
        };
        window.addEventListener(
            'afterprint',
            handleAfterPrint
        );
        return () => {
            window.removeEventListener(
                'afterprint',
                handleAfterPrint
            );
        };
    }, [onPrinted]);


    const receipt = (
        <div className="receipt-print">
            <div className="receipt">
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
                <div>
                    Date: {sale.date}
                </div>
                <div className="receipt-line">
                    --------------------------------
                </div>
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
                                ₱{item.subtotal.toFixed(2)}
                            </span>

                        </div>

                    </div>

                ))}

                <div className="receipt-line">
                    --------------------------------
                </div>


                <div className="receipt-row receipt-total">

                    <strong>
                        TOTAL
                    </strong>

                    <strong>
                        ₱{sale.total.toFixed(2)}
                    </strong>

                </div>


                <div className="receipt-row">

                    <span>
                        Payment
                    </span>

                    <span>
                        {sale.paymentMethod}
                    </span>

                </div>


                <div className="receipt-row">

                    <span>
                        Cash
                    </span>

                    <span>
                        ₱{sale.cashReceived.toFixed(2)}
                    </span>

                </div>


                <div className="receipt-row">

                    <span>
                        Change
                    </span>

                    <span>
                        ₱{sale.change.toFixed(2)}
                    </span>

                </div>


                <div className="receipt-line">
                    --------------------------------
                </div>


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


    /*
     * IMPORTANT:
     * Render directly to body,
     * outside Cart DOM.
     */

    return createPortal(
        receipt,
        document.body
    );
}

