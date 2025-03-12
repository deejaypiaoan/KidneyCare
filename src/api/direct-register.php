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
file_put_contents("direct_register_log.txt", date("Y-m-d H:i:s") . " - Received data: " . $jsonData . "\n", FILE_APPEND);

// Validate required fields
if (!isset($data['username']) || !isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
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
    echo json_encode([
        "success" => true, 
        "message" => "Registration successful",
        "user_id" => $userId
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
}

// Close the database connection
$conn->close();
?>