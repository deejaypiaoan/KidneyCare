import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Bell,
  AlertCircle,
  CheckCircle,
  User,
  Users,
  Edit,
} from "lucide-react";
import {
  format,
  addMinutes,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  sendEmailNotification,
  sendSMSNotification,
} from "@/lib/notifications";

interface Assistant {
  name: string;
  phone: string;
  email: string;
  notifyBySMS: boolean;
  notifyByEmail: boolean;
}

interface DialysisSessionTimerProps {
  sessionDuration?: number; // in minutes
  patientName?: string;
  dialysisCenter?: string;
  startTime?: Date;
  isActive?: boolean;
  assistant?: Assistant;
  onSessionComplete?: () => void;
}

const DialysisSessionTimer = ({
  sessionDuration = 240, // 4 hours default
  patientName = "John Doe",
  dialysisCenter = "Memorial Dialysis Center",
  startTime = new Date(),
  isActive = false,
  assistant = {
    name: "Jane Doe",
    phone: "(555) 987-6543",
    email: "jane.doe@example.com",
    notifyBySMS: true,
    notifyByEmail: true,
  },
  onSessionComplete = () => {},
}: DialysisSessionTimerProps) => {
  const [active, setActive] = useState(isActive);
  const [elapsed, setElapsed] = useState(0); // elapsed time in seconds
  const [sessionStart, setSessionStart] = useState<Date>(startTime);
  const [endTime, setEndTime] = useState<Date>(
    addMinutes(startTime, sessionDuration),
  );
  const [notificationSent, setNotificationSent] = useState(false);
  const [assistantNotified, setAssistantNotified] = useState(false);
  const [assistantInfo, setAssistantInfo] = useState<Assistant>(assistant);
  const [showAssistantForm, setShowAssistantForm] = useState(false);

  const timerRef = useRef<number | null>(null);
  const notificationTimeoutRef = useRef<number | null>(null);

  // Calculate total duration in seconds
  const totalDuration = sessionDuration * 60;

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate remaining time
  const remainingSeconds = Math.max(0, totalDuration - elapsed);
  const progress = Math.min(100, (elapsed / totalDuration) * 100);

  // Start or stop the timer
  const toggleTimer = () => {
    if (active) {
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = null;
      }
    } else {
      // Start the timer
      const now = new Date();
      setSessionStart(now);
      setEndTime(addMinutes(now, sessionDuration));
      setElapsed(0);
      setNotificationSent(false);
      setAssistantNotified(false);

      // Set up the timer
      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          const newElapsed = prev + 1;

          // Check if we need to send notification 30 minutes before end
          const remainingMins = (totalDuration - newElapsed) / 60;
          if (remainingMins <= 30 && !notificationSent) {
            sendEndNotifications();
            setNotificationSent(true);
          }

          // Check if session is complete
          if (newElapsed >= totalDuration) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            onSessionComplete();
            setActive(false);
          }

          return newElapsed;
        });
      }, 1000);
    }

    setActive(!active);
  };

  // Send notifications to assistant when session is about to end
  const sendEndNotifications = () => {
    const message = `DIALYSIS ALERT: ${patientName}'s dialysis session at ${dialysisCenter} will end in approximately 30 minutes (${format(endTime, "h:mm a")}). Please be ready for pickup.`;

    if (assistantInfo.notifyBySMS) {
      sendSMSNotification({
        to: assistantInfo.phone,
        message,
      });
    }

    if (assistantInfo.notifyByEmail) {
      sendEmailNotification({
        to: assistantInfo.email,
        subject: `Dialysis Session Ending Soon - ${patientName}`,
        message,
      });
    }

    toast({
      title: "Assistant Notified",
      description: `${assistantInfo.name} has been notified that your session will end soon.`,
    });

    setAssistantNotified(true);
  };

  // Manually send notification to assistant
  const notifyAssistantNow = () => {
    const remainingMins = Math.floor(remainingSeconds / 60);
    const message = `DIALYSIS ALERT: ${patientName}'s dialysis session at ${dialysisCenter} will end in approximately ${remainingMins} minutes (${format(endTime, "h:mm a")}). Please be ready for pickup.`;

    if (assistantInfo.notifyBySMS) {
      sendSMSNotification({
        to: assistantInfo.phone,
        message,
      });
    }

    if (assistantInfo.notifyByEmail) {
      sendEmailNotification({
        to: assistantInfo.email,
        subject: `Dialysis Session Update - ${patientName}`,
        message,
      });
    }

    toast({
      title: "Assistant Notified",
      description: `${assistantInfo.name} has been notified about your current session status.`,
    });

    setAssistantNotified(true);
  };

  // Update assistant information
  const handleAssistantInfoUpdate = () => {
    setShowAssistantForm(false);
    toast({
      title: "Assistant Information Updated",
      description: "Your assistant's contact information has been updated.",
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Dialysis Session Timer
            </CardTitle>
            <CardDescription>
              {active ? "Session in progress" : "Start your session timer"}
            </CardDescription>
          </div>
          <Badge
            variant={active ? "default" : "outline"}
            className={
              active ? "bg-green-100 text-green-800 border-green-200" : ""
            }
          >
            {active ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center py-6">
          <div className="text-4xl font-bold font-mono">
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {active ? (
              <>Session ends at {format(endTime, "h:mm a")}</>
            ) : (
              "Session duration: " + formatTime(totalDuration)
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{format(sessionStart, "h:mm a")}</span>
            <span>{format(endTime, "h:mm a")}</span>
          </div>
        </div>

        {/* Session Info */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Patient:</span>
            <span className="text-sm">{patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{dialysisCenter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Assistant:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{assistantInfo.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowAssistantForm(!showAssistantForm)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Assistant Form */}
        {showAssistantForm && (
          <div className="border rounded-md p-3 space-y-3 mt-2">
            <h4 className="text-sm font-medium">Assistant Information</h4>

            <div className="space-y-2">
              <Label htmlFor="assistantName">Name</Label>
              <Input
                id="assistantName"
                value={assistantInfo.name}
                onChange={(e) =>
                  setAssistantInfo({ ...assistantInfo, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistantPhone">Phone Number</Label>
              <Input
                id="assistantPhone"
                value={assistantInfo.phone}
                onChange={(e) =>
                  setAssistantInfo({ ...assistantInfo, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistantEmail">Email</Label>
              <Input
                id="assistantEmail"
                value={assistantInfo.email}
                onChange={(e) =>
                  setAssistantInfo({ ...assistantInfo, email: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifySMS" className="cursor-pointer">
                Notify by SMS
              </Label>
              <Switch
                id="notifySMS"
                checked={assistantInfo.notifyBySMS}
                onCheckedChange={(checked) =>
                  setAssistantInfo({ ...assistantInfo, notifyBySMS: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifyEmail" className="cursor-pointer">
                Notify by Email
              </Label>
              <Switch
                id="notifyEmail"
                checked={assistantInfo.notifyByEmail}
                onCheckedChange={(checked) =>
                  setAssistantInfo({ ...assistantInfo, notifyByEmail: checked })
                }
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssistantForm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAssistantInfoUpdate}>
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Notification Status */}
        {active && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${assistantNotified ? "bg-green-50" : "bg-blue-50"}`}
          >
            {assistantNotified ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Assistant Notified
                  </p>
                  <p className="text-xs text-green-700">
                    {assistantInfo.name} has been notified about your session.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Automatic Notification
                  </p>
                  <p className="text-xs text-blue-700">
                    Your assistant will be notified 30 minutes before the end of
                    your session.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button
          variant={active ? "destructive" : "default"}
          onClick={toggleTimer}
        >
          {active ? "End Session" : "Start Session"}
        </Button>

        {active && (
          <Button
            variant="outline"
            onClick={notifyAssistantNow}
            disabled={assistantNotified}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notify Assistant Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DialysisSessionTimer;
