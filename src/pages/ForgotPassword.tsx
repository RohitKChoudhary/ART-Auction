
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    await forgotPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-art-dark p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold art-gradient-text mb-2">ART AUCTION</h1>
        <p className="text-gray-400">Recover your account access</p>
      </div>

      <Card className="w-full max-w-md bg-art-dark-blue border-art-purple/30">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit"
                className="w-full bg-art-purple hover:bg-art-purple-dark text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                <Link to="/login" className="text-art-purple hover:underline">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6 py-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Email Sent!</h3>
              <p className="text-gray-400">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
            </div>
            <Button 
              className="w-full bg-art-purple hover:bg-art-purple-dark text-white"
              asChild
            >
              <Link to="/login">Back to Login</Link>
            </Button>
          </CardContent>
        )}
      </Card>

      <div className="mt-12 text-gray-400 text-xs text-center">
        <p>© 2025 ART Auction. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
