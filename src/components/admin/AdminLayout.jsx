import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { path: "/admin/users", label: "Users", icon: "fas fa-users" },
    { path: "/admin/products", label: "Products", icon: "fas fa-box" },
    { path: "/admin/orders", label: "Orders", icon: "fas fa-shopping-cart" },
    { path: "/admin/jobs", label: "Jobs", icon: "fas fa-briefcase" },
    { path: "/admin/companies", label: "Companies", icon: "fas fa-building" },
    { path: "/admin/applicants", label: "Applicants", icon: "fas fa-user-tie" },
    {
      path: "/admin/donate-money",
      label: "Money Donations",
      icon: "fas fa-hand-holding-usd",
    },
    {
      path: "/admin/donate-products",
      label: "Product Donations",
      icon: "fas fa-gift",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h4 className="text-primary">Admin Panel</h4>
            </div>
            <ul className="nav flex-column">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              {location.pathname.split("/").pop().charAt(0).toUpperCase() +
                location.pathname.split("/").pop().slice(1)}
            </h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
