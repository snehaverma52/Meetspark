import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="logo" className="w-8 h-8" />
            <h2 className="text-white text-xl font-bold">MeetSum AI</h2>
          </div>

          <p className="text-sm">
            AI-powered meeting summaries that help teams save time and stay productive.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/features" className="hover:text-white">Features</Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white">Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">

        <p className="text-sm">
          © {new Date().getFullYear()} MeetSum AI. All rights reserved.
        </p>

        <div className="flex gap-4 mt-4 md:mt-0 text-lg">

          {/* ✅ Instagram */}
          <a href="https://instagram.com/naman_shalot" target="_blank">
            <FaInstagram className="hover:text-white cursor-pointer" />
          </a>

          {/* GitHub */}
          <a href="https://github.com/Vansh-Sharma2026" target="_blank">
            <FaGithub className="hover:text-white cursor-pointer" />
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com/in/vansh-sharma-99296330b" target="_blank">
            <FaLinkedin className="hover:text-white cursor-pointer" />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;