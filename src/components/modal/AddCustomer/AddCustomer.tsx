import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

import type { Customer } from "../../../types/customer";
import customerService from "../../../services/CustomerService";

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
}

const initialForm = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  address: "",
};

function AddCustomerModal({
  show,
  onClose,
  onSaved,
}: AddCustomerModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.last_name.trim()) {
      setError("Last name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to Dexie
      const customer = await customerService.create(form);

      // Send customer back to NewSale
      onSaved(customer);

      // Reset form
      setForm(initialForm);

      // Close modal
      onClose();

    } catch (error) {
      console.error("Create customer error:", error);

      setError("Failed to save customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setForm(initialForm);
    setError("");
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
    >
      <Form onSubmit={handleSubmit}>

        <Modal.Header closeButton>
          <Modal.Title>
            Add Customer
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Row className="g-3">

            {/* First Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  First Name{" "}
                  <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  disabled={loading}
                  autoFocus
                />
              </Form.Group>
            </Col>

            {/* Last Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Last Name{" "}
                  <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  disabled={loading}
                />
              </Form.Group>
            </Col>

            {/* Mobile */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Mobile Number
                </Form.Label>

                <Form.Control
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  disabled={loading}
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Email
                </Form.Label>

                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="customer@email.com"
                  disabled={loading}
                />
              </Form.Group>
            </Col>

            {/* Address */}
            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  Address
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter customer address"
                  disabled={loading}
                />
              </Form.Group>
            </Col>

          </Row>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  size="sm"
                  animation="border"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              "Save Customer"
            )}
          </Button>

        </Modal.Footer>

      </Form>
    </Modal>
  );
}

export default AddCustomerModal;