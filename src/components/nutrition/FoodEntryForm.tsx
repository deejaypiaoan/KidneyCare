import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface FoodEntryFormProps {
  onAddFood?: (food: FoodItem) => void;
  onSearch?: (query: string) => void;
  searchResults?: FoodItem[];
}

const defaultSearchResults: FoodItem[] = [
  {
    id: "1",
    name: "Grilled Chicken Breast",
    servingSize: "3 oz",
    calories: 165,
    protein: 31,
    sodium: 74,
    potassium: 220,
    phosphorus: 196,
    fluid: 0,
  },
  {
    id: "2",
    name: "Steamed Broccoli",
    servingSize: "1 cup",
    calories: 55,
    protein: 3.7,
    sodium: 64,
    potassium: 457,
    phosphorus: 105,
    fluid: 0.5,
  },
  {
    id: "3",
    name: "Brown Rice",
    servingSize: "1/2 cup cooked",
    calories: 108,
    protein: 2.5,
    sodium: 5,
    potassium: 86,
    phosphorus: 77,
    fluid: 0,
  },
];

const FoodEntryForm = ({
  onAddFood = () => {},
  onSearch = () => {},
  searchResults = defaultSearchResults,
}: FoodEntryFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionSize, setPortionSize] = useState("1");

  const form = useForm({
    defaultValues: {
      foodName: "",
      servingSize: "",
      calories: 0,
      protein: 0,
      sodium: 0,
      potassium: 0,
      phosphorus: 0,
      fluid: 0,
    },
  });

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    form.reset({
      foodName: food.name,
      servingSize: food.servingSize,
      calories: food.calories,
      protein: food.protein,
      sodium: food.sodium,
      potassium: food.potassium,
      phosphorus: food.phosphorus,
      fluid: food.fluid,
    });
  };

  const handleAddFood = () => {
    if (selectedFood) {
      const multiplier = parseFloat(portionSize) || 1;
      const adjustedFood = {
        ...selectedFood,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
        sodium: Math.round(selectedFood.sodium * multiplier),
        potassium: Math.round(selectedFood.potassium * multiplier),
        phosphorus: Math.round(selectedFood.phosphorus * multiplier),
        fluid: Math.round(selectedFood.fluid * multiplier * 10) / 10,
      };
      onAddFood(adjustedFood);
      setSelectedFood(null);
      setPortionSize("1");
      form.reset();
      setSearchQuery("");
    }
  };

  const handleClearSelection = () => {
    setSelectedFood(null);
    form.reset();
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>Add Food Item</CardTitle>
        <CardDescription>
          Search for food or enter details manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Section */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results */}
          {searchQuery && !selectedFood && (
            <div className="mt-2 max-h-60 overflow-y-auto border rounded-md">
              {searchResults.length > 0 ? (
                <ul className="divide-y">
                  {searchResults.map((food) => (
                    <li
                      key={food.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectFood(food)}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-gray-500">
                        {food.servingSize} | {food.calories} cal |{" "}
                        {food.protein}g protein
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}

          {/* Selected Food Form */}
          {selectedFood && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{selectedFood.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSelection}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Form {...form}>
                <div className="space-y-3">
                  <FormItem>
                    <FormLabel>Portion Size</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                        className="w-20"
                      />
                      <div className="flex-1">
                        <Select defaultValue="serving">
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serving">Serving</SelectItem>
                            <SelectItem value="cup">Cup</SelectItem>
                            <SelectItem value="oz">Ounce</SelectItem>
                            <SelectItem value="g">Gram</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <FormDescription>
                      Standard serving: {selectedFood.servingSize}
                    </FormDescription>
                  </FormItem>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Calories</div>
                      <div className="text-lg">
                        {Math.round(
                          selectedFood.calories *
                            (parseFloat(portionSize) || 1),
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Protein</div>
                      <div className="text-lg">
                        {(
                          selectedFood.protein * (parseFloat(portionSize) || 1)
                        ).toFixed(1)}
                        g
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Sodium</div>
                      <div className="text-lg">
                        {Math.round(
                          selectedFood.sodium * (parseFloat(portionSize) || 1),
                        )}
                        mg
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Potassium</div>
                      <div className="text-lg">
                        {Math.round(
                          selectedFood.potassium *
                            (parseFloat(portionSize) || 1),
                        )}
                        mg
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Phosphorus</div>
                      <div className="text-lg">
                        {Math.round(
                          selectedFood.phosphorus *
                            (parseFloat(portionSize) || 1),
                        )}
                        mg
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Fluid</div>
                      <div className="text-lg">
                        {(
                          selectedFood.fluid * (parseFloat(portionSize) || 1)
                        ).toFixed(1)}
                        oz
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          )}

          {/* Manual Entry Form (simplified) */}
          {!selectedFood && !searchQuery && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Or enter food details manually:
              </p>
              <Form {...form}>
                <div className="space-y-3">
                  <FormField
                    name="foodName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter food name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="servingSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serving Size</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1 cup" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="sodium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sodium (mg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="potassium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potassium (mg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phosphorus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phosphorus (mg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="fluid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fluid (oz)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {selectedFood ? (
          <Button onClick={handleAddFood}>Add to Meal</Button>
        ) : (
          <Button
            onClick={() => {
              const values = form.getValues();
              onAddFood({
                id: Date.now().toString(),
                name: values.foodName,
                servingSize: values.servingSize,
                calories: values.calories,
                protein: values.protein,
                sodium: values.sodium,
                potassium: values.potassium,
                phosphorus: values.phosphorus,
                fluid: values.fluid,
              });
              form.reset();
            }}
            disabled={!form.getValues().foodName}
          >
            Add to Meal
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodEntryForm;
