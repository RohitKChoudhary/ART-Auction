
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    
    if (!name || !email || !password || !confirmPassword) {
      setSignupError("All fields are required");
      return;
    }
    
    if (!validatePassword()) return;
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      // Navigation will be handled by the useEffect above if auto-login happens
    } catch (error: any) {
      console.error("Signup error:", error);
      setSignupError(
        error.message || 
        "Failed to create account. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-art-dark">
        <Loader2 className="h-12 w-12 animate-spin text-art-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-art-dark p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold art-gradient-text mb-2">ART AUCTION</h1>
        <p className="text-gray-400">Create an account to start bidding on premium artworks</p>
      </div>

      <Card className="w-full max-w-md bg-art-dark-blue border-art-purple/30">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Sign Up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {signupError && (
              <Alert variant="destructive">
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="art-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="art-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="art-input"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="art-input"
                required
                disabled={isSubmitting}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit"
              className="w-full bg-art-purple hover:bg-art-purple-dark text-white"
              disabled={isSubmitting || !name || !email || !password || !confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-art-purple hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-12 text-gray-400 text-xs text-center">
        <p>© 2025 ART Auction. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Signup;
