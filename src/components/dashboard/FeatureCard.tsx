import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Activity,
  Pill,
  Calendar,
  Apple,
  User,
} from "lucide-react";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  metrics?: {
    label: string;
    value: string | number;
    status?: "normal" | "warning" | "critical";
  }[];
  actionText?: string;
  onClick?: () => void;
}

const FeatureCard = ({
  icon = <Activity className="h-8 w-8 text-primary" />,
  title = "Feature Title",
  description = "Brief description of this feature and its functionality for patients.",
  metrics = [
    { label: "Status", value: "Good", status: "normal" },
    { label: "Last Updated", value: "Today" },
  ],
  actionText = "View Details",
  onClick = () => console.log("Card clicked"),
}: FeatureCardProps) => {
  // Function to determine badge color based on status
  const getBadgeVariant = (status?: string) => {
    switch (status) {
      case "warning":
        return "warning";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Map of icons for default state if none provided
  const getDefaultIcon = (title: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Self-Monitoring": <Activity className="h-8 w-8 text-primary" />,
      "Medication Management": <Pill className="h-8 w-8 text-primary" />,
      "Dialysis Calendar": <Calendar className="h-8 w-8 text-primary" />,
      "Nutrition Tracker": <Apple className="h-8 w-8 text-primary" />,
      "Patient Profile": <User className="h-8 w-8 text-primary" />,
    };

    return iconMap[title] || <Activity className="h-8 w-8 text-primary" />;
  };

  const displayIcon = icon || getDefaultIcon(title);

  return (
    <Card className="w-80 h-[380px] flex flex-col transition-all duration-300 hover:shadow-lg bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-full bg-primary/10">{displayIcon}</div>
          {metrics && metrics.length > 0 && (
            <Badge
              variant={getBadgeVariant(metrics[0].status)}
              className="ml-auto"
            >
              {metrics[0].label}: {metrics[0].value}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-4">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-2">
          {metrics &&
            metrics.slice(1).map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <Badge variant={getBadgeVariant(metric.status)}>
                  {metric.value}
                </Badge>
              </div>
            ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={onClick}
          className="w-full justify-between"
          variant="outline"
        >
          {actionText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
