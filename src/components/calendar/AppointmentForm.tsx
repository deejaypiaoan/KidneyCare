import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Bell,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  notes: z.string().optional(),
  reminders: z.boolean().default(true),
  syncCalendar: z.boolean().default(false),
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  onSubmit?: (data: AppointmentFormValues) => void;
  initialData?: Partial<AppointmentFormValues>;
  isEditing?: boolean;
}

const AppointmentForm = ({
  onSubmit = () => {},
  initialData = {
    date: new Date(),
    time: "14:00",
    duration: "4 hours",
    location: "City Dialysis Center",
    notes: "",
    reminders: true,
    syncCalendar: false,
  },
  isEditing = false,
}: AppointmentFormProps) => {
  const [date, setDate] = useState<Date | undefined>(initialData.date);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData as AppointmentFormValues,
  });

  const handleSubmit = (data: AppointmentFormValues) => {
    onSubmit(data);
    // In a real app, this would save the data to the backend
    console.log("Form submitted:", data);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {isEditing ? "Edit Appointment" : "Add New Appointment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal flex justify-between items-center"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input {...field} placeholder="e.g., 14:00" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                      <SelectItem value="3 hours">3 hours</SelectItem>
                      <SelectItem value="4 hours">4 hours</SelectItem>
                      <SelectItem value="5 hours">5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input {...field} placeholder="Enter location" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="reminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Appointment Reminders</FormLabel>
                      <FormDescription>
                        Receive notifications before your appointment
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-gray-500" />
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("reminders") && (
                <div className="rounded-lg border p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-medium">
                      Reminder Settings
                    </FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FormLabel className="text-xs">When to send</FormLabel>
                      <select
                        className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        defaultValue="24"
                      >
                        <option value="0">At appointment time</option>
                        <option value="1">1 hour before</option>
                        <option value="24">24 hours before</option>
                        <option value="48">48 hours before</option>
                      </select>
                    </div>
                    <div>
                      <FormLabel className="text-xs">
                        Notification Method
                      </FormLabel>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            id="emailNotify"
                            defaultChecked
                            className="h-4 w-4"
                          />
                          <label htmlFor="emailNotify" className="text-sm">
                            Email
                          </label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            id="smsNotify"
                            defaultChecked
                            className="h-4 w-4"
                          />
                          <label htmlFor="smsNotify" className="text-sm">
                            SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="syncCalendar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Sync with Calendar</FormLabel>
                      <FormDescription>
                        Add this appointment to your device calendar
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center">
                        <CalendarCheck className="mr-2 h-4 w-4 text-gray-500" />
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Save"} Appointment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
