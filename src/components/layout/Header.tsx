import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { logout, getCurrentUser } from "@/lib/auth";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onMenuToggle?: () => void;
}

const Header = ({
  userName = "",
  userAvatar = "",
  onSettingsClick = () => console.log("Settings clicked"),
  onLogoutClick = () => {},
  onMenuToggle = () => console.log("Menu toggled"),
}: HeaderProps) => {
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [displayName, setDisplayName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState(userAvatar);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const user = getCurrentUser();
    if (user) {
      setDisplayName(user.username);

      // Get profile data if available
      const profileStr = localStorage.getItem("patientProfile");
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setDisplayName(`${profile.firstName} ${profile.lastName}`);
        if (profile.profilePicture) {
          setAvatarUrl(profile.profilePicture);
        } else {
          setAvatarUrl(
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`,
          );
        }
      } else {
        setAvatarUrl(
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        );
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    onLogoutClick();
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center">
          <img
            src="vite.svg"
            alt="Dialysis Companion"
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold text-primary hidden md:block">
            Dialysis Patient Companion
          </h1>
          <h1 className="text-xl font-bold text-primary md:hidden">DPC</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => (window.location.href = "/notifications")}
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-auto py-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden md:inline-block">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onSettingsClick}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSettingsClick}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
