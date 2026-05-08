import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useGetCurrentUser, useLogout, User } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading, refetch, isError } = useGetCurrentUser({
    query: {
      retry: false,
    }
  });

  const logoutMutation = useLogout();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
        setLocation("/login");
      },
      onError: (err) => {
        toast({
          title: "Logout failed",
          description: err.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/register", "/library", "/scholars", "/reader", "/forgot-password", "/pending-verification"];
    const isPublic = publicRoutes.includes(location) || location.startsWith("/ulema") || location.startsWith("/lead");
    if (!isLoading && isError && !isPublic) {
      setLocation("/login");
    }
  }, [isLoading, isError, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, logout: handleLogout, refetchUser: refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
