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
file_put_contents("login_log.txt", date("Y-m-d H:i:s") . " - Received data: " . $jsonData . "\n", FILE_APPEND);

// Validate required fields
if (!isset($data['credential']) || !isset($data['password'])) {
    sendResponse(400, ["success" => false, "error" => "Missing required fields"]);
    exit();
}

// Special case for admin login
if ($data['credential'] === 'admin' && $data['password'] === 'password') {
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
    exit();
}

// Query for user by username
$sql = "SELECT id, username, email, password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $data['credential']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(401, ["success" => false, "error" => "Invalid credentials"]);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($data['password'], $user['password'])) {
    // For testing, also check plain text password
    if ($data['password'] !== $user['password']) {
        sendResponse(401, ["success" => false, "error" => "Invalid credentials"]);
        exit();
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

sendResponse(200, $response);

// Close the database connection
$conn->close();

function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>