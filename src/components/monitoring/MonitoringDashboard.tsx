import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { getHealthMetrics } from "@/lib/healthMetrics";

import MetricsOverview from "./MetricsOverview";
import MetricEntryForm from "./MetricEntryForm";
import TrendGraphs from "./TrendGraphs";

interface MonitoringDashboardProps {
  initialTab?: "overview" | "trends" | "entry";
  onBack?: () => void;
}

const MonitoringDashboard = ({
  initialTab = "overview",
  onBack = () => (window.location.href = "/"),
}: MonitoringDashboardProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showEntryForm, setShowEntryForm] = useState(false);

  // State for metrics data
  const [metrics, setMetrics] = useState({
    bloodPressure: {
      value: "--/--",
      status: "normal" as const,
      timestamp: "No data",
    },
    heartRate: {
      value: 0,
      status: "normal" as const,
      timestamp: "No data",
    },
    oxygenLevel: {
      value: 0,
      status: "normal" as const,
      timestamp: "No data",
    },
    weight: {
      value: 0,
      status: "normal" as const,
      timestamp: "No data",
    },
    fluidIntake: {
      value: 0,
      status: "normal" as const,
      timestamp: "No data",
    },
    temperature: {
      value: 0,
      status: "normal" as const,
      timestamp: "No data",
    },
  });

  // Load health metrics from database
  useEffect(() => {
    const fetchHealthMetrics = async () => {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) return;

      const result = await getHealthMetrics(patientId);
      if (result.success && result.data && result.data.length > 0) {
        // Get the most recent entry
        const latestMetric = result.data[0];

        // Format timestamp
        const date = new Date(
          latestMetric.metric_date + "T" + latestMetric.metric_time,
        );
        const formattedTime = date.toLocaleString();

        // Update metrics state
        setMetrics({
          bloodPressure: {
            value: `${latestMetric.blood_pressure_systolic}/${latestMetric.blood_pressure_diastolic}`,
            status: getBloodPressureStatus(
              latestMetric.blood_pressure_systolic,
              latestMetric.blood_pressure_diastolic,
            ),
            timestamp: formattedTime,
          },
          heartRate: {
            value: 72, // Not tracked in our database yet
            status: "normal",
            timestamp: formattedTime,
          },
          oxygenLevel: {
            value: latestMetric.oxygen_level,
            status: getOxygenStatus(latestMetric.oxygen_level),
            timestamp: formattedTime,
          },
          weight: {
            value: latestMetric.weight,
            status: "normal",
            timestamp: formattedTime,
          },
          fluidIntake: {
            value: 1.2, // Not tracked in our database yet
            status: "warning",
            timestamp: formattedTime,
          },
          temperature: {
            value: latestMetric.temperature,
            status: getTemperatureStatus(latestMetric.temperature),
            timestamp: formattedTime,
          },
        });
      }
    };

    fetchHealthMetrics();
  }, []);

  // Helper functions to determine status
  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return "warning";
    if (systolic >= 180 || diastolic >= 120) return "critical";
    return "normal";
  };

  const getOxygenStatus = (level: number) => {
    if (level < 95) return "warning";
    if (level < 90) return "critical";
    return "normal";
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 37.5) return "warning";
    if (temp > 38.5) return "critical";
    return "normal";
  };

  // Mock trend data
  const trendMetrics = [
    {
      name: "Blood Pressure (Systolic)",
      data: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 6)),
          value: 130,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 5)),
          value: 128,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 4)),
          value: 135,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 3)),
          value: 132,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
          value: 129,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 1)),
          value: 131,
        },
        { date: new Date(), value: 130 },
      ],
      unit: "mmHg",
      normalRange: { min: 90, max: 140 },
    },
    {
      name: "Weight",
      data: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 6)),
          value: 73.2,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 5)),
          value: 73.0,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 4)),
          value: 72.8,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 3)),
          value: 72.7,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
          value: 72.6,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 1)),
          value: 72.5,
        },
        { date: new Date(), value: 72.5 },
      ],
      unit: "kg",
    },
    {
      name: "Oxygen Saturation",
      data: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 6)),
          value: 97,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 5)),
          value: 98,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 4)),
          value: 96,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 3)),
          value: 97,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
          value: 98,
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 1)),
          value: 97,
        },
        { date: new Date(), value: 96 },
      ],
      unit: "%",
      normalRange: { min: 95, max: 100 },
    },
  ];

  const handleMetricSubmit = (data: any) => {
    console.log("New metrics submitted:", data);
    setShowEntryForm(false);
    setActiveTab("overview");

    // Update the UI with new metrics
    const now = new Date();
    const formattedTime = now.toLocaleString();

    setMetrics({
      ...metrics,
      bloodPressure: {
        value: data.bloodPressure,
        status: getBloodPressureStatus(
          parseInt(data.bloodPressure.split("/")[0]),
          parseInt(data.bloodPressure.split("/")[1]),
        ),
        timestamp: formattedTime,
      },
      oxygenLevel: {
        value: parseInt(data.oxygenLevel),
        status: getOxygenStatus(parseInt(data.oxygenLevel)),
        timestamp: formattedTime,
      },
      weight: {
        value: parseFloat(data.weight),
        status: "normal",
        timestamp: formattedTime,
      },
      temperature: {
        value: parseFloat(data.temperature),
        status: getTemperatureStatus(parseFloat(data.temperature)),
        timestamp: formattedTime,
      },
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Self-Monitoring Dashboard</h1>
          </div>

          {!showEntryForm && (
            <Button
              onClick={() => setShowEntryForm(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Record New Metrics
            </Button>
          )}
        </div>

        {/* Main content */}
        {showEntryForm ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <MetricEntryForm onSubmit={handleMetricSubmit} />
            </div>
            <div className="md:col-span-2">
              <Card className="bg-white h-full">
                <CardHeader>
                  <CardTitle>Health Metrics Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">Blood Pressure</h3>
                      <p className="text-sm text-gray-600">
                        Normal range: 90-140/60-90 mmHg
                      </p>
                      <p className="text-sm text-gray-600">
                        Record before taking medications
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Weight</h3>
                      <p className="text-sm text-gray-600">
                        Record at the same time each day
                      </p>
                      <p className="text-sm text-gray-600">
                        Note any significant changes (±2kg)
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Oxygen Level</h3>
                      <p className="text-sm text-gray-600">
                        Normal range: 95-100%
                      </p>
                      <p className="text-sm text-gray-600">
                        Contact your provider if below 90%
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Temperature</h3>
                      <p className="text-sm text-gray-600">
                        Normal range: 36.1-37.2°C
                      </p>
                      <p className="text-sm text-gray-600">
                        Fever is considered 38°C or higher
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab as any}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">Current Metrics</TabsTrigger>
              <TabsTrigger value="trends">Trends & History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <MetricsOverview metrics={metrics} />
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              <TrendGraphs metrics={trendMetrics} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
