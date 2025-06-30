import React from 'react';
import './About.scss';

export default function About() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>
        Welcome to CryptoDash! We are dedicated to providing you with a comprehensive and easy-to-use cryptocurrency dashboard to help you track and manage your digital assets.
      </p>
      <h2>Our Mission</h2>
      <p>
        Our mission is to empower individuals to navigate the complex world of cryptocurrencies with confidence. We aim to provide accurate, real-time data and intuitive tools to help you make informed decisions about your crypto investments.
      </p>
      <h2>What We Do</h2>
      <p>
        CryptoDash allows you to:
      </p>
      <ul>
        <li>Track the prices and market data of various cryptocurrencies.</li>
        <li>Build and monitor your personal cryptocurrency portfolio.</li>
        <li>Stay updated with key market indicators.</li>
        <li>Access detailed information about individual coins.</li>
      </ul>
      <h2>Our Story</h2>
      <p>
        CryptoDash was founded by a group of cryptocurrency enthusiasts who saw the need for a reliable and user-friendly platform to track digital assets. Our team has years of experience in the tech and finance industries, and we are passionate about making cryptocurrency accessible to everyone.
      </p>
      <h2>Get in Touch</h2>
      <p>
        We are always looking for ways to improve and would love to hear from you. If you have any questions, feedback, or suggestions, please visit our <a href="/contact">Contact Us</a> page.
      </p>
      <p>Thank you for using CryptoDash!</p>
    </div>
  );
}
