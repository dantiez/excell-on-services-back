import React from "react";
import styled from "styled-components";

const AboutUsPage = () => {
  return (
    <AboutUsContainer>
      <Section className="about-intro">
        <h1>About Excell-on Consulting Services</h1>
        <p>
          Excell-on Consulting Services (ECS) is a leading consulting company
          that helps organizations develop innovative business and commerce
          strategies to leverage new technologies and drive economic growth. We
          focus on optimizing and aligning business and IT strategies to meet
          the needs of our clients.
        </p>
        <img
          src="https://via.placeholder.com/600x400"
          alt="Excell-on Consulting"
        />
      </Section>

      <Section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          ECS's mission is to provide creative and effective solutions that help
          organizations succeed in a rapidly changing business environment,
          using technology to create exceptional products and services.
        </p>
        <img src="https://via.placeholder.com/600x400" alt="Mission" />
      </Section>

      <Section className="about-services">
        <h2>Our Services</h2>
        <ul>
          <li>
            <strong>In-bound Services:</strong> 24/7 customer support, including
            technical assistance, customer service, and dealer location support.
          </li>
          <li>
            <strong>Out-bound Services:</strong> Product promotions, customer
            satisfaction surveys, and telemarketing, using technology to achieve
            maximum results.
          </li>
          <li>
            <strong>Telemarketing Services:</strong> Conducting marketing and
            sales campaigns to promote products and services, focusing on
            reaching target customers.
          </li>
        </ul>
        <img src="https://via.placeholder.com/600x400" alt="Services" />
      </Section>

      <Section className="about-clients">
        <h2>Our Clients</h2>
        <p>
          ECS works with a wide range of clients, including manufacturers,
          service providers, and organizations that require in-bound, out-bound,
          or telemarketing services. We provide optimal solutions based on the
          needs and desires of our clients.
        </p>
        <img src="https://via.placeholder.com/600x400" alt="Clients" />
      </Section>

      <Section className="about-contact">
        <h2>Contact Information</h2>
        <p>
          If you have any questions or requests, please reach out to us using
          the contact information below:
        </p>
        <ul>
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
        <img src="https://via.placeholder.com/600x400" alt="Contact" />
      </Section>
    </AboutUsContainer>
  );
};

const AboutUsContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Section = styled.section`
  margin-bottom: 40px;

  h1,
  h2 {
    color: #2c3e50;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: #34495e;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  ul li {
    margin-bottom: 10px;
  }

  img {
    width: 100%;
    height: auto;
    margin-top: 20px;
    border-radius: 8px;
  }
`;

export default AboutUsPage;
