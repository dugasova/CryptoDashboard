import React from 'react';
import './Contact.scss';

export default function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <p>
        If you have any questions, feedback, or inquiries, please feel free to contact us using the information below or by filling out the contact form.
      </p>

      <div className="contact-info">
        <h2>Contact Information</h2>
        <p>Email: [Your Email Address]</p>
        <p>Phone: [Your Phone Number (Optional)]</p>
        <p>Address: [Your Address (Optional)]</p>
      </div>

      <div className="contact-form">
        <h2>Send us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
