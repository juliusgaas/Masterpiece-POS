import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { db, type HeldSale } from "../../database/dexie";

interface HeldSaleRowProps {
    sale: HeldSale;

    onRetrieve: (
        sale: HeldSale
    ) => void;

    onCancel: (
        sale: HeldSale
    ) => void;
}

function HeldSaleRow({
    sale,
    onRetrieve,
    onCancel
}: HeldSaleRowProps) {

    const [itemCount, setItemCount] =
        useState(0);

    useEffect(() => {

        db.held_sale_items
            .where("held_sale_id")
            .equals(sale.id)
            .count()
            .then(setItemCount);

    }, [sale.id]);

    return (
        <tr>

            <td>

                <strong>
                    {sale.hold_number}
                </strong>

            </td>

            <td>

                <small>
                    {new Date(
                        sale.held_at
                    ).toLocaleString(
                        "en-PH",
                        {
                            dateStyle: "medium",
                            timeStyle: "short"
                        }
                    )}
                </small>

            </td>

            <td className="text-center">

                {itemCount}

            </td>

            <td className="text-end">

                <strong>
                    {new Intl.NumberFormat(
                        "en-PH",
                        {
                            style: "currency",
                            currency: "PHP"
                        }
                    ).format(sale.total)}
                </strong>

            </td>

            <td>

                <div className="
                    d-flex
                    gap-2
                    justify-content-center
                ">

                    <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                            onRetrieve(sale)
                        }
                    >
                        Retrieve
                    </Button>

                    <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                            onCancel(sale)
                        }
                    >
                        Cancel
                    </Button>

                </div>

            </td>

        </tr>
    );
}