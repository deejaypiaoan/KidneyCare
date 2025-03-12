# Database Setup for Dialysis Patient Companion App

## Overview

This document provides instructions for setting up the MySQL database for the Dialysis Patient Companion App using cPanel.

## Database Connection Details

- **Host**: uipbsit2y.org
- **Database Name**: uipbsity_db_dialysis
- **Username**: uipbsity_dialysis
- **Password**: Hailhydra@123

## Setup Instructions

### 1. Access cPanel

1. Log in to your cPanel account
2. Navigate to the MySQL Databases section

### 2. Create Database Tables

1. Click on phpMyAdmin in the cPanel dashboard
2. Select the `uipbsity_db_dialysis` database from the left sidebar
3. Click on the SQL tab
4. Copy and paste the SQL commands from the `database-setup.sql` file
5. Click "Go" to execute the SQL commands

### 3. Upload the PHP API File

1. In cPanel, navigate to File Manager
2. Go to the public_html directory (or create an 'api' subdirectory)
3. Upload the `db-api.php` file from the `src/api` directory
4. Set the file permissions to 644 (readable by everyone, writable only by owner)

### 4. Test the API

Test the API by making a GET request to:

```
https://uipbsit2y.org/api/db-api.php?endpoint=patient_profiles
```

Or if you placed it directly in public_html:

```
https://uipbsit2y.org/db-api.php?endpoint=patient_profiles
```

You should receive a JSON response with an empty array or any existing patient profiles.

## Database Schema

The database includes the following tables:

1. **patient_profiles** - Stores basic patient information
2. **medical_information** - Stores medical details for each patient
3. **caregivers** - Stores information about patient caregivers
4. **notification_settings** - Stores notification preferences
5. **health_metrics** - Stores patient health measurements
6. **fluid_entries** - Tracks fluid intake
7. **medications** - Stores medication information
8. **medication_logs** - Tracks medication adherence
9. **appointments** - Stores appointment information
10. **dialysis_sessions** - Tracks dialysis sessions
11. **food_entries** - Tracks nutritional information

## API Endpoints

The PHP API provides the following endpoints:

### Patient Profiles
- GET `/api/db-api.php?endpoint=patient_profiles` - Get all patient profiles
- GET `/api/db-api.php?endpoint=patient_profiles&id={id}` - Get a specific patient profile
- POST `/api/db-api.php?endpoint=patient_profiles` - Create a new patient profile
- PUT `/api/db-api.php?endpoint=patient_profiles&id={id}` - Update a patient profile
- DELETE `/api/db-api.php?endpoint=patient_profiles&id={id}` - Delete a patient profile

### Medical Information
- GET `/api/db-api.php?endpoint=medical_information&id={patient_id}` - Get medical info for a patient
- POST `/api/db-api.php?endpoint=medical_information` - Create medical info
- PUT `/api/db-api.php?endpoint=medical_information&id={id}` - Update medical info
- DELETE `/api/db-api.php?endpoint=medical_information&id={id}` - Delete medical info

### Caregivers
- GET `/api/db-api.php?endpoint=caregivers&id={patient_id}` - Get caregiver info for a patient
- POST `/api/db-api.php?endpoint=caregivers` - Create caregiver info
- PUT `/api/db-api.php?endpoint=caregivers&id={id}` - Update caregiver info
- DELETE `/api/db-api.php?endpoint=caregivers&id={id}` - Delete caregiver info

### Notification Settings
- GET `/api/db-api.php?endpoint=notification_settings&id={patient_id}` - Get notification settings for a patient
- POST `/api/db-api.php?endpoint=notification_settings` - Create notification settings
- PUT `/api/db-api.php?endpoint=notification_settings&id={id}` - Update notification settings
- DELETE `/api/db-api.php?endpoint=notification_settings&id={id}` - Delete notification settings

## Security Considerations

1. The API currently uses basic authentication with the database credentials
2. In a production environment, consider implementing:
   - API keys or JWT authentication
   - HTTPS for all API requests
   - Rate limiting to prevent abuse
   - Input validation and sanitization

## Troubleshooting

- If you encounter database connection issues, verify the database credentials
- Check PHP error logs in cPanel for detailed error messages
- Ensure the API file has the correct permissions
- Verify that the database tables were created correctly
