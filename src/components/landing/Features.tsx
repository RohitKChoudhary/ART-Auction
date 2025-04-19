
import React from "react";
import { ShieldCheck, Clock, Zap, Award } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20 bg-art-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ART Auction?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform is built with state-of-the-art technology to provide a secure and enjoyable experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 flex flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-art-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-400">
              Advanced security measures protect your account and transactions.
            </p>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center">
            <Clock className="h-10 w-10 text-art-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-gray-400">
              Stay updated with live bidding and instant notifications.
            </p>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center">
            <Zap className="h-10 w-10 text-art-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
            <p className="text-gray-400">
              Enjoy a lightning-fast experience on any device, anywhere.
            </p>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center">
            <Award className="h-10 w-10 text-art-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-400">
              Join a community of verified buyers and sellers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
