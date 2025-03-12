import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  AlertCircle,
  Calendar,
  Clock,
  Heart,
  Pill,
  TrendingUp,
  Bell,
} from "lucide-react";

interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: React.ReactNode;
}

interface Appointment {
  date: string;
  time: string;
  type: string;
  location: string;
}

interface MedicationReminder {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface HealthSummaryProps {
  metrics?: HealthMetric[];
  appointments?: Appointment[];
  medicationReminders?: MedicationReminder[];
}

const HealthSummary = ({
  metrics = [
    {
      name: "Blood Pressure",
      value: "130/85",
      unit: "mmHg",
      status: "normal",
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
      name: "Oxygen Level",
      value: "96",
      unit: "%",
      status: "normal",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Weight",
      value: "72.5",
      unit: "kg",
      status: "warning",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    },
  ],
  appointments = [
    {
      date: "Today",
      time: "2:00 PM",
      type: "Dialysis Session",
      location: "Memorial Clinic",
    },
  ],
  medicationReminders = [
    {
      name: "Epoetin Alfa",
      dosage: "100 mcg",
      time: "8:00 AM",
      taken: true,
    },
    {
      name: "Phosphate Binder",
      dosage: "800 mg",
      time: "12:00 PM",
      taken: false,
    },
  ],
}: HealthSummaryProps) => {
  // Try to load medical data from localStorage
  const savedMedicalData = window.localStorage.getItem("medicalData");
  const medicalInfo = savedMedicalData ? JSON.parse(savedMedicalData) : null;

  // Update blood type if available from saved data
  if (medicalInfo && medicalInfo.bloodType) {
    metrics = metrics.map((metric) => {
      if (metric.name === "Blood Type") {
        return { ...metric, value: medicalInfo.bloodType };
      }
      return metric;
    });
  }
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Critical Health Metrics */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">
              Current Metrics
            </h3>
            <div className="space-y-2">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {metric.value} {metric.unit}
                    </span>
                    <Badge
                      variant={
                        metric.status === "normal"
                          ? "outline"
                          : metric.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                      className={`text-xs ${
                        metric.status === "normal"
                          ? "text-green-600 border-green-600"
                          : metric.status === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {metric.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">
              Upcoming Appointments
            </h3>
            {appointments.length > 0 ? (
              <div className="space-y-2">
                {appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {appointment.date}
                      </span>
                      <span className="text-gray-500">•</span>
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {appointment.time}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {appointment.type}
                    </div>
                    <div className="text-sm text-gray-600">
                      {appointment.location}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-gray-50 text-gray-500 text-center">
                No upcoming appointments
              </div>
            )}
          </div>

          {/* Medication Reminders */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">
              Medication Reminders
            </h3>
            {medicationReminders.length > 0 ? (
              <div className="space-y-2">
                {medicationReminders.map((medication, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{medication.name}</span>
                      </div>
                      <Badge
                        variant={medication.taken ? "outline" : "secondary"}
                        className={
                          medication.taken
                            ? "text-green-600 border-green-600"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {medication.taken ? "TAKEN" : "DUE"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{medication.dosage}</span>
                      <span className="text-gray-600">{medication.time}</span>
                    </div>
                    {!medication.taken && (
                      <div className="mt-2 text-xs text-blue-600 flex items-center">
                        <Bell className="h-3 w-3 mr-1" />
                        <span>SMS & Email reminder scheduled</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-gray-50 text-gray-500 text-center">
                No medication reminders
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;
