import React from 'react';
import './Privacy.scss';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
     const navigate = useNavigate();
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>

      <p><em>Last Updated: June 30, 2025</em></p>

      <p>
        This Privacy Policy describes how [Your App Name] ("we," "us," or "our") collects, uses, and discloses your information when you use our cryptocurrency dashboard application (the "Service").
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect several types of information from and about users of our Service, including:
      </p>
      <ul>
        <li>
          **Personal Information:** Information that can be used to identify you, such as your name, email address, or other contact information, which you may provide when you register for an account or contact us.
        </li>
        <li>
          **Usage Data:** Information about how you access and use the Service, such as your IP address, browser type, operating system, pages viewed, and the dates and times of your visits.
        </li>
        <li>
          **Cryptocurrency Data:** Information related to the cryptocurrencies you track or add to your dashboard, such as coin IDs, quantities, or transaction history if you choose to connect external wallets or exchanges (please specify if this is a feature and what data is accessed).
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>
        We use the information we collect for various purposes, including:
      </p>
      <ul>
        <li>To provide, operate, and maintain our Service.</li>
        <li>To improve, personalize, and expand our Service.</li>
        <li>To understand and analyze how you use our Service.</li>
        <li>To develop new products, services, features, and functionality.</li>
        <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes.</li>
        <li>To process your transactions (if applicable).</li>
        <li>To find and prevent fraud.</li>
      </ul>

      <h2>Information Sharing and Disclosure</h2>
      <p>
        We may share your information with third parties in the following situations:
      </p>
      <ul>
        <li>
          **With Service Providers:** We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.
        </li>
        <li>
          **For Business Transfers:** We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
        </li>
        <li>
          **With Your Consent:** We may disclose your personal information for any other purpose with your consent.
        </li>
        <li>
          **Legal Requirements:** We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
        </li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Service, you are responsible for keeping this password confidential.
      </p>

      <h2>Your Data Protection Rights</h2>
      <p>
        Depending on your location and applicable laws, you may have the following rights regarding your personal information:
      </p>
      <ul>
        <li>The right to access, update, or delete the information we have on you.</li>
        <li>The right of rectification.</li>
        <li>The right to object.</li>
        <li>The right of restriction.</li>
        <li>The right to data portability.</li>
        <li>The right to withdraw consent.</li>
      </ul>

      <h2>Third-Party Links</h2>
      <p>
        Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li>By email: cryptotest@mail.com</li>
        <li>By visiting this page : <span  className='navigattoConact' onClick={() => navigate('/contact')}>Contact Us</span></li>
      </ul>

      <p><strong>Please Note:</strong> This is a template Privacy Policy. You must review and customize it to accurately reflect your application's data collection, usage, and disclosure practices, and ensure compliance with all applicable laws and regulations (e.g., GDPR, CCPA).</p>
    </div>
  );
}
