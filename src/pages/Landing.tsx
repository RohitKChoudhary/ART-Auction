
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  ShieldCheck, 
  Clock, 
  Users, 
  Zap, 
  Award 
} from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-art-dark text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-art-purple/20 to-art-teal/20 z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-art-purple to-art-teal z-10"></div>
        
        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-art-purple" />
            <span className="font-bold text-2xl art-gradient-text">ART AUCTION</span>
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
              Discover & Bid on <span className="art-gradient-text">Premium Artwork</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              A sleek and secure auction platform where art buyers and sellers connect in real-time. 
              Bid, win, and grow your collection with confidence.
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
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-art-dark-blue">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ART Auction Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform offers a seamless experience for art enthusiasts to buy and sell premium artwork.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
              <div className="h-16 w-16 bg-art-purple/20 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-art-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Create Account</h3>
              <p className="text-gray-400">
                Sign up and create your ART Auction profile in seconds. Verify your email to access all features.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
              <div className="h-16 w-16 bg-art-teal/20 rounded-full flex items-center justify-center mb-6">
                <Palette className="h-8 w-8 text-art-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Browse or List</h3>
              <p className="text-gray-400">
                Browse available auctions as a buyer or list your artwork as a seller. Set your minimum bid and auction duration.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-art-purple/20 flex flex-col items-center text-center transition-all hover:border-art-purple/50">
              <div className="h-16 w-16 bg-art-purple/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-art-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Bid & Win</h3>
              <p className="text-gray-400">
                Place bids on your favorite pieces or watch your listings receive offers. When an auction ends, connect with your buyer/seller.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-art-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ART Auction?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform is built with state-of-the-art technology to provide a secure and enjoyable auction experience.
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
              <h3 className="text-xl font-semibold mb-2">Real-Time Bidding</h3>
              <p className="text-gray-400">
                Watch bid updates happen instantly with our WebSocket technology.
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
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-gray-400">
                Access a curated collection of high-quality artwork.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-art-purple/30 to-art-teal/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Bidding?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of art enthusiasts already using ART Auction to buy and sell premium artwork.
          </p>
          <Link to="/signup">
            <Button className="bg-art-purple hover:bg-art-purple-dark text-white text-lg px-8 py-6">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-art-dark-blue py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Palette className="h-6 w-6 text-art-purple" />
              <span className="font-bold text-xl art-gradient-text">ART AUCTION</span>
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
    </div>
  );
};

export default Landing;
