<?php
// Enable CORS for all origins during development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get JSON data from request body
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

// Log the received data for debugging
file_put_contents("direct_login_log.txt", date("Y-m-d H:i:s") . " - Received data: " . $jsonData . "\n", FILE_APPEND);

// Validate required fields
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Special case for admin login
if ($data['username'] === 'admin' && $data['password'] === 'password') {
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
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit();
}

$user = $result->fetch_assoc();

// For testing purposes, allow plain text password comparison
// In production, you should only use password_verify
if ($data['password'] === $user['password'] || password_verify($data['password'], $user['password'])) {
    // Format response
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
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}

// Close the database connection
$conn->close();
?>