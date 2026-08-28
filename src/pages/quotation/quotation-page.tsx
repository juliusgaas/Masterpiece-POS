import './quotation-page.css';
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Printer,
  Save,
  Search,
  ScanBarcode,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuotationItem {
  id: number;
  sku: string;
  product: string;
  description: string;
  qty: number;
  unitPrice: number;
  discount: number;
}

const QuotationPage: React.FC = () => {
  const navigate = useNavigate();

  const [quotationNo] = useState("QT-2026-00045");

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 1,
      sku: "PRD-0001",
      product: "Product A",
      description: "Sample product A",
      qty: 2,
      unitPrice: 500,
      discount: 0,
    },
    {
      id: 2,
      sku: "PRD-0002",
      product: "Product B",
      description: "Sample product B",
      qty: 1,
      unitPrice: 850,
      discount: 0,
    },
    {
      id: 3,
      sku: "PRD-0003",
      product: "Product C",
      description: "Sample product C",
      qty: 3,
      unitPrice: 300,
      discount: 0,
    },
  ]);

  const [discount, setDiscount] = useState(250);

  const [notes, setNotes] = useState(
    "Thank you for your interest in our products.\nThis quotation is valid within 30 days."
  );

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );
  }, [items]);

  const grandTotal = subtotal - discount;

  const money = (value: number) =>
    `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`;

  const updateItem = (
    id: number,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" ||
                field === "unitPrice" ||
                field === "discount"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addProduct = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        sku: `PRD-${String(prev.length + 1).padStart(4, "0")}`,
        product: "New Product",
        description: "Product description",
        qty: 1,
        unitPrice: 0,
        discount: 0,
      },
    ]);
  };

  const saveDraft = () => {
    console.log({
      quotationNo,
      items,
      subtotal,
      discount,
      grandTotal,
      notes,
      status: "DRAFT",
    });
  };

  const createQuotation = () => {
    console.log({
      quotationNo,
      items,
      subtotal,
      discount,
      grandTotal,
      notes,
      status: "CREATED",
    });
  };

  return (
    <div className="quotation-page bg-light min-vh-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4 py-3">

          <div className="d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-3">

              <button
                className="btn btn-light border-0"
                onClick={() => navigate("/new-sale")}
              >
                <ArrowLeft size={19} />
              </button>

              <h4 className="mb-0 fw-semibold">
                Quotation
              </h4>

            </div>

            <div className="d-flex align-items-center gap-2">

              <span className="badge bg-primary-subtle text-primary px-3 py-2">
                # {quotationNo}
              </span>

              <button
                className="btn btn-outline-secondary"
                onClick={() => window.print()}
              >
                <Printer size={17} />
              </button>

              <button className="btn btn-outline-secondary">
                ⋮
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* ================= CONTENT ================= */}
      <div className="container-fluid px-4 py-3">

        {/* CUSTOMER + QUOTATION DETAILS */}
        <div className="row g-3">

          {/* CUSTOMER */}
          <div className="col-xl-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="fw-semibold mb-3">
                  Customer
                </h6>

                <div className="d-flex gap-2 mb-3">

                  <div className="input-group">

                    <span className="input-group-text bg-white">
                      <Search size={15} />
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search customer by name, phone or email..."
                    />

                  </div>

                  <button className="btn btn-primary d-flex align-items-center gap-1">
                    <Plus size={16} />
                    New
                  </button>

                </div>


                {/* CUSTOMER CARD */}
                <div className="customer-card border rounded p-3 bg-primary-subtle bg-opacity-10">

                  <div className="d-flex gap-3">

                    <div className="customer-avatar bg-primary-subtle text-primary">
                      <User size={18} />
                    </div>

                    <div className="flex-grow-1">

                      <div className="d-flex justify-content-between">

                        <strong className="small">
                          Juan Dela Cruz
                        </strong>

                        <button className="btn btn-sm p-0 text-secondary">
                          <X size={15} />
                        </button>

                      </div>

                      <div className="small text-muted mt-1">
                        ☎ 0999 123 4567
                      </div>

                      <div className="small text-muted">
                        ✉ juan.delacruz@email.com
                      </div>

                      <div className="small text-muted">
                        ⌖ Poblacion, Tagum City, Davao del Norte
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* QUOTATION DETAILS */}
          <div className="col-xl-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="fw-semibold mb-3">
                  Quotation Details
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label small">
                      Date
                    </label>

                    <div className="input-group">

                      <span className="input-group-text bg-white">
                        <Calendar size={15} />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Aug 28, 2026"
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Status
                    </label>

                    <div className="form-control bg-success-subtle text-success fw-semibold text-center">
                      DRAFT
                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Valid Until
                    </label>

                    <div className="input-group">

                      <span className="input-group-text bg-white">
                        <Calendar size={15} />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Sep 27, 2026"
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Reference
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. PO #, SO #, etc."
                    />

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Salesperson
                    </label>

                    <select className="form-select">
                      <option>Admin</option>
                      <option>Cashier</option>
                      <option>Sales Staff</option>
                    </select>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Terms
                    </label>

                    <select className="form-select">
                      <option>30 Days</option>
                      <option>15 Days</option>
                      <option>7 Days</option>
                      <option>Due Immediately</option>
                    </select>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= ITEMS ================= */}
        <div className="card border-0 shadow-sm mt-3">

          <div className="card-body p-0">

            <div className="p-3 d-flex justify-content-between align-items-center">

              <h6 className="fw-semibold mb-0">
                Items
              </h6>

              <div className="d-flex gap-2">

                <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                  <ScanBarcode size={15} />
                  Scan Barcode
                </button>

                <button
                  onClick={addProduct}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus size={15} />
                  Add Product
                </button>

              </div>

            </div>


            {/* TABLE */}
            <div className="table-responsive">

              <table className="table table-bordered align-middle mb-0">

                <thead className="table-light">

                  <tr className="small">

                    <th>#</th>
                    <th>SKU</th>
                    <th>PRODUCT</th>
                    <th>DESCRIPTION</th>
                    <th className="text-center">QTY</th>
                    <th className="text-center">UNIT PRICE</th>
                    <th className="text-center">DISCOUNT</th>
                    <th className="text-end">TOTAL</th>
                    <th></th>

                  </tr>

                </thead>


                <tbody>

                  {items.map((item, index) => {

                    const total =
                      item.qty * item.unitPrice;

                    return (
                      <tr key={item.id}>

                        <td className="small">
                          {index + 1}
                        </td>

                        <td className="small">
                          {item.sku}
                        </td>

                        <td className="small fw-semibold">
                          {item.product}
                        </td>

                        <td className="small text-muted">
                          {item.description}
                        </td>

                        <td style={{ width: 90 }}>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "qty",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm text-center"
                          />
                        </td>

                        <td style={{ width: 130 }}>
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="form-control form-control-sm text-center"
                          />
                        </td>

                        <td style={{ width: 140 }}>

                          <div className="input-group input-group-sm">

                            <input
                              type="number"
                              value={item.discount}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "discount",
                                  e.target.value
                                )
                              }
                              className="form-control text-center"
                            />

                            <span className="input-group-text">
                              %
                            </span>

                          </div>

                        </td>

                        <td className="text-end small fw-semibold">
                          {money(total)}
                        </td>

                        <td className="text-center">

                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="btn btn-sm text-danger"
                          >
                            <Trash2 size={15} />
                          </button>

                        </td>

                      </tr>
                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* ================= NOTES + TOTAL ================= */}
        <div className="row g-3 mt-0">

          {/* NOTES */}
          <div className="col-xl-7">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="fw-semibold">
                  Notes
                </h6>

                <div className="position-relative">

                  <textarea
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                    maxLength={500}
                    className="form-control"
                    rows={5}
                  />

                  <small className="position-absolute bottom-0 end-0 me-2 mb-1 text-muted">
                    {notes.length} / 500
                  </small>

                </div>

              </div>

            </div>

          </div>


          {/* TOTAL */}
          <div className="col-xl-5">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between mb-3">

                  <span className="small">
                    Subtotal
                  </span>

                  <strong className="small">
                    {money(subtotal)}
                  </strong>

                </div>


                <div className="d-flex justify-content-between align-items-center mb-3">

                  <span className="small">
                    Discount
                  </span>

                  <input
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(Number(e.target.value))
                    }
                    className="form-control form-control-sm text-end"
                    style={{ width: 110 }}
                  />

                </div>


                <div className="d-flex justify-content-between mb-3">

                  <span className="small">
                    Tax (0%)
                  </span>

                  <strong className="small">
                    ₱0.00
                  </strong>

                </div>


                <hr />


                <div className="d-flex justify-content-between align-items-center">

                  <strong>
                    GRAND TOTAL
                  </strong>

                  <strong className="fs-4 text-success">
                    {money(grandTotal)}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= FOOTER ================= */}
      <div className="bg-white border-top sticky-bottom">

        <div className="container-fluid px-4 py-3">

          <div className="d-flex justify-content-end gap-2">

            <button
              onClick={() => navigate("/new-sale")}
              className="btn btn-outline-secondary px-4"
            >
              Cancel
            </button>

            <button
              onClick={saveDraft}
              className="btn btn-outline-primary px-4 d-flex align-items-center gap-2"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              onClick={() => window.print()}
              className="btn btn-outline-secondary px-4 d-flex align-items-center gap-2"
            >
              <Printer size={16} />
              Print
            </button>

            <button
              onClick={createQuotation}
              className="btn btn-success px-4"
            >
              ✓ &nbsp; Create Quotation
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuotationPage;