import { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface CheckoutModalProps {
    show: boolean;
    onClose: () => void;
    total: number;
    onComplete: (payment: {
        paymentMethod: string;
        cashReceived: number;
        change: number;
    }) => void;
}

export default function CheckoutModal({
    show,
    onClose,
    total,
    onComplete
}: CheckoutModalProps) {

    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [cashReceived, setCashReceived] = useState("");
    const cashInputRef = useRef<HTMLInputElement>(null);

    const cash = Number(cashReceived) || 0;
    const change = cash >= total ? cash - total : 0;

    useEffect(() => {
        if (show) {
            setCashReceived("");
            setPaymentMethod("Cash");

            setTimeout(() => {
                cashInputRef.current?.focus();
            }, 200);
        }
    }, [show]);

    const handleComplete = () => {

        if (paymentMethod === "Cash" && cash < total) {
            alert("Insufficient cash.");
            return;
        }

        onComplete({
            paymentMethod,
            cashReceived: cash,
            change
        });
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
        >

            <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <h2 className="text-center fw-bold mb-4">
                    ₱{total.toFixed(2)}
                </h2>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Payment Method
                    </Form.Label>

                    <Form.Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option>Cash</option>
                        <option>GCash</option>
                        <option>Credit Card</option>
                        <option>Bank Transfer</option>
                    </Form.Select>

                </Form.Group>

                {paymentMethod === "Cash" && (

                    <>
                        <Form.Group className="mb-3">

                            <Form.Label>
                                Cash Received
                            </Form.Label>

                            <Form.Control
                                ref={cashInputRef}
                                type="number"
                                value={cashReceived}
                                onChange={(e) =>
                                    setCashReceived(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        cash >= total
                                    ) {
                                        handleComplete();
                                    }
                                }}
                                placeholder="0.00"
                            />

                        </Form.Group>

                        <Alert variant="success">

                            <div className="d-flex justify-content-between">

                                <strong>Change</strong>

                                <strong>
                                    ₱{change.toFixed(2)}
                                </strong>

                            </div>

                        </Alert>

                    </>

                )}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel (Esc)
                </Button>

                <Button
                    variant="success"
                    onClick={handleComplete}
                    disabled={
                        paymentMethod === "Cash" &&
                        cash < total
                    }
                >
                    Complete Sale (Enter)
                </Button>

            </Modal.Footer>

        </Modal>
    );
}