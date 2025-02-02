import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center text-lg-start shadow-sm footer">
      <div className="container p-4">
        <p className="mb-4 text-center">
          © 2024 <span className="fw-bold">Craft Culture</span>. All Rights
          Reserved.
        </p>
        <div className="d-flex justify-content-center gap-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/engineersurajsahani/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/engineersurajsahani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fab fa-instagram fa-lg"></i>
          </a>
          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=100077668355471&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          {/* LeetCode */}
          <a
            href="https://leetcode.com/u/surajsahani9321/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fas fa-code fa-lg"></i>
          </a>
          {/* HackerRank */}
          <a
            href="https://www.hackerrank.com/profile/radhashyam9321"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fas fa-terminal fa-lg"></i>
          </a>
          {/* CodeChef */}
          <a
            href="https://www.codechef.com/users/technicalsuraj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fas fa-utensils fa-lg"></i>
          </a>
          {/* Coding Ninjas */}
          <a
            href="https://www.naukri.com/code360/profile/techsurajsahani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <i className="fas fa-graduation-cap fa-lg"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
