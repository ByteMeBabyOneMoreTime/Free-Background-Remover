import React from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-green-500" />
          <span className="text-2xl font-bold text-green-500">BG Remover</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-green-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-green-500 transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-500 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
