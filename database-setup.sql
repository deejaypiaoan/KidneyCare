-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'admin', 'doctor', 'nurse') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create patient_profiles table
CREATE TABLE IF NOT EXISTS patient_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other') DEFAULT 'male',
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

-- Create medical_information table
CREATE TABLE IF NOT EXISTS medical_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  dialysis_center VARCHAR(100) NOT NULL,
  nephrologist VARCHAR(100) NOT NULL,
  nephrology_clinic VARCHAR(100) NOT NULL,
  dialysis_schedule VARCHAR(255) NOT NULL,
  dry_weight VARCHAR(20) NOT NULL,
  blood_type VARCHAR(5) NOT NULL,
  allergies TEXT,
  medications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create caregivers table
CREATE TABLE IF NOT EXISTS caregivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  notify_by_sms TINYINT(1) DEFAULT 1,
  notify_by_email TINYINT(1) DEFAULT 1,
  notify_before_session TINYINT(1) DEFAULT 1,
  notify_after_session TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  enable_email_notifications TINYINT(1) DEFAULT 1,
  enable_sms_notifications TINYINT(1) DEFAULT 1,
  medication_reminders TINYINT(1) DEFAULT 1,
  appointment_reminders TINYINT(1) DEFAULT 1,
  reminder_time VARCHAR(10) DEFAULT '1',
  advance_notice VARCHAR(10) DEFAULT '24',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  metric_date DATE NOT NULL,
  metric_time TIME NOT NULL,
  blood_pressure_systolic INT NOT NULL,
  blood_pressure_diastolic INT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  oxygen_level INT NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  type ENUM('dialysis', 'checkup', 'other') NOT NULL DEFAULT 'dialysis',
  notes TEXT,
  reminder_sent TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create dialysis_sessions table
CREATE TABLE IF NOT EXISTS dialysis_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration INT, -- in minutes
  pre_weight DECIMAL(5,2),
  post_weight DECIMAL(5,2),
  blood_pressure_pre VARCHAR(20),
  blood_pressure_post VARCHAR(20),
  notes TEXT,
  assistant_notified TINYINT(1) DEFAULT 0,
  status ENUM('scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  time_of_day VARCHAR(255) NOT NULL, -- JSON array of times
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  reminders TINYINT(1) DEFAULT 1,
  reminder_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create medication_logs table
CREATE TABLE IF NOT EXISTS medication_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medication_id INT NOT NULL,
  taken_date DATE NOT NULL,
  taken_time TIME NOT NULL,
  status ENUM('taken', 'missed', 'skipped') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

-- Create fluid_entries table
CREATE TABLE IF NOT EXISTS fluid_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  entry_date DATE NOT NULL,
  entry_time TIME NOT NULL,
  amount INT NOT NULL, -- in ml
  type VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create food_entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  entry_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  food_name VARCHAR(100) NOT NULL,
  serving_size VARCHAR(50) NOT NULL,
  calories INT NOT NULL,
  protein DECIMAL(5,1) NOT NULL,
  sodium INT NOT NULL,
  potassium INT NOT NULL,
  phosphorus INT NOT NULL,
  fluid DECIMAL(3,1) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
);

-- Create admin user for testing
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Password is 'password'

-- Create doctor user for testing
INSERT INTO users (username, email, password, role)
VALUES ('doctor', 'doctor@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
-- Password is 'password'