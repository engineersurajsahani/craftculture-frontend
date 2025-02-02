import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import OrderBill from "./OrderBill";
import "../css/Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/${username}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await axios.post(`${API_URL}/api/orders/${orderId}/cancel`);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-badge status-pending";
      case "processing":
        return "status-badge status-processing";
      case "shipped":
        return "status-badge status-shipped";
      case "delivered":
        return "status-badge status-delivered";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="container">
        <h2 className="mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No Orders Yet</h3>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <button className="btn-shop" onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="row">
            {orders.map((order) => (
              <div key={order._id} className="col-12">
                <div className="order-card">
                  <div className="order-header">
                    <div className="row align-items-center">
                      <div className="col">
                        <strong className="order-id">
                          Order #{order._id.slice(-8)}
                        </strong>
                      </div>
                      <div className="col text-end">
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="order-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="mb-3">Items</h6>
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="item-row">
                              <div>
                                <div className="item-name">{item.name}</div>
                                <div className="item-details">
                                  Quantity: {item.quantity || 1}
                                </div>
                              </div>
                              <div className="item-price">
                                ₹
                                {(
                                  item.price *
                                  (item.quantity || 1) *
                                  (1 - (item.offer || 0) / 100)
                                ).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="order-summary">
                          <h6 className="mb-3">Order Details</h6>
                          <div className="summary-row">
                            <span className="summary-label">Order Date:</span>
                            <span className="summary-value">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Total Amount:</span>
                            <span className="summary-value">
                              ₹{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">
                              Payment Method:
                            </span>
                            <span className="summary-value">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <div className="address-section">
                            <h6 className="mb-2">Shipping Address</h6>
                            <p className="mb-0">
                              {order.address.street},<br />
                              {order.address.city}, {order.address.state}
                              <br />
                              {order.address.postalCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end gap-2">
                      <OrderBill order={order} />
                      {order.status === "Pending" && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
