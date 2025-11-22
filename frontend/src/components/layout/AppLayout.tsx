import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Effect to redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar currentUser={user} />
      <div className="flex-1">  {/* Remove the md:ml-64 class */}
        <TopBar user={user} />
        <main className={cn("px-4 py-6 md:px-6 lg:px-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}