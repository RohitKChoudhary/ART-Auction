
import React from "react";
import { Users, Palette, Zap } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-art-dark-blue">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How ART Auction Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform offers a seamless experience for buyers and sellers to connect and trade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
            <div className="h-16 w-16 bg-art-purple/20 rounded-full flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-art-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Create Account</h3>
            <p className="text-gray-400">
              Sign up and create your profile in seconds. Verify your email to access all features.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
            <div className="h-16 w-16 bg-art-teal/20 rounded-full flex items-center justify-center mb-6">
              <Palette className="h-8 w-8 text-art-teal" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Explore</h3>
            <p className="text-gray-400">
              Browse through available listings and find items that interest you.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
            <div className="h-16 w-16 bg-art-purple/20 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-art-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Trade</h3>
            <p className="text-gray-400">
              Place bids, win auctions, and complete secure transactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
