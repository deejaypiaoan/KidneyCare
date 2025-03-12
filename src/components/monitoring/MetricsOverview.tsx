import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Activity,
  Droplets,
  Weight,
  Heart,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon?: React.ReactNode;
  timestamp?: string;
}

const MetricCard = ({
  title = "Blood Pressure",
  value = "120/80",
  unit = "mmHg",
  status = "normal",
  icon = <Heart className="h-5 w-5" />,
  timestamp = "Today, 8:30 AM",
}: MetricCardProps) => {
  const statusColors = {
    normal: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    normal: <CheckCircle className="h-4 w-4 text-green-600" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    critical: <AlertCircle className="h-4 w-4 text-red-600" />,
  };

  return (
    <Card className="overflow-hidden border-2 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">{icon}</div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`${statusColors[status]} px-2 py-0.5 text-xs flex items-center gap-1`}
          >
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{value}</span>
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {timestamp}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
  metrics?: {
    bloodPressure: {
      value: string;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
    heartRate: {
      value: number;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
    oxygenLevel: {
      value: number;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
    weight: {
      value: number;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
    fluidIntake: {
      value: number;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
    temperature: {
      value: number;
      status: "normal" | "warning" | "critical";
      timestamp: string;
    };
  };
}

const MetricsOverview = ({
  metrics = {
    bloodPressure: {
      value: "120/80",
      status: "normal",
      timestamp: "Today, 8:30 AM",
    },
    heartRate: { value: 72, status: "normal", timestamp: "Today, 8:30 AM" },
    oxygenLevel: { value: 98, status: "normal", timestamp: "Today, 8:30 AM" },
    weight: { value: 70.5, status: "warning", timestamp: "Today, 7:15 AM" },
    fluidIntake: { value: 1.2, status: "warning", timestamp: "Today, 2:00 PM" },
    temperature: { value: 37.2, status: "normal", timestamp: "Today, 8:30 AM" },
  },
}: MetricsOverviewProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Current Health Metrics</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your latest health measurements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Blood Pressure"
          value={metrics.bloodPressure.value}
          unit="mmHg"
          status={metrics.bloodPressure.status}
          icon={<Heart className="h-5 w-5" />}
          timestamp={metrics.bloodPressure.timestamp}
        />

        <MetricCard
          title="Heart Rate"
          value={metrics.heartRate.value}
          unit="bpm"
          status={metrics.heartRate.status}
          icon={<Activity className="h-5 w-5" />}
          timestamp={metrics.heartRate.timestamp}
        />

        <MetricCard
          title="Oxygen Level"
          value={metrics.oxygenLevel.value}
          unit="%"
          status={metrics.oxygenLevel.status}
          icon={<Activity className="h-5 w-5" />}
          timestamp={metrics.oxygenLevel.timestamp}
        />

        <MetricCard
          title="Weight"
          value={metrics.weight.value}
          unit="kg"
          status={metrics.weight.status}
          icon={<Weight className="h-5 w-5" />}
          timestamp={metrics.weight.timestamp}
        />

        <MetricCard
          title="Fluid Intake"
          value={metrics.fluidIntake.value}
          unit="L"
          status={metrics.fluidIntake.status}
          icon={<Droplets className="h-5 w-5" />}
          timestamp={metrics.fluidIntake.timestamp}
        />

        <MetricCard
          title="Temperature"
          value={metrics.temperature.value}
          unit="°C"
          status={metrics.temperature.status}
          icon={<AlertCircle className="h-5 w-5" />}
          timestamp={metrics.temperature.timestamp}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
