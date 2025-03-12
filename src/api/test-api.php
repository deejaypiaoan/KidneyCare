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

// Simple test endpoint
echo json_encode([
    "success" => true,
    "message" => "API is working",
    "timestamp" => date("Y-m-d H:i:s"),
    "server_info" => [
        "php_version" => PHP_VERSION,
        "server_software" => $_SERVER['SERVER_SOFTWARE'],
        "request_method" => $_SERVER['REQUEST_METHOD'],
        "request_time" => date("Y-m-d H:i:s", $_SERVER['REQUEST_TIME'])
    ]
]);
?>