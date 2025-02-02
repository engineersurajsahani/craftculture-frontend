import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constant";

const ApplyFormForJob = () => {
  const { companyId, jobId } = useParams();
  const [company, setCompany] = useState({});
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [companyRes, jobRes] = await Promise.all([
          axios.get(`${API_URL}/api/companies/${companyId}`),
          axios.get(`${API_URL}/api/jobs/${jobId}`),
        ]);
        setCompany(companyRes.data);
        setJob(jobRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/applicants`, {
        ...formData,
        companyId,
        jobId,
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting application");
      console.log("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="text-center text-primary mb-4">
                Apply for {job.title}
              </h1>

              <div className="mb-4">
                <h5 className="text-primary">Company Details</h5>
                <p className="mb-1">
                  <strong>Company:</strong> {company.name}
                </p>
                <p className="mb-0">
                  <strong>Description:</strong> {company.description}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="text-primary">Job Details</h5>
                <p className="mb-1">
                  <strong>Role:</strong> {job.title}
                </p>
                <p className="mb-1">
                  <strong>Description:</strong> {job.description}
                </p>
                <p className="mb-0">
                  <strong>Required Skills:</strong> {job.skills?.join(", ")}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <div
        className={`modal fade ${showSuccessModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Application Submitted Successfully!
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="modal-body">
              <p>
                Thank you for applying! Please send your CV to
                craftculture@gmail.com
              </p>
              <p>We will review your application and get back to you soon.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyFormForJob;
