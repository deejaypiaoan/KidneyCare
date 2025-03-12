import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  Settings,
  PlusCircle,
  Bell,
  LogOut,
  User,
  Activity,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout, getCurrentUser } from "@/lib/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and has admin role
    const user = getCurrentUser();
    const userRole = localStorage.getItem("userRole");

    if (
      !user ||
      !userRole ||
      !["admin", "doctor", "nurse"].includes(userRole)
    ) {
      navigate("/auth");
      return;
    }

    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Mock data for dashboard
  const dashboardStats = {
    totalPatients: 128,
    activeSessions: 12,
    upcomingAppointments: 24,
    criticalAlerts: 3,
  };

  // Mock data for recent patients
  const recentPatients = [
    {
      id: "PAT-10045",
      name: "Juan Dela Cruz",
      age: 58,
      lastSession: "Today, 9:00 AM",
      nextSession: "Wed, 10:00 AM",
      status: "active",
    },
    {
      id: "PAT-10046",
      name: "Maria Santos",
      age: 62,
      lastSession: "Yesterday",
      nextSession: "Thu, 2:00 PM",
      status: "active",
    },
    {
      id: "PAT-10047",
      name: "Pedro Reyes",
      age: 45,
      lastSession: "2 days ago",
      nextSession: "Fri, 9:00 AM",
      status: "critical",
    },
    {
      id: "PAT-10048",
      name: "Ana Gonzales",
      age: 53,
      lastSession: "3 days ago",
      nextSession: "Mon, 2:00 PM",
      status: "warning",
    },
  ];

  // Mock data for today's schedule
  const todaySchedule = [
    {
      time: "9:00 AM",
      patientId: "PAT-10045",
      patientName: "Juan Dela Cruz",
      machine: "Machine 1",
      status: "completed",
    },
    {
      time: "10:00 AM",
      patientId: "PAT-10052",
      patientName: "Elena Magtanggol",
      machine: "Machine 3",
      status: "in-progress",
    },
    {
      time: "2:00 PM",
      patientId: "PAT-10061",
      patientName: "Roberto Sanchez",
      machine: "Machine 2",
      status: "upcoming",
    },
    {
      time: "3:00 PM",
      patientId: "PAT-10063",
      patientName: "Luisa Mendoza",
      machine: "Machine 4",
      status: "upcoming",
    },
  ];

  // Mock data for alerts
  const alerts = [
    {
      id: "1",
      type: "critical",
      message:
        "Pedro Reyes (PAT-10047) reported abnormal blood pressure: 180/110",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "warning",
      message: "Ana Gonzales (PAT-10048) missed last scheduled session",
      time: "Yesterday",
    },
    {
      id: "3",
      type: "info",
      message: "New lab results available for 5 patients",
      time: "Yesterday",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">ASAP Dialysis Care</h2>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white">
                {currentUser?.username?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser?.username || "Admin"}</p>
              <p className="text-xs text-gray-500 capitalize">
                {localStorage.getItem("userRole") || "Admin"}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/admin/patients")}
            >
              <Users className="mr-2 h-4 w-4" />
              Patient Management
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/admin/schedule")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/admin/records")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Health Records
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alerts.length}
              </span>
            </Button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Patients
                    </p>
                    <p className="text-3xl font-bold">
                      {dashboardStats.totalPatients}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Sessions
                    </p>
                    <p className="text-3xl font-bold">
                      {dashboardStats.activeSessions}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Upcoming Appointments
                    </p>
                    <p className="text-3xl font-bold">
                      {dashboardStats.upcomingAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Critical Alerts
                    </p>
                    <p className="text-3xl font-bold">
                      {dashboardStats.criticalAlerts}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Patients */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Patients</CardTitle>
                  <Button variant="outline" size="sm" className="h-8">
                    <PlusCircle className="mr-2 h-3.5 w-3.5" />
                    Add Patient
                  </Button>
                </div>
                <CardDescription>
                  Overview of recent patient activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          ID
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Patient
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Age
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Last Session
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Next Session
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-2 text-sm">{patient.id}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {patient.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {patient.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm">{patient.age}</td>
                          <td className="py-3 px-2 text-sm">
                            {patient.lastSession}
                          </td>
                          <td className="py-3 px-2 text-sm">
                            {patient.nextSession}
                          </td>
                          <td className="py-3 px-2">
                            <Badge
                              className={
                                patient.status === "active"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : patient.status === "warning"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {patient.status.charAt(0).toUpperCase() +
                                patient.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View All Patients
                </Button>
              </CardFooter>
            </Card>

            {/* Today's Schedule & Alerts */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Dialysis sessions for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySchedule.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            <Badge
                              className={
                                session.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : session.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                              }
                            >
                              {session.time}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-medium">{session.patientName}</p>
                            <p className="text-xs text-gray-500">
                              {session.patientId} • {session.machine}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View Full Schedule
                  </Button>
                </CardFooter>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>
                    Recent notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div
                          className={
                            alert.type === "critical"
                              ? "p-2 bg-red-100 rounded-full"
                              : alert.type === "warning"
                                ? "p-2 bg-yellow-100 rounded-full"
                                : "p-2 bg-blue-100 rounded-full"
                          }
                        >
                          <Bell
                            className={
                              alert.type === "critical"
                                ? "h-4 w-4 text-red-600"
                                : alert.type === "warning"
                                  ? "h-4 w-4 text-yellow-600"
                                  : "h-4 w-4 text-blue-600"
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
