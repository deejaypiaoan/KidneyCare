<?php
// Database API for Dialysis Patient Companion App
// Enable CORS for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Database connection parameters
$host = "localhost";
$username = "uipbsity_dialysis";
$password = "Hailhydra@123";
$database = "uipbsity_db_dialysis";
// Connect to database
$conn = new mysqli($host, $username, $password, $database);
// Check connection
if ($conn->connect_error) {
    sendResponse(500, ["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}
// Get request data
$requestMethod = $_SERVER["REQUEST_METHOD"];
$endpoint = isset($_GET["endpoint"]) ? $_GET["endpoint"] : "";
$id = isset($_GET["id"]) ? $_GET["id"] : null;
// Get JSON data from request body
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);
// Route the request
switch ($endpoint) {
    case "register":
        handleRegister($data, $conn);
        break;
    case "patient_login":
    case "admin_login":
        handleLogin($endpoint, $data, $conn);
        break;
    default:
        // Handle other endpoints based on request method
        switch ($requestMethod) {
            case "GET":
                handleGetRequest($endpoint, $id, $conn);
                break;
            case "POST":
                handlePostRequest($endpoint, $data, $conn);
                break;
            case "PUT":
                handlePutRequest($endpoint, $id, $data, $conn);
                break;
            case "DELETE":
                handleDeleteRequest($endpoint, $id, $conn);
                break;
            default:
                sendResponse(405, ["error" => "Method not allowed"]);
                break;
        }
        break;
}
// Close the database connection
$conn->close();

// Authentication Functions
function handleRegister($data, $conn) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        sendResponse(400, ["error" => "Missing required fields"]);
        return;
    }
    
    // Check if username or email already exists
    $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $data['username'], $data['email']);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $row = $result->fetch_assoc();
    
    if ($row['count'] > 0) {
        sendResponse(400, ["error" => "Username or email already exists"]);
        return;
    }
    
    // Hash the password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Set default role if not provided
    $role = isset($data['role']) ? $data['role'] : 'patient';
    
    // Insert new user
    $sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $data['username'], $data['email'], $hashedPassword, $role);
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        sendResponse(201, ["success" => true, "user_id" => $userId]);
    } else {
        sendResponse(500, ["error" => "Registration failed: " . $stmt->error]);
    }
}

function handleLogin($endpoint, $data, $conn) {
    // Validate required fields
    if (!isset($data['credential']) || !isset($data['password'])) {
        sendResponse(400, ["error" => "Missing required fields"]);
        return;
    }
    
    // Determine login type
    $isPatientLogin = ($endpoint === "patient_login");
    
    // Special case for default admin
    if (!$isPatientLogin && $data['credential'] === 'admin' && $data['password'] === 'password') {
        // Check if admin exists in database
        $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = 'admin'";
        $result = $conn->query($checkSql);
        $row = $result->fetch_assoc();
        
        // If admin doesn't exist, create it
        if ($row['count'] == 0) {
            $hashedPassword = password_hash('password', PASSWORD_DEFAULT);
            $createSql = "INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@example.com', ?, 'admin')";
            $createStmt = $conn->prepare($createSql);
            $createStmt->bind_param("s", $hashedPassword);
            $createStmt->execute();
        }
        
        // Return admin data
        sendResponse(200, [
            "success" => true,
            "data" => [
                "user" => [
                    "id" => 1,
                    "username" => "admin",
                    "email" => "admin@example.com",
                    "role" => "admin"
                ]
            ]
        ]);
        return;
    }
    
    // Query for user
    if ($isPatientLogin) {
        // For patient login, use patient ID
        $sql = "SELECT u.id, u.username, u.email, u.password, u.role FROM users u 
                JOIN patient_profiles p ON u.id = p.user_id 
                WHERE p.id = ?";
    } else {
        // For admin login, use username
        $sql = "SELECT id, username, email, password, role FROM users 
                WHERE username = ? AND role IN ('admin', 'doctor', 'nurse')";
    }
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['credential']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        sendResponse(401, ["error" => "Invalid credentials"]);
        return;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($data['password'], $user['password'])) {
        sendResponse(401, ["error" => "Invalid credentials"]);
        return;
    }
    
    // Get profile data if patient
    $profile = null;
    if ($user['role'] === 'patient') {
        $profileSql = "SELECT * FROM patient_profiles WHERE user_id = ?";
        $profileStmt = $conn->prepare($profileSql);
        $profileStmt->bind_param("i", $user['id']);
        $profileStmt->execute();
        $profileResult = $profileStmt->get_result();
        
        if ($profileResult->num_rows > 0) {
            $profile = $profileResult->fetch_assoc();
        }
    }
    
    // Format response
    $response = [
        "success" => true,
        "data" => [
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]
    ];
    
    // Add profile data if available
    if ($profile) {
        $response['data']['profile'] = $profile;
    }
    
    sendResponse(200, $response);
}

// Handle GET requests
function handleGetRequest($endpoint, $id, $conn) {
    switch ($endpoint) {
        case "patient_profiles":
            if ($id) {
                getPatientProfile($id, $conn);
            } else {
                getAllPatientProfiles($conn);
            }
            break;
        case "medical_information":
            if ($id) {
                getMedicalInfo($id, $conn);
            } else {
                sendResponse(400, ["error" => "Patient ID is required"]);
            }
            break;
        case "caregivers":
            if ($id) {
                getCaregiverInfo($id, $conn);
            } else {
                sendResponse(400, ["error" => "Patient ID is required"]);
            }
            break;
        case "notification_settings":
            if ($id) {
                getNotificationSettings($id, $conn);
            } else {
                sendResponse(400, ["error" => "Patient ID is required"]);
            }
            break;
        default:
            sendResponse(404, ["error" => "Endpoint not found"]);
            break;
    }
}

// Handle POST requests
function handlePostRequest($endpoint, $data, $conn) {
    switch ($endpoint) {
        case "patient_profiles":
            createPatientProfile($data, $conn);
            break;
        case "medical_information":
            createMedicalInfo($data, $conn);
            break;
        case "caregivers":
            createCaregiverInfo($data, $conn);
            break;
        case "notification_settings":
            createNotificationSettings($data, $conn);
            break;
        default:
            sendResponse(404, ["error" => "Endpoint not found"]);
            break;
    }
}

// Handle PUT requests
function handlePutRequest($endpoint, $id, $data, $conn) {
    if (!$id) {
        sendResponse(400, ["error" => "ID is required for updates"]);
        return;
    }
    switch ($endpoint) {
        case "patient_profiles":
            updatePatientProfile($id, $data, $conn);
            break;
        case "medical_information":
            updateMedicalInfo($id, $data, $conn);
            break;
        case "caregivers":
            updateCaregiverInfo($id, $data, $conn);
            break;
        case "notification_settings":
            updateNotificationSettings($id, $data, $conn);
            break;
        default:
            sendResponse(404, ["error" => "Endpoint not found"]);
            break;
    }
}

// Handle DELETE requests
function handleDeleteRequest($endpoint, $id, $conn) {
    if (!$id) {
        sendResponse(400, ["error" => "ID is required for deletion"]);
        return;
    }
    switch ($endpoint) {
        case "patient_profiles":
            deletePatientProfile($id, $conn);
            break;
        case "medical_information":
            deleteMedicalInfo($id, $conn);
            break;
        case "caregivers":
            deleteCaregiverInfo($id, $conn);
            break;
        case "notification_settings":
            deleteNotificationSettings($id, $conn);
            break;
        default:
            sendResponse(404, ["error" => "Endpoint not found"]);
            break;
    }
}

// Patient Profile Functions
function getAllPatientProfiles($conn) {
    $sql = "SELECT * FROM patient_profiles";
    $result = $conn->query($sql);
    if ($result) {
        $profiles = [];
        while ($row = $result->fetch_assoc()) {
            $profiles[] = $row;
        }
        sendResponse(200, $profiles);
    } else {
        sendResponse(500, ["error" => "Error fetching patient profiles: " . $conn->error]);
    }
}

function getPatientProfile($id, $conn) {
    $sql = "SELECT * FROM patient_profiles WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        sendResponse(200, $profile);
    } else {
        sendResponse(404, ["error" => "Patient profile not found"]);
    }
}

function createPatientProfile($data, $conn) {
    // Generate a unique ID if not provided
    if (!isset($data['id']) || empty($data['id'])) {
        $data['id'] = generateUniqueId();
    }
    $sql = "INSERT INTO patient_profiles (id, user_id, first_name, middle_name, last_name, date_of_birth, phone, email, address, barangay, municipality, province, zip_code, emergency_contact_name, emergency_contact_phone, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sissssssssssssss", 
        $data['id'],
        $data['user_id'],
        $data['first_name'],
        $data['middle_name'],
        $data['last_name'],
        $data['date_of_birth'],
        $data['phone'],
        $data['email'],
        $data['address'],
        $data['barangay'],
        $data['municipality'],
        $data['province'],
        $data['zip_code'],
        $data['emergency_contact_name'],
        $data['emergency_contact_phone'],
        $data['profile_picture']
    );
    if ($stmt->execute()) {
        sendResponse(201, ["id" => $data['id'], "message" => "Patient profile created successfully"]);
    } else {
        sendResponse(500, ["error" => "Error creating patient profile: " . $stmt->error]);
    }
}

function updatePatientProfile($id, $data, $conn) {
    $sql = "UPDATE patient_profiles SET 
            first_name = ?, 
            middle_name = ?,
            last_name = ?, 
            date_of_birth = ?, 
            phone = ?, 
            email = ?, 
            address = ?, 
            barangay = ?,
            municipality = ?,
            province = ?,
            zip_code = ?, 
            emergency_contact_name = ?, 
            emergency_contact_phone = ?,
            profile_picture = ?
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssssss", 
        $data['first_name'],
        $data['middle_name'],
        $data['last_name'],
        $data['date_of_birth'],
        $data['phone'],
        $data['email'],
        $data['address'],
        $data['barangay'],
        $data['municipality'],
        $data['province'],
        $data['zip_code'],
        $data['emergency_contact_name'],
        $data['emergency_contact_phone'],
        $data['profile_picture'],
        $id
    );
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Patient profile updated successfully"]);
    } else {
        sendResponse(500, ["error" => "Error updating patient profile: " . $stmt->error]);
    }
}

function deletePatientProfile($id, $conn) {
    $sql = "DELETE FROM patient_profiles WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Patient profile deleted successfully"]);
    } else {
        sendResponse(500, ["error" => "Error deleting patient profile: " . $stmt->error]);
    }
}

// Medical Information Functions
function getMedicalInfo($patientId, $conn) {
    $sql = "SELECT * FROM medical_information WHERE patient_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $patientId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $medicalInfo = $result->fetch_assoc();
        sendResponse(200, $medicalInfo);
    } else {
        sendResponse(404, ["error" => "Medical information not found"]);
    }
}

function createMedicalInfo($data, $conn) {
    // Generate a unique ID if not provided
    if (!isset($data['id']) || empty($data['id'])) {
        $data['id'] = generateUniqueId();
    }
    $sql = "INSERT INTO medical_information (id, patient_id, dialysis_center, nephrologist, nephrology_clinic, dialysis_schedule, dry_weight, blood_type, allergies, medications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssssss", 
        $data['id'],
        $data['patient_id'],
        $data['dialysis_center'],
        $data['nephrologist'],
        $data['nephrology_clinic'],
        $data['dialysis_schedule'],
        $data['dry_weight'],
        $data['blood_type'],
        $data['allergies'],
        $data['medications']
    );
    if ($stmt->execute()) {
        sendResponse(201, ["id" => $data['id'], "message" => "Medical information created successfully"]);
    } else {
        sendResponse(500, ["error" => "Error creating medical information: " . $stmt->error]);
    }
}

function updateMedicalInfo($id, $data, $conn) {
    $sql = "UPDATE medical_information SET 
            dialysis_center = ?, 
            nephrologist = ?, 
            nephrology_clinic = ?, 
            dialysis_schedule = ?, 
            dry_weight = ?, 
            blood_type = ?, 
            allergies = ?, 
            medications = ? 
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", 
        $data['dialysis_center'],
        $data['nephrologist'],
        $data['nephrology_clinic'],
        $data['dialysis_schedule'],
        $data['dry_weight'],
        $data['blood_type'],
        $data['allergies'],
        $data['medications'],
        $id
    );
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Medical information updated successfully"]);
    } else {
        sendResponse(500, ["error" => "Error updating medical information: " . $stmt->error]);
    }
}

function deleteMedicalInfo($id, $conn) {
    $sql = "DELETE FROM medical_information WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Medical information deleted successfully"]);
    } else {
        sendResponse(500, ["error" => "Error deleting medical information: " . $stmt->error]);
    }
}

// Caregiver Information Functions
function getCaregiverInfo($patientId, $conn) {
    $sql = "SELECT * FROM caregivers WHERE patient_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $patientId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $caregiverInfo = $result->fetch_assoc();
        sendResponse(200, $caregiverInfo);
    } else {
        sendResponse(404, ["error" => "Caregiver information not found"]);
    }
}

