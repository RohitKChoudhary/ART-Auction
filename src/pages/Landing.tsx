
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-art-dark text-white">
      <Hero />
      <HowItWorks />
      <Features />
      
      <section className="py-20 bg-gradient-to-br from-art-purple/30 to-art-teal/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users already trading on ART Auction.
          </p>
          <Link to="/signup">
            <Button className="bg-art-purple hover:bg-art-purple-dark text-white text-lg px-8 py-6">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
