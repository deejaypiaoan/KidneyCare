import React from "react";
import { Clock, Calendar, MapPin, User, AlertCircle } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ActiveSessionCardProps {
  patientName?: string;
  startTime?: Date;
  endTime?: Date;
  location?: string;
  assistantName?: string;
  onViewDetails?: () => void;
  onNotifyAssistant?: () => void;
}

const ActiveSessionCard = ({
  patientName = "John Doe",
  startTime = new Date(new Date().setHours(new Date().getHours() - 2)), // 2 hours ago
  endTime = new Date(new Date().setHours(new Date().getHours() + 2)), // 2 hours from now
  location = "Memorial Dialysis Center",
  assistantName = "Jane Doe",
  onViewDetails = () => {},
  onNotifyAssistant = () => {},
}: ActiveSessionCardProps) => {
  // Calculate session progress
  const totalDuration = differenceInMinutes(endTime, startTime);
  const elapsed = differenceInMinutes(new Date(), startTime);
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  // Calculate remaining time
  const remainingMinutes = differenceInMinutes(endTime, new Date());
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  return (
    <Card className="w-full bg-white shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Active Dialysis Session
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            IN PROGRESS
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Patient</div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{patientName}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Location</div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{location}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Start Time</div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{format(startTime, "h:mm a")}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">End Time</div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{format(endTime, "h:mm a")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Session Progress</span>
            <span className="text-sm">
              {remainingHours > 0 ? `${remainingHours}h ` : ""}
              {remainingMins}m remaining
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Assistant Notification
            </p>
            <p className="text-xs text-amber-700">
              {assistantName} will be automatically notified 30 minutes before
              the end of the session.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={onViewDetails}>
          View Details
        </Button>
        <Button onClick={onNotifyAssistant}>Notify Assistant Now</Button>
      </CardFooter>
    </Card>
  );
};

export default ActiveSessionCard;
