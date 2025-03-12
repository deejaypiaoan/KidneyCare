import React, { useState } from "react";
import {
  Check,
  Clock,
  Edit,
  MoreVertical,
  Pill,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  status: "taken" | "missed" | "upcoming";
  nextDose: Date;
  instructions?: string;
}

interface MedicationListProps {
  medications?: Medication[];
  onMarkAsTaken?: (id: string) => void;
  onMarkAsMissed?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MedicationList = ({
  medications = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      status: "upcoming" as const,
      nextDose: new Date(new Date().setHours(8, 0, 0, 0)),
      instructions: "Take with food",
    },
    {
      id: "2",
      name: "Calcium Acetate",
      dosage: "667mg",
      frequency: "Three times daily",
      timeOfDay: ["Morning", "Afternoon", "Evening"],
      status: "taken" as const,
      nextDose: new Date(new Date().setHours(12, 0, 0, 0)),
      instructions: "Take with meals",
    },
    {
      id: "3",
      name: "Epoetin Alfa",
      dosage: "100 units/kg",
      frequency: "Three times weekly",
      timeOfDay: ["Morning"],
      status: "missed" as const,
      nextDose: new Date(new Date().setHours(-3, 0, 0, 0)),
      instructions: "Subcutaneous injection",
    },
  ],
  onMarkAsTaken = () => {},
  onMarkAsMissed = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: MedicationListProps) => {
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Check className="h-4 w-4 text-green-600" />;
      case "missed":
        return <X className="h-4 w-4 text-red-600" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Medications</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Pill className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {/* This would typically render the MedicationForm component */}
              <p className="text-center text-gray-500">
                Medication form would be rendered here
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No medications added yet</p>
            <p className="text-sm text-gray-400">
              Add your first medication to start tracking
            </p>
          </div>
        ) : (
          medications.map((medication) => (
            <Card key={medication.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {medication.name}
                      </h3>
                      <Badge
                        className={`ml-2 ${getStatusColor(medication.status)}`}
                      >
                        <span className="flex items-center">
                          {getStatusIcon(medication.status)}
                          <span className="ml-1 capitalize">
                            {medication.status}
                          </span>
                        </span>
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(medication.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(medication.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Next dose:</span>{" "}
                    {format(medication.nextDose, "h:mm a, MMM d")}
                  </p>
                  {medication.instructions && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Instructions:</span>{" "}
                      {medication.instructions}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="p-3 bg-gray-50 flex justify-end space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkAsMissed(medication.id)}
                        disabled={medication.status === "missed"}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Missed
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as missed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onMarkAsTaken(medication.id)}
                        disabled={medication.status === "taken"}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Taken
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as taken</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Medication Detail Dialog */}
      <Dialog
        open={!!selectedMedication}
        onOpenChange={(open) => !open && setSelectedMedication(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMedication?.name}</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Dosage</h4>
                <p>{selectedMedication.dosage}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Schedule</h4>
                <p>{selectedMedication.frequency}</p>
                <p className="text-sm text-gray-500">
                  Time: {selectedMedication.timeOfDay.join(", ")}
                </p>
              </div>
              {selectedMedication.instructions && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Instructions
                  </h4>
                  <p>{selectedMedication.instructions}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationList;
