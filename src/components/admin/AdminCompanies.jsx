import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(response.data.companies || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAdd = () => {
    setSelectedCompany(null);
    setShowModal(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`${API_URL}/api/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Company deleted successfully");
        fetchCompanies();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting company");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value.trim(),
      description: e.target.description.value.trim(),
      image: e.target.image.value.trim(),
    };

    try {
      if (selectedCompany) {
        await axios.put(
          `${API_URL}/api/companies/${selectedCompany._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Company updated successfully");
      } else {
        await axios.post(`${API_URL}/api/companies`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Company created successfully");
      }
      setShowModal(false);
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving company");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "description",
      label: "Description",
      render: (item) =>
        item.description.length > 100
          ? `${item.description.substring(0, 100)}...`
          : item.description,
    },
    {
      key: "image",
      label: "Image",
      render: (item) =>
        item.image ? (
          <img
            src={`${process.env.PUBLIC_URL}/images/company/${item.image}`}
            alt={item.name}
            className="rounded"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/images/company/${item.image}`;
            }}
          />
        ) : (
          "No Image"
        ),
    },
  ];

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <CRUDTable
          data={companies}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Companies Management"
          loading={loading}
          addButtonLabel="Add Company"
        />
      </div>

      {/* Company Form Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedCompany ? "Edit Company" : "Add New Company"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => !loading && setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    defaultValue={selectedCompany?.name}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    defaultValue={selectedCompany?.description}
                    rows="3"
                    required
                    minLength={10}
                    maxLength={500}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    defaultValue={selectedCompany?.image}
                    placeholder="image.jpg"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => !loading && setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {selectedCompany ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedCompany ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => !loading && setShowModal(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminCompanies;
