import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { User, Lock, LogIn } from "lucide-react";

const DirectLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use direct login with hardcoded admin credentials for now
      if (username === "admin" && password === "password") {
        // Admin login successful
        const adminUser = {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
        };

        // Store admin in localStorage
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("userRole", "admin");

        // Show success message
        alert("Admin login successful! Redirecting...");

        // Redirect to admin dashboard
        navigate("/admin");
        return;
      }

      // For non-admin users, try to use localStorage as fallback
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );

      // Try to find user by username or patientId
      let user = existingUsers.find(
        (u: any) => u.username === username && u.password === password,
      );

      // If not found, try by patientId
      if (!user) {
        user = existingUsers.find(
          (u: any) => u.patientId === username && u.password === password,
        );
      }

      if (user) {
        // User found in localStorage
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", user.role);

        // Show success message
        alert("Login successful! Redirecting...");

        // Redirect based on user role
        if (user.role === "patient") {
          navigate("/");
        } else {
          navigate("/admin");
        }
        return;
      }

      // If we get here, login failed
      setError("Invalid credentials");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Failed to connect to the server. Please try again. Error: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Direct Database Login
        </CardTitle>
        <CardDescription className="text-center">
          Login to the database (fallback to local storage)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Currently using local storage as fallback
        </p>
      </CardFooter>
    </Card>
  );
};

export default DirectLoginForm;
