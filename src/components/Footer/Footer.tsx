import React from 'react';
import './Footer.scss';
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { GrLinkedin } from "react-icons/gr";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Crypto App</h3>
          <p>Your go-to platform for real-time cryptocurrency data,
            market trends, and portfolio management. Stay informed and make smart investment decisions.
          </p>
          <div className="contact-info">
            <p>Email: info@cryptoapp.com</p>
            <p>Address: 123 Crypto Street, Blockchain City</p>
          </div>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/my-crypto">My Crypto</a></li>
            <li><a href="/market-cap">Market Cap</a></li>
            <li><a href="/auth">Login/Register</a></li>
          </ul>
        </div>

        <div className="footer-section resources">
          <h3>Resources</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><GrLinkedin size={30} /></a>
          </div>
          <p className="powered-by">Powered by <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer">CoinGecko API</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Crypto App. All rights reserved.</p>
      </div>
    </footer>
  )
}
