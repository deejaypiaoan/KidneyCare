<?php
// Enable CORS for all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the target endpoint from the request
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

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
file_put_contents("proxy_log.txt", date("Y-m-d H:i:s") . " - Endpoint: {$endpoint}, Data: " . $jsonData . "\n", FILE_APPEND);

// Process based on endpoint
switch ($endpoint) {
    case 'register':
        handleRegister($conn, $data);
        break;
    case 'login':
        handleLogin($conn, $data);
        break;
    default:
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Invalid endpoint"]);
        break;
}

// Close the database connection
$conn->close();

// Handle user registration
function handleRegister($conn, $data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit();
    }

    // Check if username or email already exists
    $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $data['username'], $data['email']);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Username or email already exists"]);
        exit();
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
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true, 
            "message" => "Registration successful",
            "user_id" => $userId
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
    }
}

// Handle user login
function handleLogin($conn, $data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['password'])) {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit();
    }

    // Special case for admin login
    if ($data['username'] === 'admin' && $data['password'] === 'password') {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => 1,
                "username" => "admin",
                "email" => "admin@example.com",
                "role" => "admin"
            ]
        ]);
        exit();
    }

    // Query for user by username
    $sql = "SELECT id, username, email, password, role FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        exit();
    }

    $user = $result->fetch_assoc();

    // For testing purposes, allow plain text password comparison
    if ($data['password'] === $user['password']) {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
}
