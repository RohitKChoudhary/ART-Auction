
import React from "react";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-art-dark-blue py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Palette className="h-6 w-6 text-art-purple" />
            <span className="font-bold text-xl art-gradient-text">ART Auction</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <a href="#how-it-works" className="text-gray-300 hover:text-art-purple transition-colors">How It Works</a>
            <a href="#features" className="text-gray-300 hover:text-art-purple transition-colors">Features</a>
            <Link to="/login" className="text-gray-300 hover:text-art-purple transition-colors">Login</Link>
            <Link to="/signup" className="text-gray-300 hover:text-art-purple transition-colors">Sign Up</Link>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 ART Auction. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-art-purple transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-art-purple transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-art-purple transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
