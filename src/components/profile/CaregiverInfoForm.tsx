import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Mail, Bell, Save, X } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AlertMessage from "@/components/ui/alert-message";
import { saveCaregiverInfo } from "@/lib/database";

const caregiverSchema = z.object({
  name: z.string().min(1, { message: "Caregiver name is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string().optional(),
  notifyBySMS: z.boolean().default(true),
  notifyByEmail: z.boolean().default(true),
  notifyBeforeSession: z.boolean().default(true),
  notifyAfterSession: z.boolean().default(true),
});

type CaregiverFormValues = z.infer<typeof caregiverSchema>;

interface CaregiverInfoFormProps {
  defaultValues?: Partial<CaregiverFormValues>;
  onSave?: (data: CaregiverFormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CaregiverInfoForm = ({
  defaultValues = {
    name: "Maria Dela Cruz",
    relationship: "Spouse",
    phone: "+63 918 987 6543",
    email: "maria.delacruz@example.com",
    address: "123 Rizal Avenue, Manila, Philippines",
    notifyBySMS: true,
    notifyByEmail: true,
    notifyBeforeSession: true,
    notifyAfterSession: true,
  },
  onSave = async (data) => {
    try {
      // Save to localStorage for immediate UI updates
      window.localStorage.setItem("caregiverInfo", JSON.stringify(data));

      // Save to database
      const patientId =
        localStorage.getItem("patientId") || "default-patient-id";
      const result = await saveCaregiverInfo(data, patientId);

      if (result.success) {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Caregiver information saved successfully!",
        });
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      console.error("Error saving caregiver info:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to save caregiver information. Please try again.",
      });
    }
  },
  onCancel = () => {},
  isEditing = false,
}: CaregiverInfoFormProps) => {
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, type: "info", message: "" });

  const form = useForm<CaregiverFormValues>({
    resolver: zodResolver(caregiverSchema),
    defaultValues,
  });

  const handleSubmit = (data: CaregiverFormValues) => {
    onSave(data);
  };

  return (
    <Card>
      {alertInfo.show && (
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Caregiver Information</CardTitle>
            <CardDescription>
              Manage your caregiver's contact details and notification
              preferences
            </CardDescription>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caregiver Name</FormLabel>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Spouse, Child, Sibling"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Philippine Phone Number</FormLabel>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input placeholder="+63 9XX XXX XXXX" {...field} />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Used for SMS notifications and reminders
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
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
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Caregiver's address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifyBySMS"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>SMS Notifications</FormLabel>
                        <FormDescription>
                          Send notifications via text message
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
                  name="notifyByEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription>
                          Send notifications via email
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
                  name="notifyBeforeSession"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Before Dialysis Session</FormLabel>
                        <FormDescription>
                          Notify caregiver before dialysis sessions
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
                  name="notifyAfterSession"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>After Dialysis Session</FormLabel>
                        <FormDescription>
                          Notify caregiver when dialysis sessions end
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

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CaregiverInfoForm;
