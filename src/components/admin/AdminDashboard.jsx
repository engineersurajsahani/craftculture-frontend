import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      products: 0,
      orders: 0,
      jobs: 0,
      companies: 0,
      applicants: 0,
      moneyDonations: 0,
      productDonations: 0,
    },
    orderStats: {
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
    },
    productStats: {
      totalValue: 0,
      outOfStock: 0,
    },
    donationStats: {
      money: {
        totalAmount: 0,
        averageDonation: 0,
      },
      products: [],
    },
    recentActivity: {
      orders: [],
      applications: [],
    },
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up refresh interval
    const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.counts.users,
      icon: "fas fa-users",
      color: "primary",
      link: "/admin/users",
    },
    {
      title: "Products",
      value: stats.counts.products,
      icon: "fas fa-box",
      color: "success",
      subtext: `${stats.productStats.outOfStock} out of stock`,
      link: "/admin/products",
    },
    {
      title: "Orders",
      value: stats.counts.orders,
      icon: "fas fa-shopping-cart",
      color: "info",
      subtext: `${stats.orderStats.pendingOrders} pending`,
      link: "/admin/orders",
    },
    {
      title: "Revenue",
      value: `₹${stats.orderStats.totalRevenue.toFixed(2)}`,
      icon: "fas fa-rupee-sign",
      color: "warning",
      subtext: `Avg. order: ₹${stats.orderStats.averageOrderValue.toFixed(2)}`,
    },
    {
      title: "Companies",
      value: stats.counts.companies,
      icon: "fas fa-building",
      color: "danger",
      link: "/admin/companies",
    },
    {
      title: "Job Applications",
      value: stats.counts.applicants,
      icon: "fas fa-user-tie",
      color: "primary",
      link: "/admin/applicants",
    },
    {
      title: "Money Donations",
      value: stats.counts.moneyDonations,
      icon: "fas fa-hand-holding-usd",
      color: "success",
      subtext: `Total: ₹${stats.donationStats.money.totalAmount.toFixed(2)}`,
      link: "/admin/donate-money",
    },
    {
      title: "Product Donations",
      value: stats.counts.productDonations,
      icon: "fas fa-gift",
      color: "info",
      link: "/admin/donate-products",
    },
  ];

  if (loading) {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        {statCards.map((card, index) => (
          <div key={index} className="col-sm-6 col-xl-3">
            <div className={`card bg-${card.color} text-white h-100`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-0">{card.title}</h6>
                    <h2 className="mt-2 mb-0">{card.value}</h2>
                    {card.subtext && (
                      <small className="opacity-75">{card.subtext}</small>
                    )}
                  </div>
                  <div>
                    <i className={`${card.icon} fa-2x opacity-75`}></i>
                  </div>
                </div>
                {card.link && (
                  <a
                    href={card.link}
                    className="mt-3 btn btn-sm btn-light bg-white text-dark w-100"
                  >
                    View Details <i className="fas fa-arrow-right ms-1"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <a href="/admin/orders" className="btn btn-sm btn-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              {stats.recentActivity.orders.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentActivity.orders.map((order) => (
                    <div key={order._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{order.username}</h6>
                          <small className="text-muted">
                            {new Date(order.orderDate).toLocaleString()}
                          </small>
                        </div>
                        <div className="text-end">
                          <div>₹{order.totalAmount.toFixed(2)}</div>
                          <span
                            className={`badge bg-${
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Cancelled"
                                ? "danger"
                                : order.status === "Processing"
                                ? "warning"
                                : "primary"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Applications</h5>
              <a href="/admin/applicants" className="btn btn-sm btn-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              {stats.recentActivity.applications.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentActivity.applications.map((application) => (
                    <div key={application._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{application.name}</h6>
                          <small className="text-muted">
                            {application.companyId?.name} -{" "}
                            {application.jobId?.title}
                          </small>
                        </div>
                        <a
                          href={`mailto:${application.email}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-envelope me-1"></i>
                          Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No recent applications</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donation Statistics */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Money Donations Overview</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-2">Total Donations</h6>
                    <h3 className="mb-0">
                      ₹{stats.donationStats.money.totalAmount.toFixed(2)}
                    </h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-2">Average Donation</h6>
                    <h3 className="mb-0">
                      ₹{stats.donationStats.money.averageDonation.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </div>
              <a
                href="/admin/donate-money"
                className="btn btn-primary w-100 mt-4"
              >
                View All Money Donations
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Product Donations by Category</h5>
            </div>
            <div className="card-body">
              {stats.donationStats.products.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Total Items</th>
                        <th>Donors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.donationStats.products.map((category) => (
                        <tr key={category._id}>
                          <td>{category._id}</td>
                          <td>{category.totalQuantity}</td>
                          <td>{category.donorCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  No product donations data available
                </p>
              )}
              <a
                href="/admin/donate-products"
                className="btn btn-primary w-100 mt-3"
              >
                View All Product Donations
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-3">
                  <a
                    href="/admin/products"
                    className="btn btn-light border w-100 p-4"
                  >
                    <i className="fas fa-plus-circle fa-2x mb-3 d-block"></i>
                    Add New Product
                  </a>
                </div>
                <div className="col-md-3">
                  <a
                    href="/admin/orders?status=pending"
                    className="btn btn-light border w-100 p-4"
                  >
                    <i className="fas fa-clock fa-2x mb-3 d-block"></i>
                    View Pending Orders
                  </a>
                </div>
                <div className="col-md-3">
                  <a
                    href="/admin/jobs"
                    className="btn btn-light border w-100 p-4"
                  >
                    <i className="fas fa-briefcase fa-2x mb-3 d-block"></i>
                    Post New Job
                  </a>
                </div>
                <div className="col-md-3">
                  <a
                    href="/admin/donate-money"
                    className="btn btn-light border w-100 p-4"
                  >
                    <i className="fas fa-hand-holding-heart fa-2x mb-3 d-block"></i>
                    Manage Donations
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="position-fixed bottom-0 end-0 p-4">
        <button
          className="btn btn-primary rounded-circle shadow"
          onClick={fetchStats}
          disabled={loading}
          title="Refresh Dashboard"
        >
          <i
            className={`fas ${loading ? "fa-spinner fa-spin" : "fa-sync-alt"}`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
