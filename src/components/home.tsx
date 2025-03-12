import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import DashboardGrid from "./dashboard/DashboardGrid";
import { getCurrentUser } from "@/lib/auth";

const Home = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Get user data
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Try to load patient profile from localStorage
    const savedProfile = window.localStorage.getItem("patientProfile");
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setFullName(`${profileData.firstName} ${profileData.lastName}`);
      if (profileData.profilePicture) {
        setAvatarUrl(profileData.profilePicture);
      } else {
        setAvatarUrl(
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.firstName}`,
        );
      }
    } else {
      setFullName(user.username);
      setAvatarUrl(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      );
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        userName={fullName}
        userAvatar={avatarUrl}
        onSettingsClick={() => navigate("/profile")}
        onLogoutClick={() => navigate("/auth")}
        onMenuToggle={() => console.log("Menu toggled")}
      />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            Welcome, {fullName.split(" ")[0]}
          </h1>

          <div className="mb-4">
            <p className="text-gray-600">
              Track your health metrics, manage medications, and stay on top of
              your dialysis treatment plan.
            </p>
          </div>

          <DashboardGrid />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-sm text-gray-500">
          <p>
            Dialysis Patient Companion App &copy; {new Date().getFullYear()}
          </p>
          <p className="mt-1">Contact support: support@dialysiscompanion.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
