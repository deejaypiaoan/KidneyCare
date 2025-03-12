<?php
// Simple CORS proxy that should work in any PHP environment

// Enable CORS for all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple test endpoint to verify the proxy is working
echo json_encode([
    "success" => true,
    "message" => "Simple proxy is working",
    "timestamp" => date("Y-m-d H:i:s")
]);
