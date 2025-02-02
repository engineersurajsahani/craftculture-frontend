import React from "react";
import "../css/OurStory.css";

const OurStory = () => {
  return (
    <div>
      {/* Hero Section with Parallax Effect */}
      <div className="parallax-story d-flex align-items-center justify-content-center text-center">
        <div className="text-dark">
          <h1 className="display-3 fw-bold">Our Story</h1>
          <p className="lead">Where Art Meets Responsibility</p>
        </div>
      </div>

      {/* About Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-4">Who We Are</h2>
            <p>
              Craft Culture began with a vision: to create a platform where art
              and culture intertwine with social responsibility. Our journey
              started as a small community of artists who believed in
              sustainability and giving back to society.
            </p>
            <p>
              Today, we proudly collaborate with artisans, organizations, and
              communities worldwide to promote sustainability and support
              meaningful causes. Whether it's through our donations,
              collaborative projects, or eco-friendly products, we strive to
              make a positive impact.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src={`${process.env.PUBLIC_URL}/images/home.png`}
              className="img-fluid rounded shadow"
              alt="Craft Culture Story"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Our Core Values</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <i className="bi bi-heart-fill text-danger display-4"></i>
              <h5 className="mt-3">Passion for Art</h5>
              <p>
                We celebrate the beauty of handmade craftsmanship and
                creativity.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <i className="bi bi-tree-fill text-success display-4"></i>
              <h5 className="mt-3">Sustainability</h5>
              <p>
                We are committed to eco-friendly practices and sustainable
                development.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <i className="bi bi-people-fill text-primary display-4"></i>
              <h5 className="mt-3">Community First</h5>
              <p>
                We believe in uplifting communities through collaboration and
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="container py-5">
        <h2 className="fw-bold text-center mb-4">Our Journey So Far</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h5 className="float-before">2015: The Beginning</h5>
            <p>
              Craft Culture was born from a dream of uniting art,
              sustainability, and social impact.
            </p>
          </div>
          <div className="timeline-item">
            <h5>2018: First Major Collaboration</h5>
            <p>
              Partnered with local artisans to bring eco-friendly products to
              the forefront.
            </p>
          </div>
          <div className="timeline-item">
            <h5>2020: Expanding Horizons</h5>
            <p>
              Started global collaborations and launched new sustainable product
              lines.
            </p>
          </div>
          <div className="timeline-item">
            <h5>2023: 1 Million Lives Touched</h5>
            <p>
              Celebrated our milestone of positively impacting over 1 million
              lives worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="parallax-story-cta text-dark text-center d-flex align-items-center">
        <div className="container">
          <h2 className="fw-bold display-4">Join Us in Our Mission</h2>
          <p className="lead mb-4">
            Together, we can create a more sustainable and artistic world.
          </p>
          <a href="/donate" className="btn btn-light btn-lg">
            Get Involved
          </a>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
