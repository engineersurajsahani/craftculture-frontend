import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminDonations = ({ type }) => {
  const [donations, setDonations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const endpoint = type === "money" ? "donate-money" : "donate-product";
  const token = localStorage.getItem("token");

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const [donationsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/${endpoint}/donations`, {
          params: {
            category: selectedCategory,
            startDate: dateRange.start,
            endDate: dateRange.end,
          },
        }),
        axios.get(`${API_URL}/api/${endpoint}/statistics`),
      ]);

      setDonations(donationsRes.data.donations || []);
      setStatistics(statsRes.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching donations");
      setDonations([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [type, selectedCategory, dateRange]);

  const handleView = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this donation record? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/api/${endpoint}/donation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Donation record deleted successfully");
        fetchDonations();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting donation");
      }
    }
  };

  const handleExportCSV = () => {
    if (!donations.length) return;

    const headers =
      type === "money"
        ? ["Name", "Phone", "Amount", "Date"]
        : ["Name", "Phone", "Category", "Quantity", "Date"];

    const data = donations.map((donation) => {
      const baseData = [
        donation.name || "N/A",
        donation.phone || "N/A",
        ...(type === "money"
          ? [(donation.amount || 0).toFixed(2)]
          : [donation.category || "N/A", donation.quantity || 0]),
        donation.date ? new Date(donation.date).toLocaleDateString() : "N/A",
      ];
      return baseData;
    });

    const csvContent = [headers, ...data]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_donations.csv`;
    link.click();
  };

  const moneyColumns = [
    { key: "name", label: "Donor Name" },
    { key: "phone", label: "Phone" },
    {
      key: "amount",
      label: "Amount",
      render: (item) => `₹${(item.amount || 0).toFixed(2)}`,
    },
    {
      key: "date",
      label: "Donation Date",
      render: (item) =>
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
    },
  ];

  const productColumns = [
    { key: "name", label: "Donor Name" },
    { key: "phone", label: "Phone" },
    { key: "category", label: "Category" },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => item.quantity || 0,
    },
    {
      key: "date",
      label: "Donation Date",
      render: (item) =>
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
    },
  ];

  const validCategories = [
    "Frames",
    "Wall Hanging",
    "Bag",
    "Pen Stand",
    "Jewellery",
    "Diyas",
    "Bottle Art",
  ];

  const renderStatistics = () => {
    if (!statistics) return null;

    if (type === "money") {
      return (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h6 className="card-title">Total Donations</h6>
                <h4 className="mb-0">
                  ₹{(statistics.totalAmount || 0).toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h6 className="card-title">Average Donation</h6>
                <h4 className="mb-0">
                  ₹{(statistics.averageAmount || 0).toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h6 className="card-title">Highest Donation</h6>
                <h4 className="mb-0">
                  ₹{(statistics.maxAmount || 0).toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h6 className="card-title">Total Donors</h6>
                <h4 className="mb-0">{statistics.totalDonors || 0}</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // For product donations
    return Array.isArray(statistics) ? (
      <div className="row mb-4">
        {statistics.map((stat) => (
          <div key={stat._id || "unknown"} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">{stat._id || "Unknown Category"}</h6>
                <p className="mb-1">Total Items: {stat.totalQuantity || 0}</p>
                <p className="mb-1">
                  Average per Donation: {(stat.averageQuantity || 0).toFixed(1)}
                </p>
                <p className="mb-0">
                  Number of Donors: {stat.totalDonors || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="m-0">
                {type === "money" ? "Money Donations" : "Product Donations"}
              </h3>
            </div>
            {type === "product" && (
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {validCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                placeholder="Start Date"
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                placeholder="End Date"
              />
            </div>
            <div className="col-auto">
              <button
                className="btn btn-success me-2"
                onClick={handleExportCSV}
                disabled={!donations.length}
              >
                <i className="fas fa-download me-2"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {renderStatistics()}

          <CRUDTable
            data={donations}
            columns={type === "money" ? moneyColumns : productColumns}
            onEdit={handleView}
            onDelete={handleDelete}
            loading={loading}
            title="Donations"
          />
        </div>
      </div>

      {/* Donation Details Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Donation Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedDonation && (
                <div className="card">
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="card-subtitle mb-2 text-muted">
                        Donor Information
                      </h6>
                      <p className="mb-1">
                        <strong>Name:</strong> {selectedDonation.name || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong>{" "}
                        {selectedDonation.phone || "N/A"}
                      </p>
                      <p className="mb-0">
                        <strong>Donation Date:</strong>{" "}
                        {selectedDonation.date
                          ? new Date(selectedDonation.date).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Donation Details
                      </h6>
                      {type === "money" ? (
                        <p className="mb-0">
                          <strong>Amount:</strong> ₹
                          {(selectedDonation.amount || 0).toFixed(2)}
                        </p>
                      ) : (
                        <>
                          <p className="mb-1">
                            <strong>Category:</strong>{" "}
                            {selectedDonation.category || "N/A"}
                          </p>
                          <p className="mb-0">
                            <strong>Quantity:</strong>{" "}
                            {selectedDonation.quantity || 0}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
              {selectedDonation?.phone && (
                <a
                  href={`tel:${selectedDonation.phone}`}
                  className="btn btn-primary"
                >
                  <i className="fas fa-phone me-2"></i>
                  Call Donor
                </a>
              )}
              {selectedDonation && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(selectedDonation._id);
                    setShowModal(false);
                  }}
                >
                  <i className="fas fa-trash me-2"></i>
                  Delete Record
                </button>
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

export default AdminDonations;
