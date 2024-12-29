import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white py-5">
        <div className="container">
          <h1 className="display-4">Get in Touch</h1>
          <p className="lead">We would love to hear from you!</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section py-5">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-lg-6 mb-4">
              <h2 className="mb-3">Contact Information</h2>
              <p>
                <strong>Email:</strong> contact@ecs.com
              </p>
              <p>
                <strong>Phone:</strong> +1 234 567 890
              </p>
              <p>
                <strong>Address:</strong> 123 Business St, Strategy City, World
              </p>
              <p>Feel free to reach us anytime. We’re here to help!</p>
            </div>

            {/* Form */}
            <div className="col-lg-6">
              <h2 className="mb-3">Send Us a Message</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Your Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="4"
                    placeholder="Type your message"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="text-center mb-4">Our Location</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.955651315658!3d-37.81732774202101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2s123%20Business%20St%2C%20Strategy%20City!5e0!3m2!1sen!2s!4v1234567890123"
              width="100%"
              height="400"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              title="Our Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Inline CSS */}
      <style>{`
        .hero-section {
          background: linear-gradient(45deg, #007bff, #6610f2);
        }

        .contact-form-section {
          background-color: #f8f9fa;
        }

        .contact-page h2 {
          color: #007bff;
        }

        .map-section {
          margin-top: 2rem;
        }

        .map-container {
          overflow: hidden;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
