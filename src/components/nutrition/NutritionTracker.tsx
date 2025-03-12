import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Calendar, Plus, ArrowLeft } from "lucide-react";

import DailySummary from "./DailySummary";
import FoodEntryForm from "./FoodEntryForm";
import FluidTracker from "./FluidTracker";

interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  sodium: number;
  potassium: number;
  phosphorus: number;
  fluid: number;
}

interface MealEntry {
  id: string;
  mealType: string;
  time: string;
  foods: FoodItem[];
}

interface NutritionTrackerProps {
  dailyLimit?: {
    calories: number;
    protein: number;
    sodium: number;
    potassium: number;
    phosphorus: number;
    fluid: number;
  };
  meals?: MealEntry[];
  date?: Date;
}

const NutritionTracker = ({
  dailyLimit = {
    calories: 2000,
    protein: 80,
    sodium: 2300,
    potassium: 2500,
    phosphorus: 1000,
    fluid: 1500,
  },
  meals = [
    {
      id: "1",
      mealType: "Breakfast",
      time: "08:00",
      foods: [
        {
          id: "101",
          name: "Oatmeal with Berries",
          servingSize: "1 cup",
          calories: 220,
          protein: 6,
          sodium: 10,
          potassium: 150,
          phosphorus: 180,
          fluid: 0.2,
        },
        {
          id: "102",
          name: "Egg White Omelet",
          servingSize: "1 serving",
          calories: 180,
          protein: 15,
          sodium: 120,
          potassium: 180,
          phosphorus: 100,
          fluid: 0,
        },
      ],
    },
    {
      id: "2",
      mealType: "Lunch",
      time: "12:30",
      foods: [
        {
          id: "201",
          name: "Grilled Chicken Salad",
          servingSize: "1 bowl",
          calories: 350,
          protein: 30,
          sodium: 320,
          potassium: 450,
          phosphorus: 220,
          fluid: 0.3,
        },
      ],
    },
  ],
  date = new Date(),
}: NutritionTrackerProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [currentMeals, setCurrentMeals] = useState<MealEntry[]>(meals);
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");

  // Calculate daily totals from all meals
  const dailyTotals = currentMeals.reduce(
    (totals, meal) => {
      meal.foods.forEach((food) => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.sodium += food.sodium;
        totals.potassium += food.potassium;
        totals.phosphorus += food.phosphorus;
        totals.fluid += food.fluid;
      });
      return totals;
    },
    {
      calories: 0,
      protein: 0,
      sodium: 0,
      potassium: 0,
      phosphorus: 0,
      fluid: 0,
    },
  );

  // Format nutrients for DailySummary component
  const nutrients = [
    {
      name: "Protein",
      current: dailyTotals.protein,
      limit: dailyLimit.protein,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Sodium",
      current: dailyTotals.sodium,
      limit: dailyLimit.sodium,
      unit: "mg",
      color: "bg-red-500",
    },
    {
      name: "Potassium",
      current: dailyTotals.potassium,
      limit: dailyLimit.potassium,
      unit: "mg",
      color: "bg-orange-500",
    },
    {
      name: "Phosphorus",
      current: dailyTotals.phosphorus,
      limit: dailyLimit.phosphorus,
      unit: "mg",
      color: "bg-purple-500",
    },
  ];

  const handleAddFood = (food: FoodItem) => {
    // Find the selected meal or create a new one
    const mealIndex = currentMeals.findIndex(
      (meal) => meal.mealType === selectedMealType,
    );

    if (mealIndex >= 0) {
      // Add to existing meal
      const updatedMeals = [...currentMeals];
      updatedMeals[mealIndex].foods.push(food);
      setCurrentMeals(updatedMeals);
    } else {
      // Create new meal
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const newMeal: MealEntry = {
        id: Date.now().toString(),
        mealType: selectedMealType,
        time: timeString,
        foods: [food],
      };

      setCurrentMeals([...currentMeals, newMeal]);
    }

    // Switch to summary tab after adding food
    setActiveTab("summary");
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Nutrition Tracker</h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Apple className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-lg font-medium">
            Track your nutrition and fluid intake
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center"
            onClick={() => setActiveTab("add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Food
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="add">Add Food</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <DailySummary
            calories={{
              current: dailyTotals.calories,
              limit: dailyLimit.calories,
            }}
            nutrients={nutrients}
            date={date}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FluidTracker
              dailyLimit={dailyLimit.fluid}
              currentIntake={Math.round(dailyTotals.fluid * 1000)} // Convert to ml
            />

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Nutrition Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">
                    Phosphorus Management
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Limit phosphorus-rich foods like dairy, nuts, and processed
                    foods. Choose fresh fruits and vegetables instead.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-800">
                    Protein Balance
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Maintain adequate protein intake while avoiding excess.
                    Focus on high-quality protein sources like egg whites and
                    lean poultry.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-md">
                  <h3 className="font-medium text-amber-800">Sodium Control</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Reduce salt intake by avoiding processed foods, canned
                    soups, and fast food. Use herbs and spices for flavor
                    instead.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          {currentMeals.length > 0 ? (
            currentMeals.map((meal) => (
              <Card key={meal.id} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">
                      {meal.mealType}
                    </CardTitle>
                    <span className="text-sm text-gray-500">{meal.time}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meal.foods.map((food) => (
                      <div key={food.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{food.name}</h4>
                            <p className="text-sm text-gray-500">
                              {food.servingSize}
                            </p>
                          </div>
                          <span className="text-sm font-medium">
                            {food.calories} cal
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>Protein: {food.protein}g</div>
                          <div>Sodium: {food.sodium}mg</div>
                          <div>Potassium: {food.potassium}mg</div>
                          <div>Phosphorus: {food.phosphorus}mg</div>
                          <div>Fluid: {food.fluid}L</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Apple className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No meals recorded for today</p>
              <Button
                variant="link"
                onClick={() => setActiveTab("add")}
                className="mt-2"
              >
                Add your first meal
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Meal Type
            </label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div className="flex justify-center">
            <FoodEntryForm onAddFood={handleAddFood} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionTracker;
