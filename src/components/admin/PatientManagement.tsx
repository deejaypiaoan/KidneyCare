import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Search, ArrowLeft, Edit, Trash2, Eye } from "lucide-react";

interface Patient {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  patientId: string;
  role: string;
  createdAt: string;
  createdBy: string;
}

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load patients from localStorage
    const loadPatients = () => {
      const allUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      // Filter only patients
      const patientUsers = allUsers.filter(
        (user: any) => user.role === "patient",
      );
      setPatients(patientUsers);
    };

    loadPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to delete a patient
  const deletePatient = (patientId: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        // Get all users from localStorage
        const allUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]",
        );
        // Filter out the patient to delete
        const updatedUsers = allUsers.filter(
          (user: any) => user.patientId !== patientId,
        );
        // Save back to localStorage
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
        // Update state
        setPatients(
          updatedUsers.filter((user: any) => user.role === "patient"),
        );
        alert("Patient deleted successfully");
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient");
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Patient Management</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={() => navigate("/admin/patients/create")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Patients</CardTitle>
          <CardDescription>
            Manage patient accounts and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.firstName?.[0]}
                              {patient.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              Patient
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.patientId}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{patient.createdBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/patients/view/${patient.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Store the patient ID for editing
                              localStorage.setItem(
                                "editingPatientId",
                                patient.patientId,
                              );
                              navigate("/admin/patients/create");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deletePatient(patient.patientId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="mt-1">Add a new patient to get started</p>
              <Button
                className="mt-4"
                onClick={() => navigate("/admin/patients/create")}
              >
                Add New Patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientManagement;
