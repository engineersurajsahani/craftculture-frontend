import React from "react";
import "../css/Home.css";

const Home = () => {
  return (
    <div>
      {/* Hero Section with Parallax Effect */}
      <div className="parallax-section d-flex align-items-center justify-content-center text-center">
        <div className="text-dark">
          <h1 className="display-3 fw-bold">Welcome to Craft Culture</h1>
          <p className="lead">Where Creativity Meets Passion</p>
          <a href="#explore" className="btn btn-primary btn-lg mt-3">
            Explore Now
          </a>
        </div>
      </div>

      {/* About Us Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-4">About Craft Culture</h2>
            <p>
              At Craft Culture, we celebrate handmade art that tells a story.
              Our collection includes unique and sustainable products made with
              love and care by skilled artisans. From beautiful wall hangings to
              intricate jewelry, every item is crafted with a personal touch.
            </p>
            <p>
              Join us in supporting local artisans and preserving traditional
              craftsmanship. Discover the beauty of handmade products and bring
              a touch of artistry to your life.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src={`${process.env.PUBLIC_URL}/images/home.png`}
              className="img-fluid rounded shadow"
              alt="About Craft Culture"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="explore" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Our Featured Collections</h2>
          <p className="mb-5">
            Explore our best-selling and most-loved products!
          </p>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={`${process.env.PUBLIC_URL}/images/products/Jewellery/jewellery1.jpeg`}
                  className="card-img-top"
                  alt="Featured Product 1"
                />
                <div className="card-body">
                  <h5 className="card-title">Elegant Jewelry</h5>
                  <p className="card-text">
                    Discover timeless elegance with our handmade jewelry
                    collection.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={`${process.env.PUBLIC_URL}/images/products/WallHanging/wallhanging2.jpeg`}
                  className="card-img-top"
                  alt="Featured Product 2"
                />
                <div className="card-body">
                  <h5 className="card-title">Wall Hangings</h5>
                  <p className="card-text">
                    Add a touch of art to your walls with our exquisite handmade
                    pieces.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={`${process.env.PUBLIC_URL}/images/products/BottleArt/bottleart8.jpeg`}
                  className="card-img-top"
                  alt="Featured Product 3"
                />
                <div className="card-body">
                  <h5 className="card-title">Bottle Art</h5>
                  <p className="card-text">
                    Transform ordinary bottles into extraordinary decorative
                    pieces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">What Our Customers Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="testimonial bg-light p-4 rounded shadow-sm">
              <p>
                "The craftsmanship is outstanding! I absolutely love the jewelry
                I bought."
              </p>
              <h5 className="text-primary mt-3">- Anjali.</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="testimonial bg-light p-4 rounded shadow-sm">
              <p>
                "The wall hanging added so much charm to my living room. Highly
                recommend Craft Culture!"
              </p>
              <h5 className="text-primary mt-3">- Sangita.</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="testimonial bg-light p-4 rounded shadow-sm">
              <p>
                "Supporting artisans while getting amazing products? I'm in love
                with this store!"
              </p>
              <h5 className="text-primary mt-3">- Sayali.</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="parallax-cta text-dark text-center d-flex align-items-center">
        <div className="container">
          <h2 className="fw-bold display-4">
            Join the Craft Culture Community
          </h2>
          <p className="lead mb-4">
            Celebrate art, culture, and sustainability with us!
          </p>
          <a href="/products" className="btn btn-light btn-lg">
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
