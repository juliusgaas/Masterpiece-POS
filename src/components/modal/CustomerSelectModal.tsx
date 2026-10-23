import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import type { Customer } from "../../types/customer";
import customerService from "../../services/CustomerService";




interface CustomerSelectModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  onAddCustomer?: () => void;
}

function CustomerSelectModal({
  show,
  onClose,
  onSelect,
  onAddCustomer,
}: CustomerSelectModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async (keyword = "") => {
    try {
      setLoading(true);
      setError("");

      const data = keyword.trim()
        ? await customerService.search(keyword)
        : await customerService.getAll();

      setCustomers(data);
    } catch (err) {
      console.error("Load customers error:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setSearch("");
      loadCustomers();
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      loadCustomers(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, show]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Select Customer</Modal.Title>

          <small className="text-muted">
            Select a customer for this sale
          </small>
        </div>
      </Modal.Header>

      <Modal.Body>

        {/* Search */}
        <InputGroup className="mb-3">
          <InputGroup.Text>
            🔍
          </InputGroup.Text>

          <Form.Control
            type="text"
            placeholder="Search name, mobile or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {search && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearch("")}
            >
              Clear
            </Button>
          )}
        </InputGroup>

        {/* Add Customer */}
        {onAddCustomer && (
          <Button
            variant="outline-primary"
            className="w-100 mb-3"
            onClick={onAddCustomer}
          >
            + Add New Customer
          </Button>
        )}

        {/* Error */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />

            <div className="text-muted mt-2">
              Loading customers...
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-5">

            <div className="fs-1">
              👤
            </div>

            <h6 className="mt-3">
              No customers found
            </h6>

            <small className="text-muted">
              {search
                ? "Try another search."
                : "No customers have been added yet."}
            </small>

          </div>
        ) : (
          <div
            className="customer-list"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {customers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className="w-100 text-start border rounded p-3 mb-2 bg-white"
                onClick={() => handleSelect(customer)}
                style={{
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <div className="fw-semibold">
                      {customer.first_name}{" "}
                      {customer.last_name}
                    </div>

                    <div className="small text-muted">
                      {customer.mobile || "No mobile number"}
                    </div>

                    {customer.email && (
                      <div className="small text-muted">
                        {customer.email}
                      </div>
                    )}
                  </div>

                  <div className="text-primary">
                    Select →
                  </div>

                </div>
              </button>
            ))}
          </div>
        )}

      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Modal.Footer>

    </Modal>
  );
}

export default CustomerSelectModal;