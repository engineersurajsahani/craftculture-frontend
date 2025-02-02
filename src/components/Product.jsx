import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  const categories = [
    { name: "All", color: "secondary" },
    { name: "Frames", color: "primary" },
    { name: "Wall Hanging", color: "success" },
    { name: "Bag", color: "danger" },
    { name: "Pen Stand", color: "warning" },
    { name: "Jewellery", color: "info" },
    { name: "Diyas", color: "dark" },
    { name: "Bottle Art", color: "light" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        console.log("Response:", response.data);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const username = localStorage.getItem("username");
    if (username) {
      const cartData = JSON.parse(localStorage.getItem("cart")) || {};
      const userCart = cartData[username] || [];
      setCartItemCount(userCart.length);
    }
  };

  const filterProducts = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  const addToCart = (product) => {
    const username = localStorage.getItem("username");
    if (!username) {
      const confirmLogin = window.confirm(
        "Please log in to add products to your cart. Would you like to log in now?"
      );
      if (confirmLogin) {
        navigate("/login");
      }
      return;
    }

    let cartData = JSON.parse(localStorage.getItem("cart")) || {};
    if (!cartData[username]) {
      cartData[username] = [];
    }

    // Check if product is already in cart
    const existingProductIndex = cartData[username].findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      // Product exists, increment quantity
      cartData[username][existingProductIndex].quantity =
        (cartData[username][existingProductIndex].quantity || 1) + 1;
    } else {
      // Add new product with quantity 1
      cartData[username].push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCartCount();

    const toast = document.createElement("div");
    toast.className = "toast show position-fixed top-0 end-0 m-3";
    toast.style.zIndex = "1000";
    toast.innerHTML = `
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${product.name} added to cart
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <div className="position-relative">
          <button className="btn btn-primary" onClick={() => navigate("/cart")}>
            Cart
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`btn btn-${category.color} ${
              activeCategory === category.name ? "active" : ""
            }`}
            onClick={() => filterProducts(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col-md-4">
            <div className="card h-100 shadow-sm hover-shadow">
              <img
                src={`${process.env.PUBLIC_URL}/images/products/${product.image}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ₹{product.price}</p>
                {product.offer > 0 && (
                  <p className="card-text text-danger">
                    Offer: {product.offer}% off
                  </p>
                )}
                <p
                  className={`card-text ${
                    product.status === "Available"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {product.status}
                </p>
                <button
                  className={`btn btn-primary mt-auto ${
                    product.status !== "Available" ? "disabled" : ""
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.status !== "Available"}
                >
                  {product.status === "Available"
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
