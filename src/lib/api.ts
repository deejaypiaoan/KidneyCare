// API client for communicating with the PHP backend

// Update this URL to match where you uploaded the db-api.php file
const API_BASE_URL = "https://uipbsit2y.org/db-api.php";

// Generic API request function
async function apiRequest(
  method: string,
  endpoint: string,
  id?: string,
  data?: any,
) {
  const url = new URL(API_BASE_URL);
  url.searchParams.append("endpoint", endpoint);
  if (id) url.searchParams.append("id", id);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url.toString(), options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "API request failed");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(`API ${method} request failed:`, error);
    return { success: false, error };
  }
}

// Patient Profile API functions
export async function getPatientProfile(id: string) {
  return apiRequest("GET", "patient_profiles", id);
}

export async function createPatientProfile(data: any) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    user_id: data.userId,
    first_name: data.firstName,
    middle_name: data.middleName || "",
    last_name: data.lastName,
    profile_picture: data.profilePicture || "",
    date_of_birth: data.dateOfBirth,
    phone: data.phone,
    email: data.email,
    address: data.address,
    barangay: data.barangay,
    municipality: data.municipality,
    province: data.province,
    zip_code: data.zipCode,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
  };

  return apiRequest("POST", "patient_profiles", undefined, apiData);
}

export async function updatePatientProfile(id: string, data: any) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    first_name: data.firstName,
    middle_name: data.middleName || "",
    last_name: data.lastName,
    profile_picture: data.profilePicture || "",
    date_of_birth: data.dateOfBirth,
    phone: data.phone,
    email: data.email,
    address: data.address,
    barangay: data.barangay,
    municipality: data.municipality,
    province: data.province,
    zip_code: data.zipCode,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
  };

  return apiRequest("PUT", "patient_profiles", id, apiData);
}

// Medical Information API functions
export async function getMedicalInfo(patientId: string) {
  return apiRequest("GET", "medical_information", patientId);
}

export async function createMedicalInfo(data: any, patientId: string) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    patient_id: patientId,
    dialysis_center: data.dialysisCenter,
    nephrologist: data.nephrologist,
    nephrology_clinic: data.nephrologyClinic,
    dialysis_schedule: data.dialysisSchedule,
    dry_weight: data.dryWeight,
    blood_type: data.bloodType,
    allergies: data.allergies,
    medications: data.medications,
  };

  return apiRequest("POST", "medical_information", undefined, apiData);
}

export async function updateMedicalInfo(id: string, data: any) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    dialysis_center: data.dialysisCenter,
    nephrologist: data.nephrologist,
    nephrology_clinic: data.nephrologyClinic,
    dialysis_schedule: data.dialysisSchedule,
    dry_weight: data.dryWeight,
    blood_type: data.bloodType,
    allergies: data.allergies,
    medications: data.medications,
  };

  return apiRequest("PUT", "medical_information", id, apiData);
}

// Caregiver Information API functions
export async function getCaregiverInfo(patientId: string) {
  return apiRequest("GET", "caregivers", patientId);
}

export async function createCaregiverInfo(data: any, patientId: string) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    patient_id: patientId,
    name: data.name,
    relationship: data.relationship,
    phone: data.phone,
    email: data.email,
    address: data.address || "",
    notify_by_sms: data.notifyBySMS ? 1 : 0,
    notify_by_email: data.notifyByEmail ? 1 : 0,
    notify_before_session: data.notifyBeforeSession ? 1 : 0,
    notify_after_session: data.notifyAfterSession ? 1 : 0,
  };

  return apiRequest("POST", "caregivers", undefined, apiData);
}

export async function updateCaregiverInfo(id: string, data: any) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    name: data.name,
    relationship: data.relationship,
    phone: data.phone,
    email: data.email,
    address: data.address || "",
    notify_by_sms: data.notifyBySMS ? 1 : 0,
    notify_by_email: data.notifyByEmail ? 1 : 0,
    notify_before_session: data.notifyBeforeSession ? 1 : 0,
    notify_after_session: data.notifyAfterSession ? 1 : 0,
  };

  return apiRequest("PUT", "caregivers", id, apiData);
}

// Notification Settings API functions
export async function getNotificationSettings(patientId: string) {
  return apiRequest("GET", "notification_settings", patientId);
}

export async function createNotificationSettings(data: any, patientId: string) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    patient_id: patientId,
    email: data.email,
    phone: data.phone,
    enable_email_notifications: data.enableEmailNotifications ? 1 : 0,
    enable_sms_notifications: data.enableSMSNotifications ? 1 : 0,
    medication_reminders: data.medicationReminders ? 1 : 0,
    appointment_reminders: data.appointmentReminders ? 1 : 0,
    reminder_time: data.reminderTime,
    advance_notice: data.advanceNotice,
  };

  return apiRequest("POST", "notification_settings", undefined, apiData);
}

export async function updateNotificationSettings(id: string, data: any) {
  // Convert from camelCase to snake_case for the API
  const apiData = {
    email: data.email,
    phone: data.phone,
    enable_email_notifications: data.enableEmailNotifications ? 1 : 0,
    enable_sms_notifications: data.enableSMSNotifications ? 1 : 0,
    medication_reminders: data.medicationReminders ? 1 : 0,
    appointment_reminders: data.appointmentReminders ? 1 : 0,
    reminder_time: data.reminderTime,
    advance_notice: data.advanceNotice,
  };

  return apiRequest("PUT", "notification_settings", id, apiData);
}
