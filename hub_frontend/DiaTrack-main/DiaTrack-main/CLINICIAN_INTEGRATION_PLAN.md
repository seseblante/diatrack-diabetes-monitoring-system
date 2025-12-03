# Clinician Dashboard Integration Plan

## 🎯 BACKEND ENDPOINTS AVAILABLE

### Patient Management
- `GET /api/links/clinicians/{clinicianId}` - Get all patients for a clinician
- `POST /api/links/patient-clinician` - Create patient-clinician link

### Patient Data Access
- `GET /api/patients/{patientId}/glucose` - Get patient glucose readings
- `GET /api/patients/{patientId}/logs/meals` - Get patient meals
- `GET /api/patients/{patientId}/medications/regimens` - Get patient medications
- `GET /api/patients/{patientId}/medications/logs` - Get patient medication logs
- `GET /api/patients/{patientId}/targets` - Get patient target ranges
- `POST /api/patients/{patientId}/targets` - Set patient target ranges

### Messaging
- `GET /api/messages/link/{linkId}` - Get messages for a patient
- `POST /api/messages/link/{linkId}` - Send message to patient
- `POST /api/messages/link/{linkId}/read` - Mark messages as read

### Notes
- `GET /api/notes/link/{linkId}` - Get clinician notes for a patient
- `POST /api/notes/link/{linkId}` - Create note for patient
- `PUT /api/notes/{noteId}` - Update note
- `DELETE /api/notes/{noteId}` - Delete note

### Alerts
- `GET /api/alerts/patient/{patientId}` - Get alerts for a patient
- `POST /api/alerts/{alertId}/acknowledge` - Acknowledge alert

### Educational Resources
- `GET /api/education/resources` - Get educational resources

## 📋 COMPONENTS TO CONNECT

### 1. ClinicianDashboard (Main)
**Hardcoded Data:**
- Patient list with mock data
- Patient stats (time in range, trends, etc.)

**Backend Integration:**
- Fetch patients from `/api/links/clinicians/{id}`
- For each patient, fetch their latest glucose reading
- Calculate stats from patient data
- Fetch alerts for each patient

### 2. ClinicianMessaging
**Hardcoded Data:**
- Message list

**Backend Integration:**
- Fetch messages from `/api/messages/link/{linkId}`
- Send messages via POST
- Mark as read

### 3. ClinicianAppointments
**Hardcoded Data:**
- Appointment list

**Backend Integration:**
- May need to stay hardcoded if no backend support
- Or use patient links with next appointment dates

### 4. ClinicianClinicSchedule
**Hardcoded Data:**
- Clinic schedule and contact info

**Backend Integration:**
- Likely stays hardcoded (static clinic info)

## ✅ API SERVICES CREATED
- ✅ `/api/clinician.ts` - Patient links and notes
- ✅ `/api/client.ts` - Added DELETE method
- ✅ Can reuse existing services for glucose, meals, medications

## 🔄 INTEGRATION STEPS

1. **ClinicianDashboard**
   - Add state for patients, loading, error
   - Fetch patients on mount
   - For each patient, fetch latest glucose + calculate stats
   - Update patient list UI to use backend data
   - Update patient detail modal to use backend data

2. **ClinicianMessaging**
   - Similar to PatientMessaging
   - Fetch messages for selected patient link
   - Send messages to patient
   - Mark as read

3. **Patient Detail View**
   - Fetch patient glucose history
   - Fetch patient meals
   - Fetch patient medications
   - Display clinician notes
   - Allow adding/editing notes

4. **Verify Everything Works**
   - Test patient list loading
   - Test patient selection
   - Test messaging
   - Test note creation/editing
