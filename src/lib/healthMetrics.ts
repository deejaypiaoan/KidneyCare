// Get API base URL directly to avoid import issues
const API_BASE_URL = "https://uipbsit2y.org/db-api.php";

export async function getHealthMetrics(patientId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}?endpoint=health_metrics&id=${patientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch health metrics");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching health metrics:", error);
    return { success: false, error: error.message };
  }
}

export async function saveHealthMetric(metricData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=health_metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: metricData.patientId,
        metric_date: metricData.date,
        metric_time: metricData.time,
        blood_pressure_systolic: metricData.bloodPressureSystolic,
        blood_pressure_diastolic: metricData.bloodPressureDiastolic,
        weight: metricData.weight,
        oxygen_level: metricData.oxygenLevel,
        temperature: metricData.temperature,
        notes: metricData.notes || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save health metric");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error saving health metric:", error);
    return { success: false, error: error.message };
  }
}
