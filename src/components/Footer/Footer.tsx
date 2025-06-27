import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { GrLinkedin } from "react-icons/gr";

export default function Footer() {
  const routes = [
    {
      path: '/',
      title: 'Home',
    },
    {
      path: '/my-crypto',
      title: 'My Crypto',
    },
    {
      path: '/market-cap',
      title: 'Market Cap',
    },
    {
      path: '/auth',
      title: 'Login/Register',
    },
  ]
  const resources = [
    {
      path: '/about',
      title: 'About Us',
    },
    {
      path: '/contact',
      title: 'Contact',
    },
    {
      path: '/privacy',
      title: 'Privacy',
    },
    {
      path: '/terms',
      title: 'Terms of Service',
    }

  ]

  const socialLinks = [
    {
      url: 'https://facebook.com',
      icon: <FaFacebook size={30} />,
    },
    {
      url: 'https://twitter.com',
      icon: <FaTwitter size={30} />,
    },
    {
      url: 'https://linkedin.com',
      icon: <GrLinkedin size={30} />,
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Contact us</h3>
          <div className="contact-info">
            <p>Email: info@cryptoapp.com</p>
            <p>Address: 123 Crypto Street, Blockchain City</p>
          </div>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            {routes.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  {item.title}
                </Link>
              </li>
            ))}

          </ul>
        </div>

        <div className="footer-section resources">
          <h3>Resources</h3>
          <ul>
            {
              resources.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>
                    {item.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon}
              </a>
            ))}
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
