import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderStats, setOrderStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: {
      start: "",
      end: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        params: {
          status: filters.status,
          startDate: filters.dateRange.start,
          endDate: filters.dateRange.end,
        },
      });

      setOrders(response.data.orders);
      setOrderStats(response.data.orderStats);
      setPaymentStats(response.data.paymentStats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleStatusChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleDateChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value,
      },
    }));
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating order status"
      );
    }
  };

  const handleExportCSV = () => {
    if (!orders.length) return;

    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Phone",
      "Total Amount",
      "Status",
      "Payment Method",
      "Order Date",
    ];

    const data = orders.map((order) => [
      order._id,
      order.fullName,
      order.email,
      order.phone,
      order.totalAmount.toFixed(2),
      order.status,
      order.paymentMethod,
      new Date(order.orderDate).toLocaleString(),
    ]);

    const csvContent = [headers, ...data]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  const columns = [
    {
      key: "_id",
      label: "Order ID",
      render: (item) => item._id.substring(0, 8),
    },
    { key: "fullName", label: "Customer" },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (item) => `₹${item.totalAmount.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <select
          className="form-select form-select-sm"
          value={item.status}
          onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (item) => new Date(item.orderDate).toLocaleString(),
    },
    { key: "paymentMethod", label: "Payment" },
  ];

  const renderOrderStats = () => {
    if (!orderStats?.length) return null;

    return (
      <div className="row mb-4">
        {orderStats.map((stat) => (
          <div key={stat._id} className="col-md-3 mb-3">
            <div
              className={`card ${
                stat._id === "Delivered"
                  ? "bg-success"
                  : stat._id === "Cancelled"
                  ? "bg-danger"
                  : stat._id === "Processing"
                  ? "bg-warning"
                  : stat._id === "Shipped"
                  ? "bg-info"
                  : "bg-primary"
              } text-white`}
            >
              <div className="card-body">
                <h6 className="card-title">{stat._id}</h6>
                <p className="mb-0">Orders: {stat.count}</p>
                <p className="mb-0">₹{stat.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="m-0">Orders Management</h3>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={handleStatusChange}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.dateRange.start}
                onChange={(e) => handleDateChange("start", e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.dateRange.end}
                onChange={(e) => handleDateChange("end", e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button
                className="btn btn-success"
                onClick={handleExportCSV}
                disabled={!orders.length}
              >
                <i className="fas fa-download me-2"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {renderOrderStats()}

          <CRUDTable
            data={orders}
            columns={columns}
            onEdit={handleView}
            loading={loading}
            title="Orders"
          />
        </div>
      </div>

      {/* Order Details Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">
                            Customer Information
                          </h6>
                          <p className="mb-1">
                            <strong>Name:</strong> {selectedOrder.fullName}
                          </p>
                          <p className="mb-1">
                            <strong>Email:</strong> {selectedOrder.email}
                          </p>
                          <p className="mb-0">
                            <strong>Phone:</strong> {selectedOrder.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">
                            Shipping Address
                          </h6>
                          <p className="mb-1">{selectedOrder.address.street}</p>
                          <p className="mb-1">
                            {selectedOrder.address.city},{" "}
                            {selectedOrder.address.state}
                          </p>
                          <p className="mb-0">
                            {selectedOrder.address.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-3 text-muted">
                        Order Items
                      </h6>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>₹{item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td className="text-end">
                                  ₹
                                  {(
                                    item.price *
                                    item.quantity *
                                    (1 - item.offer / 100)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="3" className="text-end">
                                <strong>Total Amount:</strong>
                              </td>
                              <td className="text-end">
                                <strong>
                                  ₹{selectedOrder.totalAmount.toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">
                            Order Information
                          </h6>
                          <p className="mb-1">
                            <strong>Order Date:</strong>{" "}
                            {new Date(selectedOrder.orderDate).toLocaleString()}
                          </p>
                          <p className="mb-1">
                            <strong>Status:</strong>{" "}
                            <span
                              className={`badge ${
                                selectedOrder.status === "Delivered"
                                  ? "bg-success"
                                  : selectedOrder.status === "Cancelled"
                                  ? "bg-danger"
                                  : selectedOrder.status === "Processing"
                                  ? "bg-warning"
                                  : selectedOrder.status === "Shipped"
                                  ? "bg-info"
                                  : "bg-primary"
                              }`}
                            >
                              {selectedOrder.status}
                            </span>
                          </p>
                          <p className="mb-1">
                            <strong>Payment Method:</strong>{" "}
                            {selectedOrder.paymentMethod}
                          </p>
                          {selectedOrder.trackingNumber && (
                            <p className="mb-0">
                              <strong>Tracking Number:</strong>{" "}
                              {selectedOrder.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              {selectedOrder && selectedOrder.phone && (
                <a
                  href={`tel:${selectedOrder.phone}`}
                  className="btn btn-primary"
                >
                  <i className="fas fa-phone me-2"></i>
                  Contact Customer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminOrders;
