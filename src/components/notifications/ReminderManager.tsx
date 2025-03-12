import React, { useState, useEffect } from "react";
import { Bell, Calendar, Clock, Pill, Check, X } from "lucide-react";
import { format, addHours } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface Reminder {
  id: string;
  type: "medication" | "appointment";
  title: string;
  time: Date;
  details: string;
  status: "pending" | "sent" | "dismissed";
}

interface ReminderManagerProps {
  reminders?: Reminder[];
  onDismiss?: (id: string) => void;
  onSendNow?: (id: string) => void;
}

const ReminderManager = ({
  reminders = [
    {
      id: "1",
      type: "medication",
      title: "Take Lisinopril",
      time: addHours(new Date(), 1),
      details: "10mg, 1 tablet",
      status: "pending",
    },
    {
      id: "2",
      type: "medication",
      title: "Take Calcium Acetate",
      time: addHours(new Date(), 4),
      details: "667mg, 2 tablets with meal",
      status: "pending",
    },
    {
      id: "3",
      type: "appointment",
      title: "Dialysis Session",
      time: addHours(new Date(), 24),
      details: "Memorial Dialysis Center, 2:00 PM",
      status: "pending",
    },
    {
      id: "4",
      type: "appointment",
      title: "Nephrology Checkup",
      time: addHours(new Date(), 72),
      details: "Dr. Sarah Johnson, Kidney Care Specialists",
      status: "pending",
    },
  ],
  onDismiss = () => {},
  onSendNow = () => {},
}: ReminderManagerProps) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [localReminders, setLocalReminders] = useState<Reminder[]>(reminders);

  // Filter reminders based on active tab
  const filteredReminders = localReminders.filter((reminder) => {
    if (activeTab === "upcoming") {
      return reminder.status === "pending";
    } else if (activeTab === "medication") {
      return reminder.type === "medication";
    } else if (activeTab === "appointment") {
      return reminder.type === "appointment";
    }
    return true; // all tab
  });

  const handleDismiss = (id: string) => {
    setLocalReminders(
      localReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: "dismissed" as const }
          : reminder,
      ),
    );
    onDismiss(id);
    toast({
      title: "Reminder dismissed",
      description: "This reminder has been dismissed.",
    });
  };

  const handleSendNow = (id: string) => {
    setLocalReminders(
      localReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: "sent" as const }
          : reminder,
      ),
    );
    onSendNow(id);
    toast({
      title: "Reminder sent",
      description: "The reminder notification has been sent.",
    });
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeDisplay = (time: Date) => {
    const now = new Date();
    const diffHours = Math.round(
      (time.getTime() - now.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 1) {
      return "Less than an hour";
    } else if (diffHours < 24) {
      return `In ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `In ${days} day${days > 1 ? "s" : ""}`;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Reminders & Notifications
            </CardTitle>
            <CardDescription>
              Manage your medication and appointment reminders
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {filteredReminders.length} Upcoming
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="medication">Medication</TabsTrigger>
            <TabsTrigger value="appointment">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredReminders.length > 0 ? (
              filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getReminderIcon(reminder.type)}
                      <div>
                        <h3 className="font-medium">{reminder.title}</h3>
                        <p className="text-sm text-gray-600">
                          {reminder.details}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        reminder.type === "medication"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {reminder.type === "medication"
                        ? "Medication"
                        : "Appointment"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {getTimeDisplay(reminder.time)} (
                        {format(reminder.time, "MMM d, h:mm a")})
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismiss(reminder.id)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" /> Dismiss
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendNow(reminder.id)}
                        className="h-8 px-2"
                      >
                        <Bell className="h-4 w-4 mr-1" /> Send Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">
                  No {activeTab} reminders
                </h3>
                <p className="text-xs">
                  {activeTab === "upcoming"
                    ? "You have no upcoming reminders at this time."
                    : activeTab === "medication"
                      ? "No medication reminders are scheduled."
                      : "No appointment reminders are scheduled."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReminderManager;
