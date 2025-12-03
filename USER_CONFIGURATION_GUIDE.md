# User Configuration & Patient-Clinician Mapping Guide

## Overview
This document explains how user registration, patient-clinician mapping, and patient profile management work in the Diabetes Monitoring Hub.

## 1. User Registration

### Backend Endpoint
- **POST** `/api/auth/register`
- **Controller**: `AuthController.java`
- **Service**: `AuthService`

### Registration Process
1. User provides registration details (email, password, full name, phone, role)
2. Backend creates a `User` entity with:
   - `email` (unique)
   - `passwordHash` (encrypted)
   - `fullName`
   - `phone`
   - `role` ("PATIENT" or "CLINICIAN")
   - `isActive` (default: true)
   - `isConsentGiven` (default: false)
3. A `UserProfile` entity is also created with:
   - `dob` (date of birth)
   - `sex` ('F', 'M', or 'X')
   - `timezone`

### Frontend
Currently, there is **NO registration UI** in the frontend. Users must be created via:
- Direct API calls (Postman, curl, etc.)
- Database seeding scripts
- Admin panel (if implemented)

## 2. Patient-Clinician Mapping

### Backend Endpoint
- **POST** `/api/links/patient-clinician`
- **Controller**: `PatientClinicianController.java`
- **Service**: `PatientClinicianService`

### Linking Process
1. An admin or clinician creates a link between a patient and clinician
2. Request body:
   ```json
   {
     "patientId": "uuid-of-patient",
     "clinicianId": "uuid-of-clinician"
   }
   ```
3. Backend creates a `PatientClinician` entity with:
   - `patientId`
   - `clinicianId`
   - `status` ("ACTIVE", "INACTIVE", or "PENDING")
   - `linkedAt` (timestamp)

### Querying Links
- **GET** `/api/links/patients/{patientId}` - Get all clinicians for a patient
- **GET** `/api/links/clinicians/{clinicianId}` - Get all patients for a clinician

### Frontend
Currently, there is **NO UI** for creating patient-clinician links. Links must be created via:
- Direct API calls
- Database scripts
- Admin panel (if implemented)

## 3. How Clinicians Edit Patient Details

### Current Implementation
Clinicians can view patient details but **CANNOT directly edit** patient profile information (name, email, phone, dob, sex).

### Patient Profile Editing
- **Endpoint**: `PUT /api/patients/{patientId}`
- **Controller**: `PatientController.java`
- **Editable Fields**: 
  - `phone` (via `PatientUpdateRequest`)
  - Other fields are read-only

### What Clinicians CAN Do
1. **View Patient Data**: Full access to patient's health data (glucose, meals, medications, symptoms)
2. **Add Clinician Notes**: Create notes about patient care
3. **Send Messages**: Communicate with patients via quick messages
4. **View Reports**: Generate and view patient reports

### What Clinicians CANNOT Do
- Edit patient's personal information (name, email, dob, sex)
- Delete patient accounts
- Change patient passwords

## 4. Current Limitations & Recommendations

### Missing Features
1. **No Registration UI**: Need to add signup pages for both patients and clinicians
2. **No Admin Panel**: No way to manage user accounts and links from the UI
3. **No Patient-Clinician Link UI**: Clinicians cannot add patients through the app
4. **No Patient Profile Editing by Clinician**: Clinicians cannot update patient contact info

### Recommended Implementations

#### Option 1: Self-Service Registration
- Add registration pages for patients and clinicians
- Patients can register themselves
- Clinicians register and wait for admin approval
- Patients can search for and request to link with clinicians
- Clinicians approve/reject link requests

#### Option 2: Clinician-Managed Registration
- Only clinicians can register (with admin approval)
- Clinicians can create patient accounts
- Clinicians automatically linked to patients they create
- Patients receive invitation emails with login credentials

#### Option 3: Admin-Managed System
- Create an admin dashboard
- Admin creates all user accounts
- Admin manages patient-clinician links
- Most secure but requires admin involvement

## 5. Database Schema Reference

### User Table
- `id` (UUID, PK)
- `email` (unique)
- `passwordHash`
- `fullName`
- `phone`
- `role` ("PATIENT", "CLINICIAN", "ADMIN")
- `isActive`
- `isConsentGiven`
- `createdAt`
- `updatedAt`

### UserProfile Table
- `id` (UUID, PK)
- `userId` (FK to User)
- `dob` (LocalDate)
- `sex` (String: 'F', 'M', 'X')
- `timezone`
- `createdAt`
- `updatedAt`

### PatientClinician Table
- `id` (UUID, PK)
- `patientId` (FK to User)
- `clinicianId` (FK to User)
- `status` ("ACTIVE", "INACTIVE", "PENDING")
- `linkedAt`
- `updatedAt`

## 6. API Testing Examples

### Register a New Patient
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "role": "PATIENT"
  }'
```

### Link Patient to Clinician
```bash
curl -X POST http://localhost:8080/api/links/patient-clinician \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patientId": "patient-uuid-here",
    "clinicianId": "clinician-uuid-here"
  }'
```

### Get Clinician's Patients
```bash
curl -X GET http://localhost:8080/api/links/clinicians/{clinicianId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 7. Next Steps

To fully implement user management:
1. Create registration UI components
2. Add patient-clinician linking UI for clinicians
3. Implement admin dashboard (optional)
4. Add email verification for new accounts
5. Implement password reset functionality
6. Add user profile editing capabilities
