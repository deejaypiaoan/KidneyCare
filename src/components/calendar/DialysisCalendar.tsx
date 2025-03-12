import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Filter,
  X,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AppointmentForm from "./AppointmentForm";

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  notes?: string;
  type: "dialysis" | "checkup" | "other";
}

interface DialysisCalendarProps {
  appointments?: Appointment[];
  onAddAppointment?: (appointment: any) => void;
  onEditAppointment?: (id: string, appointment: any) => void;
  onDeleteAppointment?: (id: string) => void;
}

const DialysisCalendar = ({
  appointments = [
    {
      id: "1",
      title: "Regular Dialysis Session",
      date: new Date(),
      time: "14:00",
      duration: "4 hours",
      location: "City Dialysis Center",
      type: "dialysis" as const,
    },
    {
      id: "2",
      title: "Nephrology Checkup",
      date: addDays(new Date(), 2),
      time: "10:30",
      duration: "1 hour",
      location: "Memorial Hospital",
      notes: "Bring latest lab results",
      type: "checkup" as const,
    },
    {
      id: "3",
      title: "Regular Dialysis Session",
      date: addDays(new Date(), 2),
      time: "14:00",
      duration: "4 hours",
      location: "City Dialysis Center",
      type: "dialysis" as const,
    },
    {
      id: "4",
      title: "Regular Dialysis Session",
      date: addDays(new Date(), 4),
      time: "14:00",
      duration: "4 hours",
      location: "City Dialysis Center",
      type: "dialysis" as const,
    },
    {
      id: "5",
      title: "Nutritionist Consultation",
      date: addDays(new Date(), 5),
      time: "11:00",
      duration: "45 minutes",
      location: "Renal Care Clinic",
      notes: "Discuss fluid intake management",
      type: "other" as const,
    },
  ],
  onAddAppointment = () => {},
  onEditAppointment = () => {},
  onDeleteAppointment = () => {},
}: DialysisCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calculate the start and end of the current week
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

  // Generate an array of dates for the current week
  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  // Filter appointments for the current week
  const weekAppointments = appointments.filter((appointment) => {
    return (
      appointment.date >= startOfCurrentWeek &&
      appointment.date <= endOfCurrentWeek
    );
  });

  // Filter appointments for today
  const todayAppointments = appointments.filter((appointment) => {
    return isToday(appointment.date);
  });

  // Filter upcoming appointments (future dates)
  const upcomingAppointments = appointments
    .filter((appointment) => {
      return appointment.date > new Date();
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleAddAppointment = (data: any) => {
    onAddAppointment({
      ...data,
      id: Date.now().toString(),
      title: "New Appointment",
      type: "dialysis",
    });
    setIsFormOpen(false);
  };

  const handleEditAppointment = (data: any) => {
    if (selectedAppointment) {
      onEditAppointment(selectedAppointment.id, {
        ...selectedAppointment,
        ...data,
      });
    }
    setSelectedAppointment(null);
    setIsFormOpen(false);
    setIsEditMode(false);
  };

  const openEditForm = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case "dialysis":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "checkup":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Dialysis Calendar</h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-bold sr-only">
            Dialysis Calendar
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => (window.location.href = "/session")}
            >
              <Clock className="h-4 w-4" />
              Track Session
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit Appointment" : "Add New Appointment"}
                  </DialogTitle>
                </DialogHeader>
                <AppointmentForm
                  onSubmit={
                    isEditMode ? handleEditAppointment : handleAddAppointment
                  }
                  initialData={
                    selectedAppointment
                      ? {
                          date: selectedAppointment.date,
                          time: selectedAppointment.time,
                          duration: selectedAppointment.duration,
                          location: selectedAppointment.location,
                          notes: selectedAppointment.notes || "",
                          reminders: true,
                          syncCalendar: false,
                        }
                      : undefined
                  }
                  isEditing={isEditMode}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Appointments</DropdownMenuItem>
                <DropdownMenuItem>Dialysis Only</DropdownMenuItem>
                <DropdownMenuItem>Checkups Only</DropdownMenuItem>
                <DropdownMenuItem>Other Appointments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          {/* Week View */}
          <TabsContent value="week" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                Previous Week
              </Button>
              <h3 className="text-lg font-medium">
                {format(startOfCurrentWeek, "MMM d")} -{" "}
                {format(endOfCurrentWeek, "MMM d, yyyy")}
              </h3>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                Next Week
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`mb-1 p-1 rounded-md ${isToday(day) ? "bg-primary text-white" : ""}`}
                  >
                    <div className="text-xs font-medium">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-sm">{format(day, "d")}</div>
                  </div>
                  <div className="min-h-[100px] border rounded-md p-1 overflow-y-auto">
                    {weekAppointments
                      .filter((appointment) => isSameDay(appointment.date, day))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`mb-1 p-1 text-xs rounded cursor-pointer ${getAppointmentTypeColor(appointment.type)}`}
                          onClick={() => openEditForm(appointment)}
                        >
                          <div className="font-medium">{appointment.time}</div>
                          <div className="truncate">{appointment.title}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Today View */}
          <TabsContent value="today">
            <h3 className="text-lg font-medium mb-4">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </h3>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openEditForm(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <div className="text-sm text-gray-500">
                          {appointment.time} • {appointment.duration} •{" "}
                          {appointment.location}
                        </div>
                      </div>
                      <Badge
                        className={getAppointmentTypeColor(appointment.type)}
                      >
                        {appointment.type.charAt(0).toUpperCase() +
                          appointment.type.slice(1)}
                      </Badge>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {appointment.notes}
                      </div>
                    )}
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(appointment);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAppointment(appointment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">
                  No appointments today
                </h3>
                <p className="text-xs">
                  Click the "Add Appointment" button to schedule one.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Upcoming View */}
          <TabsContent value="upcoming">
            <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openEditForm(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          {format(appointment.date, "EEEE, MMMM d, yyyy")}
                        </div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <div className="text-sm text-gray-500">
                          {appointment.time} • {appointment.duration} •{" "}
                          {appointment.location}
                        </div>
                      </div>
                      <Badge
                        className={getAppointmentTypeColor(appointment.type)}
                      >
                        {appointment.type.charAt(0).toUpperCase() +
                          appointment.type.slice(1)}
                      </Badge>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {appointment.notes}
                      </div>
                    )}
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(appointment);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAppointment(appointment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">
                  No upcoming appointments
                </h3>
                <p className="text-xs">
                  Click the "Add Appointment" button to schedule one.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DialysisCalendar;
