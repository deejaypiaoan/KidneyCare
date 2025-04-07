import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, User, AlertCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
import DebugPanel from "@/components/ui/debug-panel";
import { loginUser } from "@/lib/auth";

const loginSchema = z
  .object({
    userType: z.enum(["patient", "admin"]),
    patientId: z
      .string()
      .min(1, { message: "Patient ID is required" })
      .optional(),
    username: z.string().min(1, { message: "Username is required" }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine(
    (data) => {
      if (data.userType === "patient" && !data.patientId) {
        return false;
      }
      if (data.userType === "admin" && !data.username) {
        return false;
      }
      return true;
    },
    {
      message: "Required field missing for selected user type",
      path: ["patientId"],
    },
  );

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm = ({
  onSuccess = () => {},
  onRegisterClick = () => {},
}: LoginFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [userType, setUserType] = useState<"patient" | "admin">("patient");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: "patient",
      patientId: "",
      username: "",
      password: "",
    },
  });

  // Update form values when user type changes and check for temp credentials
  useEffect(() => {
    form.setValue("userType", userType);

    // Check for temporary credentials in sessionStorage
    const tempPatientId = sessionStorage.getItem("tempPatientId");
    const tempPatientPassword = sessionStorage.getItem("tempPatientPassword");

    if (tempPatientId && tempPatientPassword) {
      console.log("Found temporary credentials in sessionStorage", {
        tempPatientId,
        tempPatientPassword,
      });

      // Set the form values
      form.setValue("userType", "patient");
      form.setValue("patientId", tempPatientId);
      form.setValue("password", tempPatientPassword);
      setUserType("patient");

      // Clear the temporary credentials
      sessionStorage.removeItem("tempPatientId");
      sessionStorage.removeItem("tempPatientPassword");

      // Auto-submit the form after a short delay
      setTimeout(() => form.handleSubmit(onSubmit)(), 500);
    }
  }, [userType, form]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare login data based on user type
      const loginData = {
        userType: data.userType,
        credential:
          data.userType === "patient" ? data.patientId : data.username || "",
        password: data.password,
      };

      // Log the attempt for debugging
      console.log(
        `Attempting to login as ${data.userType} with credential: ${loginData.credential}`,
      );

      // Log the data being sent
      console.log("Sending login data:", loginData);

      const result = await loginUser(loginData);
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("userRole", result.data.user.role);

        // For patients created through the admin panel, we need to set up their profile
        if (result.data.user.role === "patient") {
          // If we have a profile from the API, use it
          if (result.data.profile) {
            localStorage.setItem("patientId", result.data.profile.id);
            localStorage.setItem(
              "patientProfile",
              JSON.stringify({
                firstName: result.data.profile.first_name,
                middleName: result.data.profile.middle_name,
                lastName: result.data.profile.last_name,
                dateOfBirth: result.data.profile.date_of_birth,
                phone: result.data.profile.phone,
                email: result.data.profile.email,
                address: result.data.profile.address,
                barangay: result.data.profile.barangay,
                municipality: result.data.profile.municipality,
                province: result.data.profile.province,
                zipCode: result.data.profile.zip_code,
                emergencyContactName:
                  result.data.profile.emergency_contact_name,
                emergencyContactPhone:
                  result.data.profile.emergency_contact_phone,
                profilePicture: result.data.profile.profile_picture,
              }),
            );
          } else {
            // For patients created through the admin panel, use the data from the user object
            const patientUser = result.data.user;
            localStorage.setItem(
              "patientId",
              patientUser.patientId || patientUser.id,
            );
            localStorage.setItem(
              "patientProfile",
              JSON.stringify({
                firstName: patientUser.firstName || "",
                middleName: "",
                lastName: patientUser.lastName || "",
                dateOfBirth: "",
                phone: "",
                email: patientUser.email || "",
                address: "",
                barangay: "",
                municipality: "",
                province: "",
                zipCode: "",
                emergencyContactName: "",
                emergencyContactPhone: "",
                profilePicture: "",
              }),
            );
          }
        }

        // Show success message
        alert("Login successful! Redirecting...");

        // Also add visual alert
        // Create and show success alert
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-success";
        alertDiv.setAttribute("role", "alert");
        alertDiv.innerHTML = "Login successful! Redirecting...";
        const cardElement = document.querySelector(".card");
        if (cardElement) {
          cardElement.prepend(alertDiv);
        }

        // Redirect after a short delay
        setTimeout(() => {
          onSuccess();
          // Redirect based on user role
          if (result.data.user.role === "patient") {
            navigate("/");
          } else {
            navigate("/admin");
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ASAP Dialysis Care App
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${userType === "patient" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"} border border-gray-200`}
                onClick={() => setUserType("patient")}
              >
                Patient
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${userType === "admin" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"} border border-gray-200`}
                onClick={() => setUserType("admin")}
              >
                Employee
              </button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {userType === "patient" ? (
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your patient ID"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your password"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={onRegisterClick}
            >
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
      <DebugPanel />
    </>
  );
};

export default LoginForm;
