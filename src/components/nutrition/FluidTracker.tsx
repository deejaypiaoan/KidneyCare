import React, { useState } from "react";
import { Droplet, Plus, Minus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FluidEntry {
  id: string;
  amount: number;
  time: string;
  type: string;
}

interface FluidTrackerProps {
  dailyLimit?: number;
  currentIntake?: number;
  fluidEntries?: FluidEntry[];
}

const FluidTracker = ({
  dailyLimit = 1500, // Default daily limit in ml
  currentIntake = 850, // Default current intake in ml
  fluidEntries = [
    { id: "1", amount: 250, time: "08:30", type: "Water" },
    { id: "2", amount: 150, time: "10:15", type: "Coffee" },
    { id: "3", amount: 200, time: "12:45", type: "Tea" },
    { id: "4", amount: 250, time: "15:30", type: "Water" },
  ],
}: FluidTrackerProps) => {
  const [intake, setIntake] = useState(currentIntake);
  const [entries, setEntries] = useState(fluidEntries);
  const [newAmount, setNewAmount] = useState(200);
  const [fluidType, setFluidType] = useState("Water");

  const percentageFilled = Math.min(
    Math.round((intake / dailyLimit) * 100),
    100,
  );
  const remainingFluid = Math.max(dailyLimit - intake, 0);

  const handleAddFluid = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newEntry: FluidEntry = {
      id: Date.now().toString(),
      amount: newAmount,
      time: timeString,
      type: fluidType,
    };

    setEntries([...entries, newEntry]);
    setIntake(intake + newAmount);
    setNewAmount(200); // Reset to default amount
  };

  const handleIncrementAmount = () => {
    setNewAmount((prev) => prev + 50);
  };

  const handleDecrementAmount = () => {
    setNewAmount((prev) => Math.max(prev - 50, 0));
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-blue-600">
          <Droplet className="mr-2 h-5 w-5" />
          Fluid Tracker
        </CardTitle>
        <CardDescription>Monitor your daily fluid intake</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fluid Progress Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{intake} ml</span>
            <span>{dailyLimit} ml</span>
          </div>
          <Progress value={percentageFilled} className="h-3" />
          <p className="text-center text-sm font-medium">
            {remainingFluid} ml remaining
          </p>
        </div>

        {/* Fluid Entry Form */}
        <div className="space-y-3 pt-4">
          <h4 className="text-sm font-medium">Add Fluid Intake</h4>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrementAmount}
              disabled={newAmount <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="text-center"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrementAmount}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <select
            value={fluidType}
            onChange={(e) => setFluidType(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Water">Water</option>
            <option value="Coffee">Coffee</option>
            <option value="Tea">Tea</option>
            <option value="Juice">Juice</option>
            <option value="Soda">Soda</option>
            <option value="Other">Other</option>
          </select>

          <Button
            onClick={handleAddFluid}
            className="w-full"
            disabled={newAmount <= 0}
          >
            Add Fluid
          </Button>
        </div>

        {/* Recent Entries */}
        <div className="pt-4">
          <h4 className="mb-2 text-sm font-medium">Recent Entries</h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {entries
              .slice()
              .reverse()
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <div>
                    <span className="font-medium">{entry.type}</span>
                    <span className="text-gray-500 ml-2">{entry.time}</span>
                  </div>
                  <span>{entry.amount} ml</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-gray-500">
          Recommended: Stay within your daily fluid limit
        </div>
      </CardFooter>
    </Card>
  );
};

export default FluidTracker;
