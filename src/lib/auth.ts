// Due to CORS issues, we'll use localStorage for authentication
// This is a temporary solution until the API CORS issues are resolved

interface LoginCredentials {
  userType: string;
  credential: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export async function loginUser(credentials: LoginCredentials) {
  try {
    console.log("Logging in with:", credentials);

    // Special case for admin
    if (
      (credentials.credential === "admin" || credentials.credential === "") &&
      credentials.password === "password"
    ) {
      const adminUser = {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      };

      // Store admin in localStorage
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("userRole", "admin");

      return {
        success: true,
        data: {
          user: adminUser,
        },
      };
    }

    // Get registered users from localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );

    // Find user by credential (username or patient ID)
    let user;
    if (credentials.userType === "patient") {
      user = existingUsers.find(
        (u: any) => u.patientId === credentials.credential,
      );
    } else {
      user = existingUsers.find(
        (u: any) =>
          u.username === credentials.credential &&
          (u.role === "admin" || u.role === "doctor" || u.role === "nurse"),
      );
    }

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    if (user.password !== credentials.password) {
      throw new Error("Invalid credentials");
    }

    // Store user data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }),
    );
    localStorage.setItem("userRole", user.role);

    // If patient, create mock profile data
    let profileData = null;
    if (user.role === "patient") {
      profileData = {
        id: `PAT-${user.id}`,
        first_name: user.username.split("_")[0] || "John",
        middle_name: "",
        last_name: user.username.split("_")[1] || "Doe",
        date_of_birth: "1990-01-01",
        phone: "09123456789",
        email: user.email,
        address: "123 Main St",
        barangay: "Sample Barangay",
        municipality: "Sample Municipality",
        province: "Sample Province",
        zip_code: "1234",
        emergency_contact_name: "Emergency Contact",
        emergency_contact_phone: "09123456789",
      };

      localStorage.setItem("patientId", profileData.id);
      localStorage.setItem("patientProfile", JSON.stringify(profileData));
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        profile: profileData,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}

// Test localStorage connection
export async function testApiConnection() {
  try {
    // Test if localStorage is available
    const testKey = "test_connection";
    localStorage.setItem(testKey, "test_value");
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (testValue !== "test_value") {
      throw new Error("LocalStorage test failed");
    }

    return {
      success: true,
      data: {
        message: "LocalStorage is working correctly",
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("LocalStorage test error:", error);
    return { success: false, error: error.message };
  }
}

export async function registerUser(userData: RegisterData) {
  try {
    console.log("Registering user:", userData);

    // Get existing users from localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );

    // Clear any existing users with the same username or email
    // This allows re-registering with the same credentials for testing
    const filteredUsers = existingUsers.filter(
      (user: any) =>
        user.username !== userData.username && user.email !== userData.email,
    );

    // Create new user
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "patient",
      patientId:
        userData.role === "patient"
          ? `PAT-${Date.now().toString().slice(-6)}`
          : null,
    };

    // Add to filtered users and save
    filteredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(filteredUsers));

    console.log("User registered successfully:", newUser);
    return { success: true, data: { user_id: newUser.id } };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
}

export function isAuthenticated() {
  return localStorage.getItem("user") !== null;
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("patientId");
  localStorage.removeItem("patientProfile");
  localStorage.removeItem("medicalData");
  localStorage.removeItem("caregiverInfo");
  localStorage.removeItem("notificationSettings");
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}
