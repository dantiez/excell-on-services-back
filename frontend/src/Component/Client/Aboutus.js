import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUsPage = () => {
  return (
    <div className="container py-5">
      {/* Introduction Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h1 className="text-primary">About Excell-on Consulting Services</h1>
          <p>
            Excell-on Consulting Services (ECS) is a leading consulting company
            that helps organizations develop innovative business and commerce
            strategies to leverage new technologies and drive economic growth.
            We focus on optimizing and aligning business and IT strategies to
            meet the needs of our clients.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Excell-on Consulting"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6 order-lg-2">
          <h2 className="text-success">Our Mission</h2>
          <p>
            ECS's mission is to provide creative and effective solutions that
            help organizations succeed in a rapidly changing business
            environment, using technology to create exceptional products and
            services.
          </p>
        </div>
        <div className="col-lg-6 order-lg-1">
          <img
            src="https://plus.unsplash.com/premium_photo-1726711234495-92966b568e13?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mission"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="row mb-5">
        <div className="col">
          <h2 className="text-info text-center mb-4">Our Services</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card border-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">In-bound Services</h5>
                  <p className="card-text">
                    24/7 customer support, including technical assistance,
                    customer service, and dealer location support.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Out-bound Services</h5>
                  <p className="card-text">
                    Product promotions, customer satisfaction surveys, and
                    telemarketing, using technology to achieve maximum results.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Telemarketing Services</h5>
                  <p className="card-text">
                    Conducting marketing and sales campaigns to promote products
                    and services, focusing on reaching target customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="text-warning">Our Clients</h2>
          <p>
            ECS works with a wide range of clients, including manufacturers,
            service providers, and organizations that require in-bound,
            out-bound, or telemarketing services. We provide optimal solutions
            based on the needs and desires of our clients.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Clients"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="row">
        <div className="col">
          <h2 className="text-danger text-center">Contact Information</h2>
          <p className="text-center">
            If you have any questions or requests, please reach out to us using
            the contact information below:
          </p>
          <ul className="list-unstyled text-center">
            <li>
              <strong>Email:</strong> contact@excellon.com
            </li>
            <li>
              <strong>Phone:</strong> +123 456 7890
            </li>
            <li>
              <strong>Address:</strong> 123 Excell-on St, City XYZ, Vietnam
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
