import React from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import HealthSummary from "./HealthSummary";
import {
  Activity,
  Pill,
  Calendar as CalendarIcon,
  Apple,
  User,
  Clock,
} from "lucide-react";

interface DashboardGridProps {
  features?: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    metrics: {
      label: string;
      value: string | number;
      status?: "normal" | "warning" | "critical";
    }[];
    path: string;
  }[];
}

const DashboardGrid = ({
  features = [
    {
      id: "self-monitoring",
      title: "Self-Monitoring",
      description:
        "Track your vital signs, weight, and health metrics over time.",
      icon: <Activity className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Status", value: "Good", status: "normal" },
        { label: "Last Updated", value: "Today" },
        { label: "Blood Pressure", value: "130/85", status: "normal" },
      ],
      path: "/monitoring",
    },
    {
      id: "medication-management",
      title: "Medication Management",
      description: "Track medications, set reminders, and monitor adherence.",
      icon: <Pill className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Status", value: "Attention", status: "warning" },
        { label: "Due Today", value: "2 medications" },
        { label: "Adherence", value: "85%", status: "warning" },
      ],
      path: "/medication",
    },
    {
      id: "dialysis-calendar",
      title: "Dialysis Calendar",
      description: "Manage your dialysis appointments and treatment schedule.",
      icon: <CalendarIcon className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Next Session", value: "Today, 2:00 PM", status: "normal" },
        { label: "Location", value: "Memorial Clinic" },
        { label: "Total Sessions", value: "124" },
      ],
      path: "/calendar",
    },
    {
      id: "dialysis-session",
      title: "Session Tracker",
      description:
        "Track your dialysis session and notify your assistant when it's ending.",
      icon: <Clock className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Status", value: "Ready", status: "normal" },
        { label: "Duration", value: "4 hours" },
        { label: "Assistant", value: "Jane Doe" },
      ],
      path: "/session",
    },
    {
      id: "nutrition-tracker",
      title: "Nutrition Tracker",
      description: "Monitor your diet, fluid intake, and nutritional goals.",
      icon: <Apple className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Fluid Intake", value: "1.2/1.5L", status: "warning" },
        { label: "Sodium", value: "1800/2300mg", status: "normal" },
        { label: "Potassium", value: "1500/2500mg", status: "normal" },
      ],
      path: "/nutrition",
    },
    {
      id: "patient-profile",
      title: "Patient Profile",
      description:
        "View and update your medical information and care team contacts.",
      icon: <User className="h-8 w-8 text-primary" />,
      metrics: [
        { label: "Profile", value: "Complete", status: "normal" },
        { label: "Last Updated", value: "2 weeks ago" },
        { label: "Care Team", value: "3 members" },
      ],
      path: "/profile",
    },
  ],
}: DashboardGridProps) => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Health Summary Section */}
        <HealthSummary />

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              metrics={feature.metrics}
              actionText={`View ${feature.title}`}
              onClick={() => handleCardClick(feature.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
