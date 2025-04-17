
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the landing page
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-art-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold art-gradient-text mb-4">ART AUCTION</h1>
        <p className="text-xl text-gray-400">Redirecting to homepage...</p>
      </div>
    </div>
  );
};

export default Index;
