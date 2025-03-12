<?php
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

// Get JSON data from request body
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

// Log the received data
file_put_contents("register_log.txt", date("Y-m-d H:i:s") . " - Received data: " . $jsonData . "\n", FILE_APPEND);

// Validate required fields
if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    sendResponse(400, ["success" => false, "error" => "Missing required fields"]);
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
    sendResponse(400, ["success" => false, "error" => "Username or email already exists"]);
    exit();
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
    sendResponse(500, ["success" => false, "error" => "Registration failed: " . $stmt->error]);
}

// Close the database connection
$conn->close();

function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>