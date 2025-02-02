import React from "react";
import { Link } from "react-router-dom";
import "../css/Donate.css";

const Donate = () => {
  return (
    <div className="donate-page">
      {/* Hero Section */}
      <div className="donate-hero d-flex align-items-center justify-content-center text-center">
        <div>
          <h1 className="display-4 fw-bold text-light">Make a Difference</h1>
          <p className="lead text-light">
            Your generosity fuels change and hope.
          </p>
        </div>
      </div>

      {/* Donation Options Section */}
      <section className="container py-5 text-center">
        <h2 className="fw-bold mb-4">How You Can Help</h2>
        <p className="mb-5">
          Whether it's a monetary contribution or a product donation, every
          effort makes a lasting impact. Choose how you'd like to support our
          mission.
        </p>
        <div className="row g-4">
          <div className="col-md-6">
            <Link to="/donate-money" className="text-decoration-none">
              <div className="donate-card shadow p-4 rounded-3">
                <i className="bi bi-currency-dollar text-primary display-1"></i>
                <h5 className="mt-3 fw-bold">Donate Money</h5>
                <p>
                  Support us financially to help expand our reach and support
                  more communities.
                </p>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/donate-product" className="text-decoration-none">
              <div className="donate-card shadow p-4 rounded-3">
                <i className="bi bi-gift-fill text-success display-1"></i>
                <h5 className="mt-3 fw-bold">Donate Product</h5>
                <p>
                  Contribute products or handmade items to support our programs
                  and initiatives.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
