import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bell, Mail, MessageSquare, Clock, Save } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import AlertMessage from "@/components/ui/alert-message";
import { saveNotificationSettings } from "@/lib/database";

const notificationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  enableEmailNotifications: z.boolean().default(true),
  enableSMSNotifications: z.boolean().default(true),
  medicationReminders: z.boolean().default(true),
  appointmentReminders: z.boolean().default(true),
  reminderTime: z.string().min(1, { message: "Please select a reminder time" }),
  advanceNotice: z
    .string()
    .min(1, { message: "Please select advance notice time" }),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface NotificationSettingsProps {
  onSave?: (data: NotificationFormValues) => void;
  defaultValues?: Partial<NotificationFormValues>;
}

const NotificationSettings = ({
  onSave = async (data) => {
    try {
      // Save to localStorage for immediate UI updates
      window.localStorage.setItem("notificationSettings", JSON.stringify(data));

      // Save to database
      const patientId =
        localStorage.getItem("patientId") || "default-patient-id";
      const result = await saveNotificationSettings(data, patientId);

      if (result.success) {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Notification settings saved successfully!",
        });
        toast({
          title: "Settings saved",
          description: "Your notification preferences have been updated.",
        });
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to save notification settings. Please try again.",
      });
    }
  },
  defaultValues = {
    email: "",
    phone: "",
    enableEmailNotifications: true,
    enableSMSNotifications: true,
    medicationReminders: true,
    appointmentReminders: true,
    reminderTime: "1",
    advanceNotice: "24",
  },
}: NotificationSettingsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, type: "info", message: "" });

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues,
  });

  const handleSubmit = (data: NotificationFormValues) => {
    onSave(data);
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-md">
      {alertInfo.show && (
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how and when you receive notifications and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="reminders">Reminder Preferences</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-gray-500" />
                            <FormControl>
                              <Input
                                placeholder="your.email@example.com"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Used for email notifications and reminders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <div className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Used for SMS notifications and reminders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-medium pt-4">
                    Notification Methods
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="enableEmailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableSMSNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>SMS Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via text message
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reminders" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Reminder Types</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="medicationReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Medication Reminders</FormLabel>
                            <FormDescription>
                              Get reminders when it's time to take your
                              medications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appointmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Appointment Reminders</FormLabel>
                            <FormDescription>
                              Get reminders about upcoming dialysis appointments
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-medium pt-4">
                    Timing Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reminderTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder Time</FormLabel>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="0">At the scheduled time</option>
                                <option value="15">15 minutes before</option>
                                <option value="30">30 minutes before</option>
                                <option value="60">1 hour before</option>
                              </select>
                            </FormControl>
                          </div>
                          <FormDescription>
                            When to send medication reminders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="advanceNotice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Advance Notice</FormLabel>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="24">24 hours before</option>
                                <option value="48">48 hours before</option>
                                <option value="72">72 hours before</option>
                                <option value="168">1 week before</option>
                              </select>
                            </FormControl>
                          </div>
                          <FormDescription>
                            How far in advance to send appointment reminders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
