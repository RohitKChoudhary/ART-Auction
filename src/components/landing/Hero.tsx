
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const Hero = () => {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-art-purple/20 to-art-teal/20 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-art-purple to-art-teal z-10"></div>
      
      <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="h-8 w-8 text-art-purple" />
          <span className="font-bold text-2xl art-gradient-text">ART Auction</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-gray-300 hover:text-art-purple transition-colors">How It Works</a>
          <a href="#features" className="text-gray-300 hover:text-art-purple transition-colors">Features</a>
          <Link to="/login" className="text-art-purple hover:text-art-purple-light transition-colors">Login</Link>
          <Link to="/signup">
            <Button className="bg-art-purple hover:bg-art-purple-dark text-white">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Link to="/login">
            <Button className="bg-art-purple hover:bg-art-purple-dark text-white">
              Login
            </Button>
          </Link>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="art-gradient-text">ART Auction</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            A versatile digital platform connecting buyers and sellers across multiple domains. 
            Discover, bid, and trade with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-art-purple hover:bg-art-purple-dark text-white text-lg px-8 py-6">
                Join Now
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="border-art-purple text-art-purple hover:bg-art-purple/10 text-lg px-8 py-6">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-art-dark to-transparent"></div>
    </header>
  );
};

export default Hero;
