import './quotation-page.css';
import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import {
  addQuotation,
  getQuotationById,
  updateQuotation,
} from "../../services/QuotationService";
import { db, type Quotation, type QuotationStatus, type Product } from "../../database/dexie";

interface QuotationItem {
  id: number;
  sku: string;
  product: string;
  description: string;
  qty: number;
  unitPrice: number;
  discount: number;
}

interface CustomerRecord {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
}

const QuotationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const editingId = routeId ? Number(routeId) : undefined;

  const today = new Date().toISOString().slice(0, 10);
  const defaultValidUntil = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const [quotationNo, setQuotationNo] = useState(
    `QT-${new Date().getFullYear()}-${Date.now()}`
  );
  const [customer, setCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [availableCustomers, setAvailableCustomers] = useState<CustomerRecord[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [date, setDate] = useState(today);
  const [validUntil, setValidUntil] = useState(defaultValidUntil);
  const [reference, setReference] = useState("");
  const [salesperson, setSalesperson] = useState("Admin");
  const [terms, setTerms] = useState("30 Days");
  const [status, setStatus] = useState<QuotationStatus>("Draft");
  const [isSaving, setIsSaving] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({ first_name: "", last_name: "", mobile: "", email: "" });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState(
    "Thank you for your interest in our products.\nThis quotation is valid within 30 days."
  );

  const loadCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const customers = (await db.table("customers").toArray()) as CustomerRecord[];
      setAvailableCustomers(
        customers.sort((a, b) => getCustomerName(a).localeCompare(getCustomerName(b)))
      );
    } catch (error) {
      console.error("Failed to load customers from IndexedDB:", error);
      window.alert("Unable to load customers from IndexedDB.");
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const getCustomerName = (record: CustomerRecord) =>
    [record.first_name, record.last_name].filter(Boolean).join(" ").trim() ||
    record.name ||
    "";

  useEffect(() => {
    void loadCustomers();
  }, []);

  useEffect(() => {
    if (!editingId || !Number.isFinite(editingId)) return;

    let cancelled = false;
    getQuotationById(editingId)
      .then((quotation) => {
        if (cancelled) return;
        if (!quotation) {
          window.alert("Quotation not found.");
          navigate("/quotations");
          return;
        }

        setQuotationNo(quotation.number);
        setCustomer(quotation.customer);
        setDate(quotation.date);
        setValidUntil(quotation.validUntil);
        setReference(quotation.reference ?? "");
        setStatus(quotation.status);
        setItems(quotation.items ?? []);
        setDiscount(quotation.discount ?? 0);
        setNotes(quotation.notes ?? "");
        setSalesperson(quotation.salesperson ?? "Admin");
        setTerms(quotation.terms ?? "30 Days");
      })
      .catch((error: unknown) => {
        console.error("Failed to load quotation:", error);
        window.alert("Failed to load quotation from IndexedDB.");
      });

    return () => { cancelled = true; };
  }, [editingId, navigate]);

  // When editing an existing quotation, match its saved customer name to IndexedDB.
  useEffect(() => {
    if (!customer || availableCustomers.length === 0) return;
    const match = availableCustomers.find(
      (record) => getCustomerName(record).toLowerCase() === customer.trim().toLowerCase()
    );
    if (match) setSelectedCustomer(match);
  }, [customer, availableCustomers]);

  const filteredCustomers = availableCustomers.filter((record) => {
    const search = customerSearch.trim().toLowerCase();
    if (!search) return true;
    return [
      getCustomerName(record),
      record.mobile ?? "",
      record.email ?? "",
    ].some((value) => value.toLowerCase().includes(search));
  });

  const chooseCustomer = (record: CustomerRecord) => {
    const name = getCustomerName(record);
    setSelectedCustomer(record);
    setCustomer(name);
    setCustomerSearch(name);
    setShowCustomerResults(false);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const lineSubtotal = item.qty * item.unitPrice;
      return sum + lineSubtotal - (lineSubtotal * item.discount / 100);
    }, 0);
  }, [items]);

  const grandTotal = Math.max(0, subtotal - discount);

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

  const openProductPicker = async () => {
    setProductSearch("");
    setShowProductModal(true);
    setIsLoadingProducts(true);
    try {
      // Read the latest product records directly from the MasterpiecePOS IndexedDB.
      const products = await db.products.toArray();
      const activeProducts = products
        .filter((product) => product.is_active === undefined || Number(product.is_active) === 1)
        .sort((a, b) => a.name.localeCompare(b.name));

      setAvailableProducts(activeProducts);
    } catch (error) {
      console.error("Failed to load products from IndexedDB:", error);
      setAvailableProducts([]);
      window.alert("Unable to load products from IndexedDB. Please check the products table.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const selectProduct = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.sku === product.item_code);
      if (existing) {
        return prev.map((item) => item.id === existing.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: Date.now(),
        sku: product.item_code,
        product: product.name,
        description: product.description ?? "",
        qty: 1,
        unitPrice: Number(product.selling_price ?? 0),
        discount: 0,
      }];
    });
    setShowProductModal(false);
  };

  const addManualProduct = () => {
    setItems((prev) => [...prev, {
      id: Date.now(),
      sku: `MAN-${String(prev.length + 1).padStart(4, "0")}`,
      product: "",
      description: "",
      qty: 1,
      unitPrice: 0,
      discount: 0,
    }]);
    setShowProductModal(false);
  };

  const saveNewCustomer = async () => {
    const firstName = customerForm.first_name.trim();
    const lastName = customerForm.last_name.trim();
    if (!firstName) {
      window.alert("Please enter the customer's first name.");
      return;
    }
    try {
      const newCustomer: CustomerRecord = {
        first_name: firstName,
        last_name: lastName,
        mobile: customerForm.mobile.trim(),
        email: customerForm.email.trim(),
      };
      const id = await db.table("customers").add(newCustomer);
      newCustomer.id = id as number | string;
      const customerName = getCustomerName(newCustomer);

      setAvailableCustomers((previous) =>
        [...previous, newCustomer].sort((a, b) => getCustomerName(a).localeCompare(getCustomerName(b)))
      );
      setSelectedCustomer(newCustomer);
      setCustomer(customerName);
      setCustomerSearch(customerName);
      setShowCustomerResults(false);
      setShowCustomerModal(false);
      setCustomerForm({ first_name: "", last_name: "", mobile: "", email: "" });
      window.alert("Customer saved to IndexedDB and selected.");
    } catch (error) {
      console.error("Failed to save customer:", error);
      window.alert("Failed to save customer. Check your customers table schema.");
    }
  };

  const persistQuotation = async (nextStatus: QuotationStatus) => {
    if (!customer.trim()) {
      window.alert("Please enter a customer name.");
      return;
    }
    if (!date || !validUntil) {
      window.alert("Please enter the quotation date and valid-until date.");
      return;
    }
    if (items.length === 0) {
      window.alert("Please add at least one quotation item.");
      return;
    }

    const now = new Date().toISOString();
    const payload: Omit<Quotation, "id"> = {
      number: quotationNo,
      customer: customer.trim(),
      date,
      validUntil,
      amount: grandTotal,
      status: nextStatus,
      reference: reference.trim() || undefined,
      items,
      subtotal,
      discount,
      notes,
      salesperson,
      terms,
      created_at: now,
      updated_at: now,
      sync_status: "pending",
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const existing = await getQuotationById(editingId);
        await updateQuotation(editingId, {
          ...payload,
          created_at: existing?.created_at ?? now,
          updated_at: now,
        });
      } else {
        await addQuotation(payload);
      }
      setStatus(nextStatus);
      window.alert(editingId ? "Quotation updated successfully." : "Quotation saved successfully.");
      navigate("/quotations");
    } catch (error) {
      console.error("Failed to save quotation:", error);
      window.alert("Failed to save quotation. Check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = () => persistQuotation("Draft");

  const createQuotation = () => persistQuotation("Sent");

  return (
    <div className="quotation-page bg-light min-vh-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-bottom">
        <div className="container-fluid px-4 py-3">

          <div className="d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-3">

              <button
                className="btn btn-light border-0"
                onClick={() => navigate("/quotations")}
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
                      placeholder="Search customer by name, mobile or email..."
                      value={customerSearch || customer}
                      onFocus={() => {
                        setCustomerSearch(customer);
                        setShowCustomerResults(true);
                      }}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setCustomer(e.target.value);
                        setSelectedCustomer(null);
                        setShowCustomerResults(true);
                      }}
                    />

                  </div>

                  <button type="button" onClick={() => setShowCustomerModal(true)} className="btn btn-primary d-flex align-items-center gap-1">
                    <Plus size={16} />
                    New
                  </button>

                </div>

                {showCustomerResults && (
                  <div className="list-group mb-3" style={{ maxHeight: 220, overflowY: "auto" }}>
                    {isLoadingCustomers ? (
                      <div className="list-group-item text-muted">Loading customers...</div>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((record, index) => (
                        <button
                          type="button"
                          key={record.id ?? `${getCustomerName(record)}-${index}`}
                          className="list-group-item list-group-item-action text-start"
                          onClick={() => chooseCustomer(record)}
                        >
                          <strong className="d-block">{getCustomerName(record) || "Unnamed customer"}</strong>
                          <small className="text-muted">
                            {[record.mobile, record.email].filter(Boolean).join(" · ") || "No contact details"}
                          </small>
                        </button>
                      ))
                    ) : (
                      <div className="list-group-item text-muted">
                        No customers found in IndexedDB. Click New to add one.
                      </div>
                    )}
                  </div>
                )}

                {/* CUSTOMER CARD */}
                <div className="customer-card border rounded p-3 bg-primary-subtle bg-opacity-10">

                  <div className="d-flex gap-3">

                    <div className="customer-avatar bg-primary-subtle text-primary">
                      <User size={18} />
                    </div>

                    <div className="flex-grow-1">

                      <div className="d-flex justify-content-between">

                        <strong className="small">
                          {selectedCustomer ? getCustomerName(selectedCustomer) : customer || "No customer selected"}
                        </strong>

                        <button
                          type="button"
                          onClick={() => {
                            setCustomer("");
                            setCustomerSearch("");
                            setSelectedCustomer(null);
                          }}
                          className="btn btn-sm p-0 text-secondary"
                          aria-label="Clear customer"
                        >
                          <X size={15} />
                        </button>

                      </div>

                      {selectedCustomer?.mobile && (
                        <div className="small text-muted mt-1">
                          ☎ {selectedCustomer.mobile}
                        </div>
                      )}

                      {selectedCustomer?.email && (
                        <div className="small text-muted">
                          ✉ {selectedCustomer.email}
                        </div>
                      )}

                      {(selectedCustomer?.address || selectedCustomer?.city || selectedCustomer?.province) && (
                        <div className="small text-muted">
                          ⌖ {[selectedCustomer.address, selectedCustomer.city, selectedCustomer.province].filter(Boolean).join(", ")}
                        </div>
                      )}

                      {!selectedCustomer && !customer && (
                        <div className="small text-muted mt-1">Select a customer from IndexedDB</div>
                      )}

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
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Status
                    </label>

                    <div className="form-control bg-success-subtle text-success fw-semibold text-center">
                      {status.toUpperCase()}
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
                        type="date"
                        className="form-control"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
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
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Salesperson
                    </label>

                    <select className="form-select" value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
                      <option>Admin</option>
                      <option>Cashier</option>
                      <option>Sales Staff</option>
                    </select>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label small">
                      Terms
                    </label>

                    <select className="form-select" value={terms} onChange={(e) => setTerms(e.target.value)}>
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

                <button type="button" onClick={openProductPicker} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                  <ScanBarcode size={15} />
                  Scan Barcode
                </button>

                <button
                  onClick={openProductPicker}
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

                    const lineSubtotal = item.qty * item.unitPrice;
                    const total = lineSubtotal - (lineSubtotal * item.discount / 100);

                    return (
                      <tr key={item.id}>

                        <td className="small">
                          {index + 1}
                        </td>

                        <td className="small">
                          {item.sku}
                        </td>

                        <td style={{ minWidth: 160 }}>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => updateItem(item.id, "product", e.target.value)}
                            className="form-control form-control-sm fw-semibold"
                            placeholder="Product name"
                          />
                        </td>

                        <td style={{ minWidth: 180 }}>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Description"
                          />
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
              onClick={() => navigate("/quotations")}
              className="btn btn-outline-secondary px-4"
            >
              Cancel
            </button>

            <button
              onClick={saveDraft}
              disabled={isSaving}
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
              disabled={isSaving}
              className="btn btn-success px-4"
            >
              {isSaving ? "Saving..." : editingId ? "Update Quotation" : "✓  Create Quotation"}
            </button>

          </div>

        </div>

      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="modal d-block" role="dialog" aria-modal="true" style={{ background: "rgba(0,0,0,.45)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowCustomerModal(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First name *</label>
                  <input className="form-control" value={customerForm.first_name} onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })} autoFocus />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last name</label>
                  <input className="form-control" value={customerForm.last_name} onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input className="form-control" value={customerForm.mobile} onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCustomerModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={saveNewCustomer}>Save Customer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Picker Modal */}
      {showProductModal && (
        <div className="modal d-block" role="dialog" aria-modal="true" style={{ background: "rgba(0,0,0,.45)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text"><Search size={16} /></span>
                  <input className="form-control" placeholder="Search product name or SKU..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                </div>
                {isLoadingProducts ? (
                  <p className="text-muted text-center py-4">Loading products...</p>
                ) : availableProducts.filter((product) => `${product.name} ${product.item_code} ${product.description ?? ""}`.toLowerCase().includes(productSearch.trim().toLowerCase())).length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">No products found in IndexedDB.</p>
                    <button type="button" className="btn btn-outline-primary" onClick={addManualProduct}>Add Manual Item</button>
                  </div>
                ) : (
                  <div className="list-group">
                    {availableProducts.filter((product) => `${product.name} ${product.item_code} ${product.description ?? ""}`.toLowerCase().includes(productSearch.trim().toLowerCase())).map((product) => (
                      <button type="button" key={product.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-start" onClick={() => selectProduct(product)}>
                        <span className="me-3">
                          <strong className="d-block">{product.name}</strong>
                          <small className="text-muted d-block">
                            SKU: {product.item_code}
                            {product.description ? ` · ${product.description}` : ""}
                          </small>
                          <small className="text-muted d-block">
                            Stock: {Number(product.stock_qty ?? 0)} {product.unit ?? "units"}
                          </small>
                        </span>
                        <span className="text-end flex-shrink-0">
                          <strong className="d-block">{money(Number(product.selling_price ?? 0))}</strong>
                          <small className="text-muted">Selling price</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={addManualProduct}>Add Manual Item</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuotationDetails;