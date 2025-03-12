<?php
// This is a CORS proxy script that should be uploaded to your cPanel server
// It will forward requests to your database API while handling CORS headers

// Enable CORS for all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the target endpoint and action from the request
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : 'query';

// Database connection parameters
$host = "localhost";
$username = "uipbsity_dialysis";
$password = "Hailhydra@123";
$database = "uipbsity_db_dialysis";

// Connect to database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get JSON data from request body
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

// Log the received data for debugging
file_put_contents("cors_proxy_log.txt", date("Y-m-d H:i:s") . " - Endpoint: {$endpoint}, Action: {$action}, Data: " . $jsonData . "\n", FILE_APPEND);

// Process based on endpoint and action
switch ($endpoint) {
    case 'users':
        if ($action === 'register') {
            handleRegister($conn, $data);
        } elseif ($action === 'login') {
            handleLogin($conn, $data);
        } else {
            sendResponse(false, "Invalid action for users endpoint");
        }
        break;
    
    case 'test':
        // Simple test endpoint
        sendResponse(true, "CORS proxy is working correctly", ["timestamp" => date("Y-m-d H:i:s")]);
        break;
        
    default:
        sendResponse(false, "Invalid endpoint");
        break;
}

// Close the database connection
$conn->close();

// Helper function to send JSON response
function sendResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    $response = ["success" => $success, "message" => $message];
    if ($data !== null) {
        $response["data"] = $data;
    }
    echo json_encode($response);
    exit();
}

// Handle user registration
function handleRegister($conn, $data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
        sendResponse(false, "Missing required fields");
    }

    // Check if username or email already exists
    $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $data['username'], $data['email']);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        sendResponse(false, "Username or email already exists");
    }

    // For simplicity, we're storing the password as plain text for testing
    // In production, you should hash the password
    $password = $data['password']; // For testing only

    // Insert new user
    $sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $data['username'], $data['email'], $password, $data['role']);

    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        sendResponse(true, "Registration successful", ["user_id" => $userId]);
    } else {
        sendResponse(false, "Registration failed: " . $stmt->error);
    }
}

// Handle user login
function handleLogin($conn, $data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['password'])) {
        sendResponse(false, "Missing required fields");
    }

    // Special case for admin login
    if ($data['username'] === 'admin' && $data['password'] === 'password') {
        sendResponse(true, "Admin login successful", [
            "user" => [
                "id" => 1,
                "username" => "admin",
                "email" => "admin@example.com",
                "role" => "admin"
            ]
        ]);
    }

    // Query for user by username
    $sql = "SELECT id, username, email, password, role FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse(false, "Invalid credentials");
    }

    $user = $result->fetch_assoc();

    // For testing purposes, allow plain text password comparison
    if ($data['password'] === $user['password']) {
        sendResponse(true, "Login successful", [
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        sendResponse(false, "Invalid credentials");
    }
}