function createCaregiverInfo($data, $conn) {
    // Generate a unique ID if not provided
    if (!isset($data['id']) || empty($data['id'])) {
        $data['id'] = generateUniqueId();
    }
    $sql = "INSERT INTO caregivers (id, patient_id, name, relationship, phone, email, address, notify_by_sms, notify_by_email, notify_before_session, notify_after_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssiiii", 
        $data['id'],
        $data['patient_id'],
        $data['name'],
        $data['relationship'],
        $data['phone'],
        $data['email'],
        $data['address'],
        $data['notify_by_sms'],
        $data['notify_by_email'],
        $data['notify_before_session'],
        $data['notify_after_session']
    );
    if ($stmt->execute()) {
        sendResponse(201, ["id" => $data['id'], "message" => "Caregiver information created successfully"]);
    } else {
        sendResponse(500, ["error" => "Error creating caregiver information: " . $stmt->error]);
    }
}

function updateCaregiverInfo($id, $data, $conn) {
    $sql = "UPDATE caregivers SET 
            name = ?, 
            relationship = ?, 
            phone = ?, 
            email = ?, 
            address = ?, 
            notify_by_sms = ?, 
            notify_by_email = ?, 
            notify_before_session = ?, 
            notify_after_session = ? 
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssiiiis", 
        $data['name'],
        $data['relationship'],
        $data['phone'],
        $data['email'],
        $data['address'],
        $data['notify_by_sms'],
        $data['notify_by_email'],
        $data['notify_before_session'],
        $data['notify_after_session'],
        $id
    );
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Caregiver information updated successfully"]);
    } else {
        sendResponse(500, ["error" => "Error updating caregiver information: " . $stmt->error]);
    }
}

function deleteCaregiverInfo($id, $conn) {
    $sql = "DELETE FROM caregivers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Caregiver information deleted successfully"]);
    } else {
        sendResponse(500, ["error" => "Error deleting caregiver information: " . $stmt->error]);
    }
}

// Notification Settings Functions
function getNotificationSettings($patientId, $conn) {
    $sql = "SELECT * FROM notification_settings WHERE patient_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $patientId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $settings = $result->fetch_assoc();
        sendResponse(200, $settings);
    } else {
        sendResponse(404, ["error" => "Notification settings not found"]);
    }
}

function createNotificationSettings($data, $conn) {
    // Generate a unique ID if not provided
    if (!isset($data['id']) || empty($data['id'])) {
        $data['id'] = generateUniqueId();
    }
    $sql = "INSERT INTO notification_settings (id, patient_id, email, phone, enable_email_notifications, enable_sms_notifications, medication_reminders, appointment_reminders, reminder_time, advance_notice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssiiiiis", 
        $data['id'],
        $data['patient_id'],
        $data['email'],
        $data['phone'],
        $data['enable_email_notifications'],
        $data['enable_sms_notifications'],
        $data['medication_reminders'],
        $data['appointment_reminders'],
        $data['reminder_time'],
        $data['advance_notice']
    );
    if ($stmt->execute()) {
        sendResponse(201, ["id" => $data['id'], "message" => "Notification settings created successfully"]);
    } else {
        sendResponse(500, ["error" => "Error creating notification settings: " . $stmt->error]);
    }
}

function updateNotificationSettings($id, $data, $conn) {
    $sql = "UPDATE notification_settings SET 
            email = ?, 
            phone = ?, 
            enable_email_notifications = ?, 
            enable_sms_notifications = ?, 
            medication_reminders = ?, 
            appointment_reminders = ?, 
            reminder_time = ?, 
            advance_notice = ? 
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiiiisss", 
        $data['email'],
        $data['phone'],
        $data['enable_email_notifications'],
        $data['enable_sms_notifications'],
        $data['medication_reminders'],
        $data['appointment_reminders'],
        $data['reminder_time'],
        $data['advance_notice'],
        $id
    );
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Notification settings updated successfully"]);
    } else {
        sendResponse(500, ["error" => "Error updating notification settings: " . $stmt->error]);
    }
}

function deleteNotificationSettings($id, $conn) {
    $sql = "DELETE FROM notification_settings WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        sendResponse(200, ["message" => "Notification settings deleted successfully"]);
    } else {
        sendResponse(500, ["error" => "Error deleting notification settings: " . $stmt->error]);
    }
}

// Helper Functions
function generateUniqueId() {
    return uniqid() . bin2hex(random_bytes(8));
}

function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>