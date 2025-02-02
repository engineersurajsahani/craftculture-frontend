import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productStats, setProductStats] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    searchTerm: "",
  });

  const token = localStorage.getItem("token");

  const validCategories = [
    "Frames",
    "Wall Hanging",
    "Bag",
    "Pen Stand",
    "Jewellery",
    "Diyas",
    "Bottle Art",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`, {
          params: {
            category: filters.category,
            status: filters.status,
            search: filters.searchTerm,
          },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/products/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productsRes.data.products);
      setProductStats(statsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        name: e.target.name.value.trim(),
        category: e.target.category.value,
        price: Number(e.target.price.value),
        quantity: Number(e.target.quantity.value),
        status: e.target.status.value,
        offer: Number(e.target.offer.value || 0),
        image: e.target.image.value.trim(),
      };

      if (selectedProduct) {
        await axios.put(
          `${API_URL}/api/products/${selectedProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created successfully");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!products.length) return;

    const headers = [
      "Name",
      "Category",
      "Price",
      "Quantity",
      "Status",
      "Offer",
    ];

    const data = products.map((product) => [
      product.name,
      product.category,
      product.price.toFixed(2),
      product.quantity,
      product.status,
      `${product.offer}%`,
    ]);

    const csvContent = [headers, ...data]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.csv";
    link.click();
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item) =>
        item.image ? (
          <img
            src={`${process.env.PUBLIC_URL}/images/products/${item.image}`}
            alt={item.name}
            className="rounded"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/images/home.png`;
            }}
          />
        ) : (
          <div
            className="rounded bg-light d-flex align-items-center justify-content-center"
            style={{ width: "50px", height: "50px" }}
          >
            <i className="fas fa-image text-muted"></i>
          </div>
        ),
    },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    {
      key: "price",
      label: "Price",
      render: (item) => `₹${item.price.toFixed(2)}`,
    },
    {
      key: "quantity",
      label: "Stock",
      render: (item) => (
        <span
          className={`badge ${
            item.quantity === 0
              ? "bg-danger"
              : item.quantity < 5
              ? "bg-warning"
              : "bg-success"
          }`}
        >
          {item.quantity}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`badge ${
            item.status === "Available" ? "bg-success" : "bg-danger"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "offer",
      label: "Offer",
      render: (item) =>
        item.offer ? (
          <span className="badge bg-primary">{item.offer}% OFF</span>
        ) : (
          "-"
        ),
    },
  ];

  const renderProductStats = () => {
    if (!productStats) return null;

    const { overview } = productStats;

    return (
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="card-title">Total Products</h6>
              <h4 className="mb-0">{overview.totalProducts}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="card-title">Total Stock Value</h6>
              <h4 className="mb-0">
                ₹{overview.totalValue?.toFixed(2) || "0.00"}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="card-title">Average Price</h6>
              <h4 className="mb-0">
                ₹{overview.averagePrice?.toFixed(2) || "0.00"}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h6 className="card-title">Out of Stock</h6>
              <h4 className="mb-0">{overview.outOfStock || 0}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid px-4">
      <div className="card my-4">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="m-0">Products Management</h3>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All Categories</option>
                {validCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-auto">
              <div className="btn-group">
                <button
                  className="btn btn-success me-2"
                  onClick={handleExportCSV}
                  disabled={!products.length}
                >
                  <i className="fas fa-download me-2"></i>
                  Export CSV
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  <i className="fas fa-plus me-2"></i>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {renderProductStats()}

          <CRUDTable
            data={products}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            title="Products"
          />
        </div>
      </div>

      {/* Product Form Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedProduct ? "Edit Product" : "Add New Product"}
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
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    defaultValue={selectedProduct?.name}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    defaultValue={selectedProduct?.category}
                    required
                  >
                    <option value="">Select Category</option>
                    {validCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          defaultValue={selectedProduct?.price}
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        defaultValue={selectedProduct?.quantity}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        defaultValue={selectedProduct?.status}
                        required
                      >
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Offer (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="offer"
                        defaultValue={selectedProduct?.offer || 0}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="tetx"
                    className="form-control"
                    name="image"
                    defaultValue={selectedProduct?.image}
                    placeholder="image.jpg"
                  />
                  {selectedProduct?.image && (
                    <div className="mt-2">
                      <img
                        src={selectedProduct.image}
                        alt="Product preview"
                        className="rounded"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${process.env.PUBLIC_URL}/images/home.png`;
                        }}
                      />
                    </div>
                  )}
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
                      {selectedProduct ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedProduct ? (
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

export default AdminProducts;
