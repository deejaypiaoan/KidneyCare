import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { AlertCircle, Info } from "lucide-react";

interface NutrientData {
  name: string;
  current: number;
  limit: number;
  unit: string;
  color: string;
}

interface DailySummaryProps {
  calories?: { current: number; limit: number };
  nutrients?: NutrientData[];
  date?: Date;
}

const DailySummary = ({
  calories = { current: 1450, limit: 2000 },
  nutrients = [
    {
      name: "Protein",
      current: 65,
      limit: 80,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Sodium",
      current: 1800,
      limit: 2300,
      unit: "mg",
      color: "bg-red-500",
    },
    {
      name: "Potassium",
      current: 1500,
      limit: 2500,
      unit: "mg",
      color: "bg-orange-500",
    },
    {
      name: "Phosphorus",
      current: 700,
      limit: 1000,
      unit: "mg",
      color: "bg-purple-500",
    },
    {
      name: "Fluid",
      current: 1.2,
      limit: 1.5,
      unit: "L",
      color: "bg-cyan-500",
    },
  ],
  date = new Date(),
}: DailySummaryProps) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const caloriePercentage = Math.min(
    Math.round((calories.current / calories.limit) * 100),
    100,
  );

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Daily Nutrition Summary
          </CardTitle>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Calories Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Calories</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {calories.current} / {calories.limit} kcal
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {caloriePercentage}%
                </span>
              </div>
            </div>
            <Progress value={caloriePercentage} className="h-2" />
          </div>

          {/* Nutrients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nutrients.map((nutrient, index) => {
              const percentage = Math.min(
                Math.round((nutrient.current / nutrient.limit) * 100),
                100,
              );
              const isNearLimit = percentage >= 80 && percentage < 100;
              const isOverLimit = percentage >= 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium">{nutrient.name}</h4>
                      {isNearLimit && (
                        <Info size={16} className="text-amber-500" />
                      )}
                      {isOverLimit && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                    <span className="text-sm">
                      {nutrient.current} / {nutrient.limit} {nutrient.unit}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${isOverLimit ? "bg-red-100" : ""}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 {nutrient.unit}</span>
                    <span>
                      {nutrient.limit} {nutrient.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md text-sm">
            <Info size={18} className="text-blue-500 mt-0.5" />
            <p className="text-blue-700">
              Remember to stay within your recommended daily limits for optimal
              kidney health. Consult with your dietitian if you have questions
              about your nutritional goals.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
