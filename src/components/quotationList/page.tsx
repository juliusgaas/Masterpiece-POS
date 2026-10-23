
import { useMemo, useState, useEffect } from "react";

import type { Quotation as QuotationRecord } from "../../database/dexie";
import {
    getQuotations,
    updateQuotationStatus as saveQuotationStatus,
} from "../../services/QuotationService";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Printer,
  Send,
  ShoppingCart,
  MoreVertical,
  CalendarDays,
  FileText,
  Filter,
  X,
  ArrowLeft,
} from "lucide-react";
import "./page.css";
import { useNavigate } from "react-router-dom";

type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Expired"
  | "Cancelled";

type Quotation = QuotationRecord;

const tabs = [
  "All",
  "Draft",
  "Sent",
  "Accepted",
  "Expired",
  "Cancelled",
] as const;

type Tab = (typeof tabs)[number];

const money = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function QuotationList() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuotations() {
      try {
        setLoading(true);
        setDbError(null);

        const records = await getQuotations();

        if (!cancelled) {
          setQuotations(records);
        }
      } catch (error) {
        console.error("Failed to load quotations from IndexedDB:", error);

        if (!cancelled) {
          setDbError("Failed to load quotations from IndexedDB.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuotations();

    return () => {
      cancelled = true;
    };
  }, []);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Quotation | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return quotations.filter((quotation) => {
      const matchesTab =
        activeTab === "All" || quotation.status === activeTab;

      const matchesSearch = [
        quotation.number,
        quotation.customer,
        quotation.reference ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [quotations, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleQuotations = filtered.slice(start, start + pageSize);

  const counts = useMemo(() => {
    return {
      All: quotations.length,
      Draft: quotations.filter((q) => q.status === "Draft").length,
      Sent: quotations.filter((q) => q.status === "Sent").length,
      Accepted: quotations.filter((q) => q.status === "Accepted").length,
      Expired: quotations.filter((q) => q.status === "Expired").length,
      Cancelled: quotations.filter((q) => q.status === "Cancelled").length,
    };
  }, [quotations]);

  const updateStatus = async (
    item: Quotation,
    status: QuotationStatus
  ) => {
    if (item.id == null) {
      setDbError("Quotation ID is missing.");
      return;
    }

    try {
      setDbError(null);

      // Persist to IndexedDB before updating the UI.
      await saveQuotationStatus(item.id, status);

      setQuotations((previous) =>
        previous.map((q) =>
          q.id === item.id ? { ...q, status } : q
        )
      );

      setSelected((previous: Quotation | null) =>
        previous && previous.id === item.id
          ? { ...previous, status }
          : previous
      );

      setMenuId(null);
    } catch (error) {
      console.error("Failed to update quotation status:", error);
      setDbError("Failed to save quotation status to IndexedDB.");
    }
  };

  const handleAction = (
    action: "view" | "edit" | "send" | "convert" | "print",
    quotation: Quotation
  ) => {
    setMenuId(null);

    switch (action) {
      case "view":
        setSelected(quotation);
        break;

      case "edit":
        // Replace with your React Router navigation.
        navigate(`/quotations/${quotation.id}/edit`);
        break;

      case "send":
        if (window.confirm(`Mark ${quotation.number} as sent?`)) {
          void updateStatus(quotation, "Sent");
        }
        break;

      case "convert":
        if (quotation.status !== "Accepted") {
          window.alert("Only accepted quotations can be converted to a sale.");
          return;
        }
        // Navigate to your sale creation/conversion workflow.
        window.location.href =
          `/sales/create?quotationId=${quotation.id}`;
        break;

      case "print":
        window.print();
        break;
    }
  };

  return (
    <div className="quotation-list-page">
      <div>
          <button
                className="btn btn-primary border-0"
                onClick={() => navigate("/new-sale")}
              >
                <ArrowLeft size={19} />
                Back to Sales
              </button>
        </div>
      <div className="quotation-page-header mt-4">
        
        <div>
          <h4>Quotations</h4>
          <p>Manage quotations and track customer offers.</p>
        </div>

        <button
          className="btn btn-primary quotation-create-btn"
          onClick={() => {
            window.location.href = "/quotations/create";
          }}
        >
          <Plus size={17} />
          New Quotation
        </button>
      </div>

      {loading && (
        <div className="alert alert-info" role="status">
          Loading quotations...
        </div>
      )}

      {dbError && (
        <div className="alert alert-danger" role="alert">
          {dbError}
        </div>
      )}

      <div className="quotation-summary-grid">
        <div className="quotation-summary-card">
          <div className="quotation-summary-icon blue">
            <FileText size={20} />
          </div>
          <div>
            <span>Total Quotations</span>
            <h5>{counts.All}</h5>
          </div>
        </div>

        <div className="quotation-summary-card">
          <div className="quotation-summary-icon orange">
            <Pencil size={20} />
          </div>
          <div>
            <span>Draft</span>
            <h5>{counts.Draft}</h5>
          </div>
        </div>

        <div className="quotation-summary-card">
          <div className="quotation-summary-icon purple">
            <Send size={20} />
          </div>
          <div>
            <span>Sent</span>
            <h5>{counts.Sent}</h5>
          </div>
        </div>

        <div className="quotation-summary-card">
          <div className="quotation-summary-icon green">
            <ShoppingCart size={20} />
          </div>
          <div>
            <span>Accepted</span>
            <h5>{counts.Accepted}</h5>
          </div>
        </div>
      </div>

      <div className="quotation-table-card">
        <div className="quotation-toolbar">
          <div className="quotation-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`quotation-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
              >
                {tab}
                <span className="quotation-tab-count">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="quotation-filters">
            <div className="quotation-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search quotation or customer..."
                aria-label="Search quotations"
              />
              {search && (
                <button
                  className="quotation-clear-search"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              className="btn btn-outline-secondary quotation-filter-btn"
              onClick={() => {
                setSearch("");
                setActiveTab("All");
                setPage(1);
              }}
            >
              <Filter size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="quotation-table-responsive">
          <table className="table quotation-table mb-0">
            <thead>
              <tr>
                <th>Quotation No.</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Valid Until</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleQuotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td>
                    <button
                      className="quotation-number"
                      onClick={() => handleAction("view", quotation)}
                    >
                      {quotation.number}
                    </button>
                    {quotation.reference && (
                      <div className="quotation-reference">
                        Ref: {quotation.reference}
                      </div>
                    )}
                  </td>

                  <td>
                    <span className="quotation-customer">
                      {quotation.customer}
                    </span>
                  </td>

                  <td>{formatDate(quotation.date)}</td>

                  <td>
                    <span className="quotation-date">
                      <CalendarDays size={14} />
                      {formatDate(quotation.validUntil)}
                    </span>
                  </td>

                  <td className="text-end quotation-amount">
                    {money(quotation.amount)}
                  </td>

                  <td>
                    <span
                      className={`quotation-status status-${quotation.status.toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {quotation.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="quotation-actions">
                      <button
                        title="View quotation"
                        className="quotation-icon-btn"
                        onClick={() => handleAction("view", quotation)}
                      >
                        <Eye size={17} />
                      </button>

                      {quotation.status === "Draft" && (
                        <button
                          title="Edit quotation"
                          className="quotation-icon-btn"
                          onClick={() => handleAction("edit", quotation)}
                        >
                          <Pencil size={16} />
                        </button>
                      )}

                      <div className="quotation-menu-wrapper">
                        <button
                          title="More actions"
                          className="quotation-icon-btn"
                          onClick={() =>
                            setMenuId(
                              menuId === quotation.id
                                ? null
                                : (quotation.id ?? null)
                            )
                          }
                        >
                          <MoreVertical size={18} />
                        </button>

                        {menuId === quotation.id && (
                          <div className="quotation-dropdown">
                            {quotation.status === "Draft" && (
                              <button
                                onClick={() => handleAction("send", quotation)}
                              >
                                <Send size={15} /> Mark as Sent
                              </button>
                            )}

                            {quotation.status === "Accepted" && (
                              <button
                                onClick={() =>
                                  handleAction("convert", quotation)
                                }
                              >
                                <ShoppingCart size={15} /> Convert to Sale
                              </button>
                            )}

                            <button
                              onClick={() => handleAction("print", quotation)}
                            >
                              <Printer size={15} /> Print
                            </button>

                            {quotation.status !== "Cancelled" &&
                              quotation.status !== "Accepted" && (
                                <button
                                  className="quotation-cancel-action"
                                  onClick={() =>
                                    void updateStatus(quotation, "Cancelled")
                                  }
                                >
                                  <X size={15} /> Cancel Quotation
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && visibleQuotations.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="quotation-empty">
                      <FileText size={34} />
                      <strong>No quotations found</strong>
                      <span>
                        Try another search or create a new quotation.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="quotation-pagination">
          <div className="quotation-page-size">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <span className="quotation-page-info">
            {filtered.length === 0
              ? "0 results"
              : `${start + 1}–${Math.min(
                  start + pageSize,
                  filtered.length
                )} of ${filtered.length}`}
          </span>

          <div className="quotation-page-buttons">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="quotation-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="quotation-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quotation-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quotation-modal-header">
              <div>
                <h5 id="quotation-detail-title">Quotation Details</h5>
                <span>{selected.number}</span>
              </div>
              <button
                className="quotation-icon-btn"
                onClick={() => setSelected(null)}
                aria-label="Close quotation details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="quotation-modal-body">
              <div className="quotation-detail-row">
                <span>Customer</span>
                <strong>{selected.customer}</strong>
              </div>
              <div className="quotation-detail-row">
                <span>Quotation Date</span>
                <strong>{formatDate(selected.date)}</strong>
              </div>
              <div className="quotation-detail-row">
                <span>Valid Until</span>
                <strong>{formatDate(selected.validUntil)}</strong>
              </div>
              <div className="quotation-detail-row">
                <span>Status</span>
                <strong>{selected.status}</strong>
              </div>
              <div className="quotation-detail-total">
                <span>Total Amount</span>
                <h4>{money(selected.amount)}</h4>
              </div>
            </div>

            <div className="quotation-modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAction("print", selected)}
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
