import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Pill,
  Plus,
  Calendar,
  Bell,
  Mail,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import MedicationList from "./MedicationList";
import MedicationForm from "./MedicationForm";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  status: "taken" | "missed" | "upcoming";
  nextDose: Date;
  instructions?: string;
  startDate?: string;
  endDate?: string;
  reminders?: boolean;
  reminderTime?: string;
  notes?: string;
}

interface MedicationManagerProps {
  medications?: Medication[];
}

const MedicationManager = ({
  medications: initialMedications = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      status: "upcoming",
      nextDose: new Date(new Date().setHours(8, 0, 0, 0)),
      instructions: "Take with food",
      startDate: new Date().toISOString().split("T")[0],
      reminders: true,
      reminderTime: "08:00",
    },
    {
      id: "2",
      name: "Calcium Acetate",
      dosage: "667mg",
      frequency: "Three times daily",
      timeOfDay: ["Morning", "Afternoon", "Evening"],
      status: "taken",
      nextDose: new Date(new Date().setHours(12, 0, 0, 0)),
      instructions: "Take with meals",
      startDate: new Date().toISOString().split("T")[0],
      reminders: true,
      reminderTime: "08:00",
    },
    {
      id: "3",
      name: "Epoetin Alfa",
      dosage: "100 units/kg",
      frequency: "Three times weekly",
      timeOfDay: ["Morning"],
      status: "missed",
      nextDose: new Date(new Date().setHours(-3, 0, 0, 0)),
      instructions: "Subcutaneous injection",
      startDate: new Date().toISOString().split("T")[0],
      reminders: true,
      reminderTime: "08:00",
    },
  ],
}: MedicationManagerProps) => {
  const [activeTab, setActiveTab] = useState("current");
  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null,
  );
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter medications based on active tab
  const filteredMedications = medications.filter((med) => {
    if (activeTab === "current") {
      return med.status === "upcoming" || med.status === "taken";
    } else if (activeTab === "history") {
      return med.status === "missed" || med.status === "taken";
    }
    return true; // All tab
  });

  const handleMarkAsTaken = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, status: "taken" } : med,
      ),
    );
  };

  const handleMarkAsMissed = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, status: "missed" } : med,
      ),
    );
  };

  const handleEdit = (id: string) => {
    const medicationToEdit = medications.find((med) => med.id === id);
    if (medicationToEdit) {
      setEditingMedication(medicationToEdit);
      setShowAddForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleAddMedication = (data: any) => {
    if (editingMedication) {
      // Update existing medication
      setMedications(
        medications.map((med) =>
          med.id === editingMedication.id
            ? {
                ...med,
                ...data,
                id: med.id,
                status: med.status,
                nextDose: med.nextDose,
              }
            : med,
        ),
      );
      setEditingMedication(null);
    } else {
      // Add new medication
      const newMedication: Medication = {
        id: Date.now().toString(),
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        timeOfDay: data.timeOfDay,
        status: "upcoming",
        nextDose: new Date(new Date().setHours(8, 0, 0, 0)),
        instructions: data.instructions,
        startDate: data.startDate,
        endDate: data.endDate,
        reminders: data.reminders,
        reminderTime: data.reminderTime,
        notes: data.notes,
      };
      setMedications([...medications, newMedication]);
    }
    setShowAddForm(false);
  };

  const handleCancelForm = () => {
    setEditingMedication(null);
    setShowAddForm(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Medication Management</h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <p className="text-gray-600">Track and manage your medications</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
            <Button variant="outline" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule View
            </Button>
          </div>
        </div>

        {showAddForm ? (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMedication ? "Edit Medication" : "Add New Medication"}
                </CardTitle>
              </CardHeader>
              <MedicationForm
                medication={editingMedication || undefined}
                onSubmit={handleAddMedication}
                onCancel={handleCancelForm}
              />
            </Card>
          </div>
        ) : (
          <Tabs
            defaultValue="current"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-6"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="current" className="flex items-center">
                <Pill className="mr-2 h-4 w-4" />
                Current Medications
              </TabsTrigger>
              <TabsTrigger value="history">Medication History</TabsTrigger>
              <TabsTrigger value="all">All Medications</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-0">
              <MedicationList
                medications={filteredMedications}
                onMarkAsTaken={handleMarkAsTaken}
                onMarkAsMissed={handleMarkAsMissed}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <MedicationList
                medications={filteredMedications}
                onMarkAsTaken={handleMarkAsTaken}
                onMarkAsMissed={handleMarkAsMissed}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <MedicationList
                medications={filteredMedications}
                onMarkAsTaken={handleMarkAsTaken}
                onMarkAsMissed={handleMarkAsMissed}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">
            Medication Reminders
          </h3>
          <p className="text-blue-700 text-sm">
            Remember to take your medications as prescribed. Set up reminders to
            help you stay on track with your treatment plan.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => (window.location.href = "/notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Manage Reminders
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => (window.location.href = "/notifications")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => (window.location.href = "/notifications")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationManager;
