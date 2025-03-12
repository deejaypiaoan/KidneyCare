-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'admin', 'doctor', 'nurse') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create patient_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS patient_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(255) NOT NULL,
  barangay VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  emergency_contact_name VARCHAR(100) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create stored procedure for user registration
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS register_user(
  IN p_username VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE user_exists INT;
  
  -- Check if username or email already exists
  SELECT COUNT(*) INTO user_exists FROM users 
  WHERE username = p_username OR email = p_email;
  
  IF user_exists > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username or email already exists';
  ELSE
    -- Insert new user with hashed password
    INSERT INTO users (username, email, password, role)
    VALUES (p_username, p_email, p_password, 'patient');
    
    -- Return the new user ID
    SELECT LAST_INSERT_ID() AS user_id;
  END IF;
END //
DELIMITER ;

-- Create stored procedure for user login
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS login_user(
  IN p_credential VARCHAR(100),
  IN p_password VARCHAR(255),
  IN p_user_type VARCHAR(20)
)
BEGIN
  DECLARE user_id INT;
  DECLARE user_role VARCHAR(20);
  
  IF p_user_type = 'patient' THEN
    -- For patient login using patient ID
    SELECT u.id, u.role INTO user_id, user_role
    FROM users u
    JOIN patient_profiles p ON u.id = p.user_id
    WHERE p.id = p_credential AND u.password = p_password;
  ELSE
    -- For admin/staff login using username
    SELECT id, role INTO user_id, user_role
    FROM users
    WHERE username = p_credential AND password = p_password
    AND role IN ('admin', 'doctor', 'nurse');
  END IF;
  
  IF user_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid credentials';
  ELSE
    -- Return user information
    SELECT u.id, u.username, u.email, u.role,
           p.id AS profile_id, p.first_name, p.last_name, p.phone
    FROM users u
    LEFT JOIN patient_profiles p ON u.id = p.user_id
    WHERE u.id = user_id;
  END IF;
END //
DELIMITER ;

-- Create API endpoint handler for db-api.php
-- Add these endpoints to your PHP API:

/*
// Register endpoint
if ($endpoint === 'register') {
    // Get request data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    // Hash the password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    try {
        // Call the stored procedure
        $stmt = $conn->prepare("CALL register_user(?, ?, ?)");
        $stmt->bind_param("sss", $data['username'], $data['email'], $hashedPassword);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result) {
            $user = $result->fetch_assoc();
            echo json_encode(['success' => true, 'user_id' => $user['user_id']]);
        } else {
            throw new Exception("Registration failed");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Login endpoint
if ($endpoint === 'patient_login' || $endpoint === 'admin_login') {
    // Get request data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['credential']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $userType = $endpoint === 'patient_login' ? 'patient' : 'admin';
    
    try {
        // First get the user to verify password
        if ($userType === 'patient') {
            $stmt = $conn->prepare("SELECT u.id, u.password FROM users u JOIN patient_profiles p ON u.id = p.user_id WHERE p.id = ?");
        } else {
            $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ? AND role IN ('admin', 'doctor', 'nurse')");
        }
        
        $stmt->bind_param("s", $data['credential']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            exit;
        }
        
        $user = $result->fetch_assoc();
        
        // Verify password
        if (!password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            exit;
        }
        
        // Get full user data
        $stmt = $conn->prepare("CALL login_user(?, ?, ?)");
        $stmt->bind_param("sss", $data['credential'], $user['password'], $userType);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $userData = $result->fetch_assoc()) {
            // Format response
            $response = [
                'user' => [
                    'id' => $userData['id'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'role' => $userData['role']
                ]
            ];
            
            // Add profile data if available
            if ($userData['profile_id']) {
                $response['profile'] = [
                    'id' => $userData['profile_id'],
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'phone' => $userData['phone']
                ];
            }
            
            echo json_encode($response);
        } else {
            throw new Exception("Login failed");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
*/
