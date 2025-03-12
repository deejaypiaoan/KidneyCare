import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Edit,
  Save,
  FileText,
  Shield,
  Heart,
  X,
  ArrowLeft,
} from "lucide-react";

import NotificationSettings from "../notifications/NotificationSettings";
import ReminderManager from "../notifications/ReminderManager";
import CaregiverInfoForm from "./CaregiverInfoForm";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AlertMessage from "@/components/ui/alert-message";
import { savePatientProfile, saveMedicalInfo } from "@/lib/database";

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  profilePicture: z.string().optional(),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  barangay: z.string().min(1, { message: "Barangay is required" }),
  municipality: z.string().min(1, { message: "Municipality is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  emergencyContactName: z.string().min(1, {
    message: "Emergency contact name is required",
  }),
  emergencyContactPhone: z.string().min(1, {
    message: "Emergency contact phone is required",
  }),
});

const medicalInfoSchema = z.object({
  dialysisCenter: z.string().min(1, { message: "Dialysis center is required" }),
  nephrologist: z.string().min(1, { message: "Nephrologist name is required" }),
  nephrologyClinic: z.string().min(1, {
    message: "Nephrology clinic is required",
  }),
  dialysisSchedule: z.string().min(1, {
    message: "Dialysis schedule is required",
  }),
  dryWeight: z.string().min(1, { message: "Dry weight is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

interface PatientProfileProps {
  profileData?: z.infer<typeof profileFormSchema>;
  medicalData?: z.infer<typeof medicalInfoSchema>;
  onSaveProfile?: (data: z.infer<typeof profileFormSchema>) => void;
  onSaveMedical?: (data: z.infer<typeof medicalInfoSchema>) => void;
}

const PatientProfile = ({
  profileData = {
    firstName: "",
    middleName: "",
    lastName: "",
    profilePicture: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    barangay: "",
    municipality: "",
    province: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  },
  medicalData = {
    dialysisCenter: "Philippine Kidney Center",
    nephrologist: "Dr. Jose Santos",
    nephrologyClinic: "Manila Kidney Care Specialists",
    dialysisSchedule: "Mon, Wed, Fri - 9:00 AM to 1:00 PM",
    dryWeight: "72.5 kg",
    bloodType: "O+",
    allergies: "Penicillin, Sulfa drugs",
    medications: "Epoetin Alfa, Calcium Acetate, Lisinopril",
  },
  onSaveProfile = async (data) => {
    try {
      // Save to localStorage for immediate UI updates
      window.localStorage.setItem("patientProfile", JSON.stringify(data));

      // Save to database
      const result = await savePatientProfile(data);

      if (result.success) {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Profile information saved successfully!",
        });
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to save profile information. Please try again.",
      });
    }
  },
  onSaveMedical = async (data) => {
    try {
      // Save to localStorage for immediate UI updates
      window.localStorage.setItem("medicalData", JSON.stringify(data));

      // Save to database
      const patientId =
        localStorage.getItem("patientId") || "default-patient-id";
      const result = await saveMedicalInfo(data, patientId);

      if (result.success) {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Medical information saved successfully!",
        });
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (error) {
      console.error("Error saving medical info:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to save medical information. Please try again.",
      });
    }
  },
}: PatientProfileProps) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingMedical, setEditingMedical] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, type: "info", message: "" });
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [actualProfileData, setActualProfileData] = useState(profileData);
  const [actualMedicalData, setActualMedicalData] = useState(medicalData);

  // Load actual profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("patientProfile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setActualProfileData(parsedProfile);
      if (parsedProfile.profilePicture) {
        setProfileImageUrl(parsedProfile.profilePicture);
      }
    }

    const savedMedical = localStorage.getItem("medicalData");
    if (savedMedical) {
      setActualMedicalData(JSON.parse(savedMedical));
    }
  }, []);

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
        profileForm.setValue("profilePicture", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: actualProfileData,
  });

  const medicalForm = useForm<z.infer<typeof medicalInfoSchema>>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: actualMedicalData,
  });

  const handleProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    onSaveProfile(data);
    setEditingProfile(false);
  };

  const handleMedicalSubmit = (data: z.infer<typeof medicalInfoSchema>) => {
    onSaveMedical(data);
    setEditingMedical(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      {alertInfo.show && (
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        />
      )}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Patient Profile</h1>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} />
              ) : (
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${actualProfileData.firstName || "User"}`}
                />
              )}
              <AvatarFallback className="text-4xl">
                {actualProfileData.firstName?.charAt(0) || ""}
                {actualProfileData.lastName?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            {editingProfile && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90"
              >
                <Edit className="h-4 w-4" />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                />
              </label>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-4">
            {actualProfileData.firstName} {actualProfileData.lastName}
          </h1>
          <p className="text-muted-foreground">
            Patient ID: {localStorage.getItem("patientId") || "Not registered"}
          </p>
        </div>

        <div className="flex-1 w-full md:w-auto">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Patient Summary</CardTitle>
              <CardDescription>
                Quick overview of your patient information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium">
                      {actualProfileData.dateOfBirth}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{actualProfileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {actualProfileData.municipality},{" "}
                      {actualProfileData.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{actualMedicalData.bloodType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger
            value="personal"
            className="px-2 py-2 text-sm md:text-base"
          >
            Personal Information
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="px-2 py-2 text-sm md:text-base"
          >
            Medical Information
          </TabsTrigger>
          <TabsTrigger
            value="caregiver"
            className="px-2 py-2 text-sm md:text-base"
          >
            Caregiver Info
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-2 py-2 text-sm md:text-base"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal and contact details
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProfile(!editingProfile)}
                >
                  {editingProfile ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-medium mb-4">
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
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
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Personal Details
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {profileData.firstName} {profileData.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Full Name
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {profileData.dateOfBirth}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Date of Birth
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Contact Information
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {profileData.phone}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Phone Number
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {profileData.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Email Address
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Address
                    </h3>
                    <div className="mt-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {profileData.address}
                          </p>
                          <p className="text-sm font-medium">
                            {profileData.city}, {profileData.state}{" "}
                            {profileData.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Emergency Contact
                    </h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {profileData.emergencyContactName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contact Name
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {profileData.emergencyContactPhone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contact Phone
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>
                    Your dialysis and medical details
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMedical(!editingMedical)}
                >
                  {editingMedical ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingMedical ? (
                <Form {...medicalForm}>
                  <form
                    onSubmit={medicalForm.handleSubmit(handleMedicalSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={medicalForm.control}
                        name="dialysisCenter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dialysis Center</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="nephrologist"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nephrologist</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="nephrologyClinic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nephrology Clinic</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="dialysisSchedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dialysis Schedule</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="dryWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dry Weight</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              List any allergies separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={medicalForm.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Current Medications</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              List your current medications separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Dialysis Information
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.dialysisCenter}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Dialysis Center
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.dialysisSchedule}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Schedule
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Healthcare Providers
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.nephrologist}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Nephrologist
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.nephrologyClinic}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Clinic
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Health Metrics
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.bloodType}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Blood Type
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.dryWeight}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Dry Weight
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Medical Alerts
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {medicalData.allergies || "No known allergies"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Allergies
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Current Medications
                    </h3>
                    <div className="mt-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {medicalData.medications || "No medications listed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caregiver">
          <CaregiverInfoForm />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6">
            <ReminderManager />
            <NotificationSettings
              defaultValues={{
                email: profileData.email,
                phone: profileData.phone,
                enableEmailNotifications: true,
                enableSMSNotifications: true,
                medicationReminders: true,
                appointmentReminders: true,
                reminderTime: "1",
                advanceNotice: "24",
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProfile;
