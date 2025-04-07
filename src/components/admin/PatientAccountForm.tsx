import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, User, Mail, Lock, Copy, LogIn } from "lucide-react";

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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema with validation rules
const patientAccountSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  patientId: z.string().min(1, { message: "Patient ID is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type PatientAccountFormValues = z.infer<typeof patientAccountSchema>;

const PatientAccountForm = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] =
    useState<PatientAccountFormValues | null>(null);

  // Check if we're editing an existing patient
  const editingPatientId = localStorage.getItem("editingPatientId");
  const [isEditing, setIsEditing] = useState(!!editingPatientId);

  // Get existing patient data if editing
  const getExistingPatientData = () => {
    if (editingPatientId) {
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      const existingPatient = existingUsers.find(
        (user: any) => user.patientId === editingPatientId,
      );

      if (existingPatient) {
        return {
          firstName: existingPatient.firstName || "",
          lastName: existingPatient.lastName || "",
          email: existingPatient.email || "",
          patientId: existingPatient.patientId,
          password: existingPatient.password || generateRandomPassword(),
        };
      }
    }

    return {
      firstName: "",
      lastName: "",
      email: "",
      patientId: `PAT-${Math.floor(100000 + Math.random() * 900000)}`,
      password: generateRandomPassword(),
    };
  };

  // Initialize form with default values or existing patient data
  const form = useForm<PatientAccountFormValues>({
    resolver: zodResolver(patientAccountSchema),
    defaultValues: getExistingPatientData(),
  });

  // Function to generate a random password
  function generateRandomPassword(length = 8) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  // Function to generate a new patient ID
  const generateNewPatientId = () => {
    const newPatientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
    form.setValue("patientId", newPatientId);
  };

  // Function to generate a new password
  const generateNewPassword = () => {
    const newPassword = generateRandomPassword();
    form.setValue("password", newPassword);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Function to redirect to patient login page
  const redirectToPatientLogin = () => {
    if (generatedCredentials) {
      // Make sure the user is registered in localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );

      // Check if user already exists
      const userExists = existingUsers.some(
        (u: any) => u.patientId === generatedCredentials.patientId,
      );

      if (!userExists) {
        // Add user to registered users if not already there
        const newUser = {
          id: Date.now(),
          username: generatedCredentials.patientId,
          firstName: generatedCredentials.firstName,
          lastName: generatedCredentials.lastName,
          email: generatedCredentials.email,
          password: generatedCredentials.password,
          role: "patient",
          patientId: generatedCredentials.patientId,
          createdAt: new Date().toISOString(),
          createdBy:
            JSON.parse(localStorage.getItem("user") || "{}").username ||
            "admin",
        };

        existingUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
        console.log("Added user to registeredUsers:", newUser);
      }

      // Store the credentials temporarily in sessionStorage for auto-fill
      sessionStorage.setItem("tempPatientId", generatedCredentials.patientId);
      sessionStorage.setItem(
        "tempPatientPassword",
        generatedCredentials.password,
      );

      console.log("Stored credentials in sessionStorage", {
        patientId: generatedCredentials.patientId,
        password: generatedCredentials.password,
      });

      // Create a basic patient profile in localStorage if it doesn't exist
      const patientProfile = {
        firstName: generatedCredentials.firstName,
        middleName: "",
        lastName: generatedCredentials.lastName,
        dateOfBirth: "",
        phone: "",
        email: generatedCredentials.email,
        address: "",
        barangay: "",
        municipality: "",
        province: "",
        zipCode: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        profilePicture: "",
      };

      // Store the profile with the patientId as the key
      localStorage.setItem(
        `patientProfile_${generatedCredentials.patientId}`,
        JSON.stringify(patientProfile),
      );

      // Also store a copy in the standard location for immediate use
      localStorage.setItem("patientProfile", JSON.stringify(patientProfile));

      // Navigate to auth page
      navigate("/auth");
    }
  };

  // Handle form submission
  const onSubmit = (data: PatientAccountFormValues) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );

      if (isEditing && editingPatientId) {
        // Update existing patient
        const updatedUsers = existingUsers.map((user: any) => {
          if (user.patientId === editingPatientId) {
            return {
              ...user,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: data.password,
              updatedAt: new Date().toISOString(),
              updatedBy:
                JSON.parse(localStorage.getItem("user") || "{}").username ||
                "admin",
            };
          }
          return user;
        });

        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

        // Update patient profile
        const profileKey = `patientProfile_${editingPatientId}`;
        const existingProfile = JSON.parse(
          localStorage.getItem(profileKey) || "{}",
        );
        const updatedProfile = {
          ...existingProfile,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        };

        localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

        // Clear editing state
        localStorage.removeItem("editingPatientId");
        setIsEditing(false);

        // Show success message
        alert("Patient updated successfully!");
        navigate("/admin/patients");
      } else {
        // Check if patientId already exists
        const patientExists = existingUsers.some(
          (user: any) => user.patientId === data.patientId,
        );

        if (patientExists) {
          alert("This Patient ID already exists. Please generate a new one.");
          return;
        }

        // Create new user with patient role
        const newUser = {
          id: Date.now(),
          username: data.patientId, // Use patientId as username for patients
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: "patient",
          patientId: data.patientId,
          createdAt: new Date().toISOString(),
          createdBy:
            JSON.parse(localStorage.getItem("user") || "{}").username ||
            "admin",
        };

        // Add to existing users and save
        existingUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

        // Show success message and store generated credentials
        setGeneratedCredentials(data);
        setShowSuccess(true);

        // Reset form after successful submission
        setTimeout(() => {
          form.reset({
            firstName: "",
            lastName: "",
            email: "",
            patientId: `PAT-${Math.floor(100000 + Math.random() * 900000)}`,
            password: generateRandomPassword(),
          });
        }, 5000);
      }
    } catch (error) {
      console.error("Error creating/updating patient account:", error);
      alert("Failed to create/update patient account. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Patient Account" : "Create Patient Account"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update patient account information"
            : "Create a new patient account and generate login credentials"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSuccess && generatedCredentials && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <User className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Patient Account Created Successfully
            </AlertTitle>
            <AlertDescription className="text-green-700">
              <p className="mb-2">
                Patient account for {generatedCredentials.firstName}{" "}
                {generatedCredentials.lastName} has been created.
              </p>
              <div className="bg-white p-4 rounded border border-green-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Patient ID:</span>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {generatedCredentials.patientId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(generatedCredentials.patientId)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Password:</span>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {generatedCredentials.password}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(generatedCredentials.password)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={redirectToPatientLogin}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Login as Patient
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="patient@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      The patient will use this email for account recovery
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="PAT-123456"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2"
                        onClick={generateNewPatientId}
                      >
                        Generate
                      </Button>
                    </div>
                    <FormDescription>
                      The patient will use this ID to log in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2"
                        onClick={generateNewPassword}
                      >
                        Generate
                      </Button>
                    </div>
                    <FormDescription>
                      The patient will use this password to log in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />{" "}
                {isEditing
                  ? "Update Patient Account"
                  : "Create Patient Account"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-3">
        <p className="text-xs text-gray-500">
          Note: Patient credentials will be displayed after account creation.
          Make sure to save or share them with the patient.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PatientAccountForm;
