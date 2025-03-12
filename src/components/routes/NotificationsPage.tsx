import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import NotificationSettings from "../notifications/NotificationSettings";
import ReminderManager from "../notifications/ReminderManager";

const NotificationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Notifications & Reminders</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6">
          <ReminderManager />
          <NotificationSettings
            defaultValues={{
              email: "john.doe@example.com",
              phone: "(555) 123-4567",
              enableEmailNotifications: true,
              enableSMSNotifications: true,
              medicationReminders: true,
              appointmentReminders: true,
              reminderTime: "1",
              advanceNotice: "24",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
