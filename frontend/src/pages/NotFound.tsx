
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-7xl font-bold text-muted-foreground">404</h1>
        <p className="text-xl mt-4 mb-8">Oops! Page not found</p>
        <Button asChild>
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </>
  );
};

export default NotFound;
