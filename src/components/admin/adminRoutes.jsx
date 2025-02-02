import React from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminProducts from "./components/AdminProducts";
import AdminOrders from "./components/AdminOrders";
import AdminJobs from "./components/AdminJobs";
import AdminCompanies from "./components/AdminCompanies";
import AdminApplicants from "./components/AdminApplicants";
import AdminDonations from "./components/AdminDonations";

// Admin Route Guard Component
const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole || userRole !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Admin Routes Configuration
export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <AdminUsers />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <AdminProducts />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <AdminRoute>
        <AdminOrders />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <AdminRoute>
        <AdminJobs />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <AdminRoute>
        <AdminCompanies />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/applicants",
    element: (
      <AdminRoute>
        <AdminApplicants />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/donate-money",
    element: (
      <AdminRoute>
        <AdminDonations type="money" />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/donate-products",
    element: (
      <AdminRoute>
        <AdminDonations type="product" />
      </AdminRoute>
    ),
  },
];

export default adminRoutes;
