import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Download,
  LineChart,
  BarChart,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendGraphsProps {
  metrics?: {
    name: string;
    data: Array<{ date: Date; value: number }>;
    unit: string;
    normalRange?: { min: number; max: number };
  }[];
}

const TrendGraphs = ({
  metrics = [
    {
      name: "Blood Pressure (Systolic)",
      data: [
        { date: new Date("2023-05-01"), value: 130 },
        { date: new Date("2023-05-02"), value: 128 },
        { date: new Date("2023-05-03"), value: 135 },
        { date: new Date("2023-05-04"), value: 132 },
        { date: new Date("2023-05-05"), value: 129 },
        { date: new Date("2023-05-06"), value: 131 },
        { date: new Date("2023-05-07"), value: 127 },
      ],
      unit: "mmHg",
      normalRange: { min: 90, max: 140 },
    },
    {
      name: "Blood Pressure (Diastolic)",
      data: [
        { date: new Date("2023-05-01"), value: 85 },
        { date: new Date("2023-05-02"), value: 82 },
        { date: new Date("2023-05-03"), value: 88 },
        { date: new Date("2023-05-04"), value: 84 },
        { date: new Date("2023-05-05"), value: 80 },
        { date: new Date("2023-05-06"), value: 83 },
        { date: new Date("2023-05-07"), value: 81 },
      ],
      unit: "mmHg",
      normalRange: { min: 60, max: 90 },
    },
    {
      name: "Weight",
      data: [
        { date: new Date("2023-05-01"), value: 72.5 },
        { date: new Date("2023-05-02"), value: 72.3 },
        { date: new Date("2023-05-03"), value: 72.8 },
        { date: new Date("2023-05-04"), value: 72.6 },
        { date: new Date("2023-05-05"), value: 72.4 },
        { date: new Date("2023-05-06"), value: 72.2 },
        { date: new Date("2023-05-07"), value: 72.1 },
      ],
      unit: "kg",
    },
    {
      name: "Oxygen Saturation",
      data: [
        { date: new Date("2023-05-01"), value: 97 },
        { date: new Date("2023-05-02"), value: 98 },
        { date: new Date("2023-05-03"), value: 96 },
        { date: new Date("2023-05-04"), value: 97 },
        { date: new Date("2023-05-05"), value: 98 },
        { date: new Date("2023-05-06"), value: 97 },
        { date: new Date("2023-05-07"), value: 98 },
      ],
      unit: "%",
      normalRange: { min: 95, max: 100 },
    },
  ],
}: TrendGraphsProps) => {
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].name);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [chartType, setChartType] = useState("line");

  // Find the selected metric data
  const selectedMetricData = metrics.find((m) => m.name === selectedMetric);

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            Health Metrics Trends
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.name} value={metric.name}>
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) =>
                    range && setDateRange(range as { from: Date; to: Date })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Tabs
            defaultValue="line"
            value={chartType}
            onValueChange={setChartType}
            className="w-[300px]"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="line" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                Line
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                Bar
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Pie
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="h-[400px] w-full bg-slate-50 rounded-md flex items-center justify-center">
          {/* Placeholder for actual chart implementation */}
          <div className="text-center">
            <div className="text-2xl font-semibold mb-2">
              {selectedMetricData?.name} Chart
            </div>
            <div className="text-muted-foreground">
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart
              showing data from {format(dateRange.from, "MMM d, yyyy")} to{" "}
              {format(dateRange.to, "MMM d, yyyy")}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {selectedMetricData?.normalRange && (
                <p>
                  Normal range: {selectedMetricData.normalRange.min} -{" "}
                  {selectedMetricData.normalRange.max} {selectedMetricData.unit}
                </p>
              )}
              <p>
                Latest value:{" "}
                {
                  selectedMetricData?.data[selectedMetricData.data.length - 1]
                    .value
                }{" "}
                {selectedMetricData?.unit}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Summary statistics */}
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-lg font-medium">
              {selectedMetricData
                ? (
                    selectedMetricData.data.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    ) / selectedMetricData.data.length
                  ).toFixed(1)
                : 0}{" "}
              {selectedMetricData?.unit}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Minimum</div>
            <div className="text-lg font-medium">
              {selectedMetricData
                ? Math.min(
                    ...selectedMetricData.data.map((item) => item.value),
                  ).toFixed(1)
                : 0}{" "}
              {selectedMetricData?.unit}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Maximum</div>
            <div className="text-lg font-medium">
              {selectedMetricData
                ? Math.max(
                    ...selectedMetricData.data.map((item) => item.value),
                  ).toFixed(1)
                : 0}{" "}
              {selectedMetricData?.unit}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Trend</div>
            <div className="text-lg font-medium flex items-center">
              {selectedMetricData && selectedMetricData.data.length > 1 ? (
                selectedMetricData.data[selectedMetricData.data.length - 1]
                  .value >
                selectedMetricData.data[selectedMetricData.data.length - 2]
                  .value ? (
                  <span className="text-green-500">↑ Increasing</span>
                ) : selectedMetricData.data[selectedMetricData.data.length - 1]
                    .value <
                  selectedMetricData.data[selectedMetricData.data.length - 2]
                    .value ? (
                  <span className="text-red-500">↓ Decreasing</span>
                ) : (
                  <span className="text-blue-500">→ Stable</span>
                )
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendGraphs;
