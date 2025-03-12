import React, { useState } from "react";
import { ArrowLeft, Clock, Calendar, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addHours } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import DialysisSessionTimer from "../calendar/DialysisSessionTimer";
import AnalogSessionTimer from "../calendar/AnalogSessionTimer";
import ActiveSessionCard from "../calendar/ActiveSessionCard";

interface DialysisSessionPageProps {
  onBack?: () => void;
}

const DialysisSessionPage = ({
  onBack = () => {},
}: DialysisSessionPageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Mock session data
  const sessionData = {
    patientName: "John Doe",
    startTime: new Date(new Date().setHours(new Date().getHours() - 2)), // 2 hours ago
    endTime: new Date(new Date().setHours(new Date().getHours() + 2)), // 2 hours from now
    location: "Memorial Dialysis Center",
    assistantName: "Jane Doe",
    assistantPhone: "(555) 987-6543",
    assistantEmail: "jane.doe@example.com",
  };

  // Mock past sessions
  const pastSessions = [
    {
      id: "1",
      date: addHours(new Date(), -48), // 2 days ago
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      location: "Memorial Dialysis Center",
      duration: "4 hours",
      assistantNotified: true,
    },
    {
      id: "2",
      date: addHours(new Date(), -96), // 4 days ago
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      location: "Memorial Dialysis Center",
      duration: "4 hours",
      assistantNotified: true,
    },
    {
      id: "3",
      date: addHours(new Date(), -144), // 6 days ago
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      location: "Memorial Dialysis Center",
      duration: "4 hours",
      assistantNotified: false,
    },
  ];

  const handleStartSession = () => {
    setHasActiveSession(true);
  };

  const handleEndSession = () => {
    setHasActiveSession(false);
  };

  const handleViewDetails = () => {
    setShowSessionDetails(true);
    setActiveTab("current");
  };

  const handleNotifyAssistant = () => {
    // This would trigger the notification in a real app
    console.log("Notifying assistant...");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Dialysis Session Tracker</h1>
          </div>

          {hasActiveSession && !showSessionDetails && (
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              View Active Session
            </Button>
          )}
        </div>

        {/* Main content */}
        {showSessionDetails || !hasActiveSession ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="current">
                <Clock className="mr-2 h-4 w-4" />
                Current Session
              </TabsTrigger>
              <TabsTrigger value="history">
                <Calendar className="mr-2 h-4 w-4" />
                Session History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <AnalogSessionTimer
                    isActive={hasActiveSession}
                    onSessionComplete={handleEndSession}
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Assistant Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Your assistant will automatically receive notifications
                      about your dialysis session:
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50">
                        <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            30 Minutes Before End
                          </p>
                          <p className="text-xs text-blue-700">
                            Your assistant will be notified 30 minutes before
                            your session ends so they can be ready for pickup.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 rounded-md bg-green-50">
                        <Bell className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Manual Notification
                          </p>
                          <p className="text-xs text-green-700">
                            You can also manually send a notification to your
                            assistant at any time during your session.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">
                        Current Assistant
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {sessionData.assistantName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sessionData.assistantPhone}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSessionDetails(true)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <h2 className="text-lg font-medium mb-4">Recent Sessions</h2>

              {pastSessions.map((session) => (
                <Card key={session.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {format(session.date, "EEEE, MMMM d, yyyy")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {session.startTime} - {session.endTime} (
                          {session.duration})
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.location}
                        </p>
                      </div>
                      <div
                        className={
                          session.assistantNotified
                            ? "bg-green-100 text-green-800 border border-green-200 rounded-full px-2 py-1 text-xs font-medium"
                            : "bg-gray-100 text-gray-800 border border-gray-200 rounded-full px-2 py-1 text-xs font-medium"
                        }
                      >
                        {session.assistantNotified
                          ? "Assistant Notified"
                          : "No Notification"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <ActiveSessionCard
              patientName={sessionData.patientName}
              startTime={sessionData.startTime}
              endTime={sessionData.endTime}
              location={sessionData.location}
              assistantName={sessionData.assistantName}
              onViewDetails={handleViewDetails}
              onNotifyAssistant={handleNotifyAssistant}
            />

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Regular Dialysis Session</h3>
                      <p className="text-sm text-gray-500">
                        {format(addHours(new Date(), 48), "EEEE, MMMM d")} •
                        9:00 AM - 1:00 PM
                      </p>
                      <p className="text-sm text-gray-500">
                        Memorial Dialysis Center
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Nephrology Checkup</h3>
                      <p className="text-sm text-gray-500">
                        {format(addHours(new Date(), 72), "EEEE, MMMM d")} •
                        10:30 AM
                      </p>
                      <p className="text-sm text-gray-500">
                        Kidney Care Specialists
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialysisSessionPage;
