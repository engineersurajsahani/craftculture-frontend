import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [applicantsRes, companiesRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/applicants`, {
          params: {
            company: selectedCompany,
            job: selectedJob,
          },
        }),
        axios.get(`${API_URL}/api/companies`),
        axios.get(`${API_URL}/api/jobs`),
      ]);

      setApplicants(applicantsRes.data.applicants);
      setCompanies(companiesRes.data.companies);
      setJobs(jobsRes.data.jobs);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCompany, selectedJob]);

  const handleView = (applicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this application? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/api/applicants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Application deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error deleting application"
        );
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Position",
      "Application Date",
    ];
    const data = applicants.map((app) => [
      app.name,
      app.email,
      app.phoneNumber,
      app.companyId?.name || "N/A",
      app.jobId?.title || "N/A",
      new Date(app.dateApplied).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...data]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "applicants.csv";
    link.click();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    {
      key: "companyId",
      label: "Company",
      render: (item) => item.companyId?.name || "N/A",
    },
    {
      key: "jobId",
      label: "Position",
      render: (item) => item.jobId?.title || "N/A",
    },
    {
      key: "dateApplied",
      label: "Applied On",
      render: (item) => new Date(item.dateApplied).toLocaleDateString(),
    },
  ];

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="m-0">Job Applications</h3>
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
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">All Positions</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-success"
                onClick={handleExportCSV}
                disabled={!applicants.length}
              >
                <i className="fas fa-download me-2"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <CRUDTable
            data={applicants}
            columns={columns}
            onEdit={handleView}
            onDelete={handleDelete}
            loading={loading}
            title="Applications"
          />
        </div>
      </div>

      {/* Applicant Details Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Application Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedApplicant && (
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">Applicant Information</h6>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Name:</strong> {selectedApplicant.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedApplicant.email}
                        </p>
                        <p>
                          <strong>Phone:</strong>{" "}
                          {selectedApplicant.phoneNumber}
                        </p>
                        <p>
                          <strong>Applied On:</strong>{" "}
                          {new Date(
                            selectedApplicant.dateApplied
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">Company Details</h6>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Company:</strong>{" "}
                          {selectedApplicant.companyId?.name}
                        </p>
                        <p>
                          <strong>Position:</strong>{" "}
                          {selectedApplicant.jobId?.title}
                        </p>
                        <p>
                          <strong>Role:</strong>{" "}
                          {selectedApplicant.jobId?.jobRole}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Job Details</h6>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Description:</strong>
                          <br />
                          {selectedApplicant.jobId?.description}
                        </p>
                        <p>
                          <strong>Required Skills:</strong>
                          <br />
                          {selectedApplicant.jobId?.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="badge bg-primary me-2 mb-2"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </p>
                      </div>
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
              <div className="btn-group">
                <a
                  href={`mailto:${selectedApplicant?.email}`}
                  className="btn btn-primary"
                >
                  <i className="fas fa-envelope me-2"></i>
                  Email Applicant
                </a>
                <a
                  href={`tel:${selectedApplicant?.phoneNumber}`}
                  className="btn btn-success"
                >
                  <i className="fas fa-phone me-2"></i>
                  Call Applicant
                </a>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (selectedApplicant) {
                    handleDelete(selectedApplicant._id);
                    setShowModal(false);
                  }
                }}
              >
                <i className="fas fa-trash me-2"></i>
                Delete Application
              </button>
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

export default AdminApplicants;
