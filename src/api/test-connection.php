<?php
// Enable CORS for development
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection parameters
$host = "localhost";
$username = "uipbsity_dialysis";
$password = "Hailhydra@123";
$database = "uipbsity_db_dialysis";

// Connect to database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
} else {
    // Test query to check if users table exists and is accessible
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        echo json_encode(["success" => true, "message" => "Connection successful", "user_count" => $row['count']]);
    } else {
        echo json_encode(["success" => false, "error" => "Could not query users table: " . $conn->error]);
    }
}

// Close the database connection
$conn->close();
?>