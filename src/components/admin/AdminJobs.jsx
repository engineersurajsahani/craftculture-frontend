import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        axios.get(`${API_URL}/api/jobs`),
        axios.get(`${API_URL}/api/companies`),
      ]);

      let filteredJobs = jobsRes.data.jobs;
      if (selectedCompany) {
        filteredJobs = filteredJobs.filter(
          (job) => job.companyId._id === selectedCompany
        );
      }

      setJobs(filteredJobs);
      setCompanies(companiesRes.data.companies);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCompany]);

  const handleAdd = () => {
    setSelectedJob(null);
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_URL}/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting job");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      companyId: e.target.companyId.value,
      title: e.target.title.value.trim(),
      description: e.target.description.value.trim(),
      idealFor: e.target.idealFor.value.trim(),
      skills: e.target.skills.value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      jobRole: e.target.jobRole.value.trim(),
      numberOfOpening: parseInt(e.target.numberOfOpening.value),
    };

    try {
      if (selectedJob) {
        await axios.put(`${API_URL}/api/jobs/${selectedJob._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job updated successfully");
      } else {
        await axios.post(`${API_URL}/api/jobs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job created successfully");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving job");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "companyId",
      label: "Company",
      render: (item) => item.companyId?.name || "N/A",
    },
    { key: "jobRole", label: "Role" },
    { key: "numberOfOpening", label: "Openings" },
    {
      key: "skills",
      label: "Skills",
      render: (item) => item.skills.join(", "),
    },
  ];

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="m-0">Jobs Management</h3>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <CRUDTable
            data={jobs}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            title="Jobs"
            loading={loading}
            addButtonLabel="Add Job"
          />
        </div>
      </div>

      {/* Job Form Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedJob ? "Edit Job" : "Add New Job"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => !loading && setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Company</label>
                    <select
                      className="form-select"
                      name="companyId"
                      defaultValue={
                        selectedJob?.companyId?._id || selectedCompany || ""
                      }
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      defaultValue={selectedJob?.title}
                      required
                      minLength={5}
                      maxLength={100}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      defaultValue={selectedJob?.description}
                      rows="4"
                      required
                      minLength={20}
                      maxLength={1000}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ideal For</label>
                    <input
                      type="text"
                      className="form-control"
                      name="idealFor"
                      defaultValue={selectedJob?.idealFor}
                      placeholder="e.g., Fresh graduates, 2+ years experience"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Job Role</label>
                    <input
                      type="text"
                      className="form-control"
                      name="jobRole"
                      defaultValue={selectedJob?.jobRole}
                      required
                      minLength={3}
                      maxLength={50}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="skills"
                      defaultValue={selectedJob?.skills.join(", ")}
                      required
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                    <small className="form-text text-muted">
                      Enter skills separated by commas
                    </small>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Number of Openings</label>
                    <input
                      type="number"
                      className="form-control"
                      name="numberOfOpening"
                      defaultValue={selectedJob?.numberOfOpening || 1}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
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
                      {selectedJob ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedJob ? (
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

export default AdminJobs;
