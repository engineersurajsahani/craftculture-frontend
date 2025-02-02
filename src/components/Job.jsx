import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constant";

const Job = () => {
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch company details
        const companyRes = await axios.get(
          `${API_URL}/api/companies/${companyId}`
        );
        setCompany(companyRes.data);

        // Fetch jobs using the updated endpoint
        const jobsRes = await axios.get(
          `${API_URL}/api/jobs/company/${companyId}`
        );
        setJobs(jobsRes.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

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
      {/* Company Header */}
      <div className="text-center mb-5">
        <h1 className="text-primary mb-4">
          {company?.name ? `${company.name} - Jobs` : "Company Jobs"}
        </h1>
        {company?.description && (
          <p className="text-muted mx-auto" style={{ maxWidth: "800px" }}>
            {company.description}
          </p>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="col">
              <div
                className="card h-100 shadow-sm"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">{job.title}</h5>
                  <p className="card-text text-muted mb-3">{job.description}</p>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Required Skills:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-primary bg-opacity-10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {job.numberOfOpening > 1 && (
                    <p className="text-muted small mb-3">
                      {job.numberOfOpening} positions available
                    </p>
                  )}
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/apply/${companyId}/${job._id}`)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">
              No jobs are currently available for this company.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;
