import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constant";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/companies`)
      .then((res) => {
        // Ensure we're setting an array
        const companiesData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.companies)
          ? res.data.companies
          : [];
        setCompanies(companiesData);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        // Optionally set an error state or show a user-friendly message
      });
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary display-4">
        Explore Companies
      </h1>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 shadow-sm"
          placeholder="Search Companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            className="col"
            onClick={() => navigate(`/jobs/${company._id}`)}
          >
            <div
              className="card h-100 shadow-sm"
              style={{
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={
                  `${process.env.PUBLIC_URL}/images/company/${company.image}` ||
                  "https://via.placeholder.com/300x200"
                }
                className="card-img-top"
                alt={company.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title text-primary">{company.name}</h5>
                <p className="card-text text-muted">{company.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Company;
