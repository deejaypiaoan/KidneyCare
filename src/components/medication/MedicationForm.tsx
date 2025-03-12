import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Clock,
  Calendar,
  Bell,
  Plus,
  Trash,
  Save,
  Mail,
  MessageSquare,
} from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  timeOfDay: z
    .array(z.string())
    .min(1, { message: "At least one time of day is required" }),
  instructions: z.string().optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  reminders: z.boolean().default(false),
  reminderTime: z.string().optional(),
  notes: z.string().optional(),
});

type MedicationFormProps = {
  medication?: {
    id?: string;
    name: string;
    dosage: string;
    frequency: string;
    timeOfDay: string[];
    instructions?: string;
    startDate: string;
    endDate?: string;
    reminders: boolean;
    reminderTime?: string;
    notes?: string;
  };
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
};

const MedicationForm = ({
  medication = {
    name: "",
    dosage: "",
    frequency: "daily",
    timeOfDay: ["morning"],
    instructions: "",
    startDate: new Date().toISOString().split("T")[0],
    reminders: true,
    reminderTime: "08:00",
    notes: "",
  },
  onSubmit = (data) => console.log("Form submitted:", data),
  onCancel = () => console.log("Form cancelled"),
}: MedicationFormProps) => {
  const [showReminders, setShowReminders] = useState(medication.reminders);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: medication,
  });

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "twice-daily", label: "Twice Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "as-needed", label: "As Needed" },
  ];

  const timeOfDayOptions = [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
    { value: "bedtime", label: "Bedtime" },
  ];

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    toast({
      title: "Medication saved",
      description: `${data.name} has been successfully saved.`,
    });
  };

  const handleReminderToggle = (checked: boolean) => {
    setShowReminders(checked);
    setValue("reminders", checked);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          {medication.id ? "Edit Medication" : "Add New Medication"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              placeholder="Enter medication name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 10mg, 1 tablet"
              {...register("dosage")}
              className={errors.dosage ? "border-red-500" : ""}
            />
            {errors.dosage && (
              <p className="text-sm text-red-500">{errors.dosage.message}</p>
            )}
          </div>

          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  defaultValue={medication.frequency}
                  onValueChange={(value) => setValue("frequency", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time of Day</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeOfDayOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`timeOfDay-${option.value}`}
                        value={option.value}
                        {...register("timeOfDay")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`timeOfDay-${option.value}`}
                        className="text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.timeOfDay && (
                  <p className="text-sm text-red-500">
                    {errors.timeOfDay.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate")}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <Input id="endDate" type="date" {...register("endDate")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders" className="cursor-pointer">
                    <div className="flex items-center">
                      <Bell className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Reminders</span>
                    </div>
                  </Label>
                  <Switch
                    id="reminders"
                    checked={showReminders}
                    onCheckedChange={handleReminderToggle}
                  />
                </div>

                {showReminders && (
                  <div className="space-y-4 mt-2 border rounded-md p-3 bg-gray-50">
                    <div>
                      <Label htmlFor="reminderTime">Reminder Time</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <Input
                          id="reminderTime"
                          type="time"
                          {...register("reminderTime")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notification Methods</Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            id="emailReminder"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor="emailReminder"
                            className="text-sm font-normal flex items-center"
                          >
                            <Mail className="mr-1 h-3 w-3 text-gray-500" />
                            Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            id="smsReminder"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor="smsReminder"
                            className="text-sm font-normal flex items-center"
                          >
                            <MessageSquare className="mr-1 h-3 w-3 text-gray-500" />
                            SMS
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Take with food, etc."
                  {...register("instructions")}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this medication"
                  {...register("notes")}
                  className="min-h-[80px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <CardFooter className="flex justify-between px-0 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              {medication.id ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
