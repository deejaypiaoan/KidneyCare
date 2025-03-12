import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import { saveHealthMetric } from "@/lib/healthMetrics";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define the form schema with validation rules
const formSchema = z.object({
  bloodPressureSystolic: z.coerce
    .number()
    .min(70, { message: "Systolic pressure is too low" })
    .max(220, { message: "Systolic pressure is too high" }),
  bloodPressureDiastolic: z.coerce
    .number()
    .min(40, { message: "Diastolic pressure is too low" })
    .max(120, { message: "Diastolic pressure is too high" }),
  weight: z.coerce
    .number()
    .min(20, { message: "Weight is too low" })
    .max(300, { message: "Weight is too high" }),
  oxygenLevel: z.coerce
    .number()
    .min(70, { message: "Oxygen level is too low" })
    .max(100, { message: "Oxygen level cannot exceed 100%" }),
  temperature: z.coerce
    .number()
    .min(35, { message: "Temperature is too low" })
    .max(42, { message: "Temperature is too high" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MetricEntryFormProps {
  onSubmit?: (data: FormValues) => void;
  showWarnings?: boolean;
}

const MetricEntryForm = ({
  onSubmit = () => {},
  showWarnings = true,
}: MetricEntryFormProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      weight: 70,
      oxygenLevel: 98,
      temperature: 36.6,
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    try {
      // Get patient ID from localStorage
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        throw new Error("Patient ID not found");
      }

      // Format date and time
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];

      // Prepare data for API
      const metricData = {
        patientId,
        date,
        time,
        bloodPressureSystolic: values.bloodPressureSystolic,
        bloodPressureDiastolic: values.bloodPressureDiastolic,
        weight: values.weight,
        oxygenLevel: values.oxygenLevel,
        temperature: values.temperature,
        notes: values.notes,
      };

      // Call API to save metric
      const result = await saveHealthMetric(metricData);

      if (result.success) {
        console.log("Metrics saved successfully");
      } else {
        console.error("Failed to save metrics:", result.error);
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
    }

    // Check for concerning values that might need immediate attention
    if (
      values.bloodPressureSystolic > 180 ||
      values.bloodPressureDiastolic > 110
    ) {
      setAlertMessage(
        "Your blood pressure is dangerously high. Please seek medical attention.",
      );
      setShowAlert(true);
    } else if (values.oxygenLevel < 90) {
      setAlertMessage(
        "Your oxygen level is critically low. Please seek medical attention.",
      );
      setShowAlert(true);
    } else if (values.temperature > 39) {
      setAlertMessage(
        "You have a high fever. Please consult with your healthcare provider.",
      );
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }

    // Pass the form data to the parent component
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>Health Metrics Entry</CardTitle>
        <CardDescription>
          Record your vital signs and health metrics below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodPressureSystolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodPressureDiastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="70"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Record your weight before or after dialysis as instructed by
                    your provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oxygenLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oxygen Level (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="98" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.6"
                      {...field}
                    />
                  </FormControl>
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
                    <textarea
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                      placeholder="Any additional observations or symptoms..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full">
                Save Metrics
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MetricEntryForm;
