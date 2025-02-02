import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, [navigate]);

  const loadCart = () => {
    try {
      const username = localStorage.getItem("username");

      if (!username) {
        setError("Please log in to view your cart.");
        navigate("/login");
        return;
      }

      const cartData = JSON.parse(localStorage.getItem("cart")) || {};
      const userCart = cartData[username] || [];
      setCart(userCart);
      calculateTotal(userCart);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Error loading cart data. Please try again.");
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.price * (item.quantity || 1);
      const discount = (price * (item.offer || 0)) / 100;
      return sum + (price - discount);
    }, 0);
    setTotalAmount(total);
  };

  const updateQuantity = (index, change) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;

      const cartData = JSON.parse(localStorage.getItem("cart")) || {};
      const updatedCart = [...cart];

      const newQuantity = (updatedCart[index].quantity || 1) + change;
      if (newQuantity < 1) return;

      updatedCart[index].quantity = newQuantity;
      cartData[username] = updatedCart;

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(cartData));
      calculateTotal(updatedCart);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Error updating quantity. Please try again.");
    }
  };

  const removeFromCart = (index) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;

      const cartData = JSON.parse(localStorage.getItem("cart")) || {};
      const updatedCart = cart.filter((_, i) => i !== index);

      cartData[username] = updatedCart;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(cartData));
      calculateTotal(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Error removing item. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button
            className="btn btn-danger ms-3"
            onClick={() => {
              setError(null);
              loadCart();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 py-4">
      <section>
        <div className="row">
          <div className="col-12">
            <h2 className="h2 text-center mb-4 fw-bold">
              <i className="fas fa-shopping-cart me-2"></i>
              Your Shopping Cart
            </h2>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-basket fa-4x mb-3 text-muted"></i>
            <p className="lead mb-4">Your cart is empty</p>
            <button
              className="btn btn-primary btn-rounded ripple-surface"
              onClick={() => navigate("/")}
            >
              <i className="fas fa-store me-2"></i>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mb-4 mb-lg-0">
              {cart.map((item, index) => (
                <div className="card mb-3 shadow-2-strong" key={index}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="bg-image hover-overlay hover-zoom ripple rounded">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/products/${item.image}`}
                            alt={item.name}
                            className="w-100"
                          />
                          <a href="#!">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.2)",
                              }}
                            ></div>
                          </a>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3 mb-md-0">
                        <p className="h5 mb-3">{item.name}</p>
                        <div className="d-flex flex-row">
                          <div className="text-danger me-4">
                            <span className="h5">₹{item.price}</span>
                            {item.offer > 0 && (
                              <span className="ms-2 badge badge-success">
                                {item.offer}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 d-flex justify-content-start align-items-center">
                          <button
                            className="btn btn-link px-2"
                            onClick={() => updateQuantity(index, -1)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>

                          <span className="mx-3 fw-bold">
                            {item.quantity || 1}
                          </span>

                          <button
                            className="btn btn-link px-2"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3 mb-md-0">
                        <button
                          className="btn btn-outline-danger btn-floating"
                          onClick={() => removeFromCart(index)}
                          data-mdb-toggle="tooltip"
                          title="Remove item"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="card shadow-2-strong">
                <div className="card-body p-4">
                  <h3 className="h5 mb-4">Order Summary</h3>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between fw-bold mb-4">
                    <span>Total</span>
                    <span className="text-danger h5 mb-0">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-lg btn-block ripple-surface w-100"
                    onClick={() => navigate("/checkout")}
                  >
                    <i className="fas fa-lock me-2"></i>
                    Proceed to Checkout
                  </button>

                  <button
                    className="btn btn-link w-100 mt-3"
                    onClick={() => navigate("/")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
