import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Upload, User } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema with validation rules
const patientSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"]),
  civilStatus: z.enum([
    "single",
    "married",
    "widowed",
    "divorced",
    "separated",
  ]),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  occupation: z.string().optional(),
  profilePicture: z.string().optional(),

  // Contact Information
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  address: z.string().min(1, { message: "Address is required" }),
  barangay: z.string().min(1, { message: "Barangay is required" }),
  municipality: z.string().min(1, { message: "Municipality is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),

  // Emergency Contact
  emergencyContactName: z
    .string()
    .min(1, { message: "Emergency contact name is required" }),
  emergencyContactRelationship: z
    .string()
    .min(1, { message: "Relationship is required" }),
  emergencyContactPhone: z
    .string()
    .min(1, { message: "Emergency contact phone is required" }),
  emergencyContactAddress: z.string().optional(),

  // Medical Information
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  allergies: z.string().optional(),
  dialysisStartDate: z
    .string()
    .min(1, { message: "Dialysis start date is required" }),
  primaryNephrologist: z
    .string()
    .min(1, { message: "Primary nephrologist is required" }),
  ckdStage: z.enum(["1", "2", "3a", "3b", "4", "5"]),
  dialysisFrequency: z
    .string()
    .min(1, { message: "Dialysis frequency is required" }),
  comorbidities: z.string().optional(),
  medications: z.string().optional(),

  // Insurance Information
  insuranceProvider: z.string().optional(),
  insuranceIdNumber: z.string().optional(),
  insuranceCoverage: z.string().optional(),
  philhealthMember: z.boolean().default(false),
  philhealthNumber: z.string().optional(),

  // Account Settings
  generateCredentials: z.boolean().default(true),
  sendCredentialsBySMS: z.boolean().default(true),
  assignedDoctor: z.string().min(1, { message: "Assigned doctor is required" }),
  assignedNurse: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const PatientRegistration = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Initialize form with default values
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      civilStatus: "single",
      nationality: "Filipino",
      occupation: "",
      profilePicture: "",
      phone: "",
      email: "",
      address: "",
      barangay: "",
      municipality: "",
      province: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      emergencyContactAddress: "",
      bloodType: "O+",
      height: "",
      weight: "",
      allergies: "",
      dialysisStartDate: "",
      primaryNephrologist: "",
      ckdStage: "5",
      dialysisFrequency: "3 times per week",
      comorbidities: "",
      medications: "",
      insuranceProvider: "",
      insuranceIdNumber: "",
      insuranceCoverage: "",
      philhealthMember: true,
      philhealthNumber: "",
      generateCredentials: true,
      sendCredentialsBySMS: true,
      assignedDoctor: "",
      assignedNurse: "",
      notes: "",
    },
  });

  // Function to handle profile picture upload
  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImageUrl(base64String);
        form.setValue("profilePicture", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log("Patient registration data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setShowSuccessAlert(true);

      // Reset form after successful submission
      form.reset();
      setProfileImageUrl("");
      setActiveTab("personal");

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data for doctors and nurses
  const doctors = [
    { id: "1", name: "Dr. Jose Santos" },
    { id: "2", name: "Dr. Maria Reyes" },
    { id: "3", name: "Dr. Pedro Lim" },
  ];

  const nurses = [
    { id: "1", name: "Nurse Ana Gonzales" },
    { id: "2", name: "Nurse Juan Dela Cruz" },
    { id: "3", name: "Nurse Elena Magtanggol" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Patient Registration</h1>

      {showSuccessAlert && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <User className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            Registration Successful
          </AlertTitle>
          <AlertDescription className="text-green-700">
            Patient has been registered successfully. Patient ID and credentials
            have been generated.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>New Patient Registration</CardTitle>
          <CardDescription>
            Enter patient details to register them in the ASAP Dialysis Care
            system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="account">Account Setup</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="personal" className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-primary/10">
                        {profileImageUrl ? (
                          <AvatarImage src={profileImageUrl} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                            <User className="h-12 w-12" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90"
                      >
                        <Upload className="h-4 w-4" />
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="civilStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Civil Status*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select civil status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="separated">
                                Separated
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nationality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Occupation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("contact")}
                    >
                      Next: Contact Information
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="+63 9XX XXX XXXX" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street Address*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="House/Lot/Unit No., Street Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barangay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barangay*</FormLabel>
                          <FormControl>
                            <Input placeholder="Barangay" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipality/City*</FormLabel>
                          <FormControl>
                            <Input placeholder="Municipality/City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province*</FormLabel>
                          <FormControl>
                            <Input placeholder="Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code*</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship*</FormLabel>
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
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+63 9XX XXX XXXX"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContactAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Address (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("personal")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("medical")}
                    >
                      Next: Medical Information
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Height in cm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Weight in kg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dialysisStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dialysis Start Date*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryNephrologist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Nephrologist*</FormLabel>
                          <FormControl>
                            <Input placeholder="Doctor's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ckdStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CKD Stage*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select CKD stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Stage 1</SelectItem>
                              <SelectItem value="2">Stage 2</SelectItem>
                              <SelectItem value="3a">Stage 3a</SelectItem>
                              <SelectItem value="3b">Stage 3b</SelectItem>
                              <SelectItem value="4">Stage 4</SelectItem>
                              <SelectItem value="5">Stage 5</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dialysisFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dialysis Frequency*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 3 times per week"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any allergies, separated by commas"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comorbidities"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Comorbidities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any comorbidities (e.g., Diabetes, Hypertension)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medications"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Current Medications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List current medications with dosages"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("contact")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("insurance")}
                    >
                      Next: Insurance Information
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="philhealthMember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              PhilHealth Member
                            </FormLabel>
                            <FormDescription>
                              Is the patient a PhilHealth member?
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

                    {form.watch("philhealthMember") && (
                      <FormField
                        control={form.control}
                        name="philhealthNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PhilHealth Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="PhilHealth ID number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="insuranceProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Insurance company name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insuranceIdNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance ID Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Insurance ID/Policy number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insuranceCoverage"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Insurance Coverage Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Details about coverage, limitations, etc."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("medical")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("account")}
                    >
                      Next: Account Setup
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="generateCredentials"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Generate Patient Credentials
                            </FormLabel>
                            <FormDescription>
                              Automatically generate Patient ID and password
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
                      name="sendCredentialsBySMS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Credentials by SMS
                            </FormLabel>
                            <FormDescription>
                              Send login details to patient's phone
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!form.watch("generateCredentials")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assignedDoctor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned Doctor*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select doctor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assignedNurse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned Nurse</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select nurse (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nurses.map((nurse) => (
                                <SelectItem key={nurse.id} value={nurse.id}>
                                  {nurse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional notes or special instructions"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("insurance")}
                    >
                      Previous
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Register Patient"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <div className="text-sm text-gray-500">* Required fields</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientRegistration;
