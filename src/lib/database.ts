import {
  createPatientProfile as apiCreatePatientProfile,
  updatePatientProfile as apiUpdatePatientProfile,
  createMedicalInfo as apiCreateMedicalInfo,
  updateMedicalInfo as apiUpdateMedicalInfo,
  createCaregiverInfo as apiCreateCaregiverInfo,
  updateCaregiverInfo as apiUpdateCaregiverInfo,
  createNotificationSettings as apiCreateNotificationSettings,
  updateNotificationSettings as apiUpdateNotificationSettings,
  getPatientProfile,
  getMedicalInfo,
  getCaregiverInfo,
  getNotificationSettings,
} from "./api";

// Database connection configuration
const DB_CONFIG = {
  host: "uipbsit2y.org",
  user: "uipbsity_dialysis",
  password: "Hailhydra@123",
  database: "uipbsity_db_dialysis",
};

// We'll use our PHP API to connect to MySQL from the browser

// Patient Profile Operations
export async function savePatientProfile(profileData: any) {
  try {
    // Check if we have an existing profile ID
    const patientId = localStorage.getItem("patientId");
    let result;

    if (patientId) {
      // Update existing profile
      result = await apiUpdatePatientProfile(patientId, profileData);

      // Also save to localStorage with patient-specific key
      localStorage.setItem(
        `patientProfile_${patientId}`,
        JSON.stringify(profileData),
      );
    } else {
      // Create new profile
      result = await apiCreatePatientProfile(profileData);

      // Save the new patient ID to localStorage
      if (result.success && result.data && result.data.id) {
        localStorage.setItem("patientId", result.data.id);
        localStorage.setItem(
          `patientProfile_${result.data.id}`,
          JSON.stringify(profileData),
        );
      }
    }

    // Always update the standard location too
    localStorage.setItem("patientProfile", JSON.stringify(profileData));

    return result;
  } catch (error) {
    console.error("Error saving patient profile:", error);
    return { success: false, error };
  }
}

// Medical Information Operations
export async function saveMedicalInfo(medicalData: any, patientId: string) {
  try {
    // Check if we have existing medical info
    const medicalInfoResponse = await getMedicalInfo(patientId);
    let result;

    if (medicalInfoResponse.success && medicalInfoResponse.data) {
      // Update existing medical info
      result = await apiUpdateMedicalInfo(
        medicalInfoResponse.data.id,
        medicalData,
      );
    } else {
      // Create new medical info
      result = await apiCreateMedicalInfo(medicalData, patientId);
    }

    // Save to localStorage with patient-specific key
    localStorage.setItem(
      `medicalData_${patientId}`,
      JSON.stringify(medicalData),
    );

    // Also save to standard location
    localStorage.setItem("medicalData", JSON.stringify(medicalData));

    return result;
  } catch (error) {
    console.error("Error saving medical information:", error);
    return { success: false, error };
  }
}

// Caregiver Information Operations
export async function saveCaregiverInfo(caregiverData: any, patientId: string) {
  try {
    // Check if we have existing caregiver info
    const caregiverInfoResponse = await getCaregiverInfo(patientId);
    let result;

    if (caregiverInfoResponse.success && caregiverInfoResponse.data) {
      // Update existing caregiver info
      result = await apiUpdateCaregiverInfo(
        caregiverInfoResponse.data.id,
        caregiverData,
      );
    } else {
      // Create new caregiver info
      result = await apiCreateCaregiverInfo(caregiverData, patientId);
    }

    return result;
  } catch (error) {
    console.error("Error saving caregiver information:", error);
    return { success: false, error };
  }
}

// Notification Settings Operations
export async function saveNotificationSettings(
  settingsData: any,
  patientId: string,
) {
  try {
    // Check if we have existing notification settings
    const settingsResponse = await getNotificationSettings(patientId);
    let result;

    if (settingsResponse.success && settingsResponse.data) {
      // Update existing notification settings
      result = await apiUpdateNotificationSettings(
        settingsResponse.data.id,
        settingsData,
      );
    } else {
      // Create new notification settings
      result = await apiCreateNotificationSettings(settingsData, patientId);
    }

    return result;
  } catch (error) {
    console.error("Error saving notification settings:", error);
    return { success: false, error };
  }
}
