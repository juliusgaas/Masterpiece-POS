import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Table,
    Spinner,
    Alert
} from "react-bootstrap";

import { db } from "../../database/dexie";

interface HeldSale {
    id: number;
    hold_number: string;
    customer_id?: number;
    cashier_id?: number;
    branch_id?: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    notes?: string;
    status: "HELD" | "COMPLETED" | "CANCELLED";
    held_at: string;
    expires_at?: string;
}

interface HeldSaleItem {
    id: number;
    held_sale_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    discount: number;
    subtotal: number;
}

interface HeldSalesModalProps {
    show: boolean;
    onClose: () => void;

    onRetrieve: (
        sale: HeldSale,
        items: HeldSaleItem[]
    ) => void;
}

interface HeldSaleRowProps {
    sale: HeldSale;
    onRetrieve: (sale: HeldSale) => void;
    onCancel: (sale: HeldSale) => void;
}

function HeldSaleRow({
    sale,
    onRetrieve,
    onCancel
}: HeldSaleRowProps) {
    const [itemCount, setItemCount] = useState<number | null>(null);

    useEffect(() => {
        db.held_sale_items
            .where("held_sale_id")
            .equals(sale.id)
            .count()
            .then(setItemCount)
            .catch(() => setItemCount(0));
    }, [sale.id]);

    return (
        <tr>
            <td>{sale.hold_number}</td>
            <td>{new Date(sale.held_at).toLocaleString("en-PH", {
                dateStyle: "medium",
                timeStyle: "short"
            })}</td>
            <td className="text-center">{itemCount ?? "..."}</td>
            <td className="text-end">{new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP"
            }).format(sale.total)}</td>
            <td className="text-center">
                <Button
                    size="sm"
                    variant="success"
                    className="me-2"
                    onClick={() => onRetrieve(sale)}
                >
                    Retrieve
                </Button>
                <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => onCancel(sale)}
                >
                    Cancel
                </Button>
            </td>
        </tr>
    );
}

export default function HeldSalesModal({
    show,
    onClose,
    onRetrieve
}: HeldSalesModalProps) {

    const [heldSales, setHeldSales] =
        useState<HeldSale[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadHeldSales = async () => {

        try {

            setLoading(true);
            setError("");

            const sales =
                await db.held_sales
                    .where("status")
                    .equals("HELD")
                    .reverse()
                    .sortBy("held_at");

            setHeldSales(
                sales as HeldSale[]
            );

        } catch (error) {

            console.error(
                "Failed to load held sales:",
                error
            );

            setError(
                "Failed to load held sales."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        if (show) {
            loadHeldSales();
        }

    }, [show]);

    // const formatCurrency = (
    //     value: number
    // ) => {

    //     return new Intl.NumberFormat(
    //         "en-PH",
    //         {
    //             style: "currency",
    //             currency: "PHP"
    //         }
    //     ).format(value);

    // };

    // const formatDate = (
    //     value: string
    // ) => {

    //     return new Date(value)
    //         .toLocaleString("en-PH", {
    //             dateStyle: "medium",
    //             timeStyle: "short"
    //         });

    // };

    const handleRetrieve = async (
        sale: HeldSale
    ) => {

        try {

            const items =
                await db.held_sale_items
                    .where("held_sale_id")
                    .equals(sale.id)
                    .toArray();

            if (!items.length) {

                alert(
                    "This held sale has no items."
                );

                return;
            }

            onRetrieve(
                sale,
                items as HeldSaleItem[]
            );

            onClose();

        } catch (error) {

            console.error(
                "Failed to retrieve held sale:",
                error
            );

            alert(
                "Failed to retrieve held sale."
            );
        }
    };

    const handleCancel = async (
        sale: HeldSale
    ) => {

        const confirmed =
            window.confirm(
                `Cancel ${sale.hold_number}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await db.transaction(
                "rw",
                db.held_sales,
                db.held_sale_items,
                async () => {

                    await db.held_sales.update(
                        sale.id,
                        {
                            status: "CANCELLED"
                        }
                    );

                    await db.held_sale_items
                        .where("held_sale_id")
                        .equals(sale.id)
                        .delete();

                }
            );

            await loadHeldSales();

        } catch (error) {

            console.error(
                "Failed to cancel held sale:",
                error
            );

            alert(
                "Failed to cancel held sale."
            );
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            size="lg"
            backdrop="static"
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    Held Sales
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}

                {loading ? (

                    <div className="
                        d-flex
                        justify-content-center
                        align-items-center
                        py-5
                    ">

                        <Spinner
                            animation="border"
                            variant="success"
                        />

                        <span className="ms-2">
                            Loading held sales...
                        </span>

                    </div>

                ) : heldSales.length === 0 ? (

                    <Alert
                        variant="light"
                        className="text-center mb-0"
                    >
                        No held sales found.
                    </Alert>

                ) : (

                    <div className="table-responsive">

                        <Table
                            hover
                            bordered
                            className="align-middle mb-0"
                        >

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        Hold #
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th className="text-center">
                                        Items
                                    </th>

                                    <th className="text-end">
                                        Total
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            width: "180px"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {heldSales.map(
                                    (sale) => (
                                        <HeldSaleRow
                                            key={sale.id}
                                            sale={sale}
                                            onRetrieve={
                                                handleRetrieve
                                            }
                                            onCancel={
                                                handleCancel
                                            }
                                        />
                                    )
                                )}

                            </tbody>

                        </Table>

                    </div>

                )}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Close (Esc)
                </Button>

            </Modal.Footer>

        </Modal>
    );
}