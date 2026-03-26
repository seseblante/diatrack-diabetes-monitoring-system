# DiaTrack: Mobile Diabetes Monitoring System

A client-facing mHealth web application for bridging the gap between patients and clinicians in diabetes management.

**[Live Demo](https://diatrack-diabetes-monitoring-system.vercel.app)**

> **Note:** The backend is hosted on a free tier and cannot be tested immediately since I do not handle the Render account that this is hosted on. For immediate testing, you may check out the [documentation](https://drive.google.com/drive/folders/11pZ0Q13AbWc55EyXlhlpKEvgr5c8kGr8?usp=sharing).

## Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `alice@patient.com` | `alice123` |
| **Clinician** | `dr.strange@clinic.com` | `drstrange123` |

## My Role

This was a collaborative school project for CMSC 128.2 (Software Engineering II) at the University of the Philippines Manila, developed with two teammates for a client stakeholder.

I was responsible for:
* **Database Design:** Designing the full PostgreSQL database schema (15+ tables including users, glucose readings, medication regimens, alerts, and messaging).
* **Backend Development:** Building the entire Spring Boot backend, including RESTful API endpoints, service logic, and data access layers.
* **Security:** Implementing Spring Security with JWT for role-based authentication (Patient and Clinician roles).
* **Business Logic:** Writing the alert generation logic for critical glucose threshold detection.
* **Project Management:** Leading client requirements gathering, translating medical workflows into technical specifications, and serving as project lead to coordinate task distribution and deliverables.

## What It Does

DiaTrack is a web-based mobile health application that converts fragmented paper-based diabetes records into structured digital data, enabling real-time monitoring and communication between patients and their clinicians.

### For Patients:
* Log blood glucose readings, meals, medications, and symptoms via a Quick Log interface.
* View 7-day and 30-day glucose trends and Time-in-Range statistics.
* Export health summaries as PDF reports.
* Message their linked clinician securely.

### For Clinicians:
* Monitor a live patient roster with real-time glucose status and alerts.
* Manage medication regimens and clinical notes per patient.
* Receive automatic alerts for severe hypoglycemic or hyperglycemic events.
* Manage clinic details, schedules, and appointment information.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Recharts |
| **Backend** | Spring Boot (Java 21), Spring Security |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (frontend), Render via Docker (backend) |

## Architecture Highlights

* Client-server SPA with a React frontend communicating to a Spring Boot backend via HTTPS RESTful APIs.
* Role-based access control enforced at the API level; patients can only access their own data, clinicians can only view linked patients.
* Referential integrity maintained throughout the PostgreSQL schema with cascading deletes.
* Alert system triggered automatically when glucose readings breach defined clinical thresholds.
* Mobile-optimized UI designed for 375x812px viewports.

## Running Locally

**Requirements:**
* Java JDK 21
* Node.js 18+
* PostgreSQL (running on port 5432)

```bash
# Clone the repository
git clone [https://github.com/seseblante/diatrack-diabetes-monitoring-system](https://github.com/seseblante/diatrack-diabetes-monitoring-system)

# --- Backend Setup ---
cd backend
./mvnw spring-boot:run

# --- Frontend Setup ---
cd ../frontend
npm install
npm run dev
```

## Team
Built by Arianne Jayne Acosta, Kristine Joy Arellano, and Sheianne Deeno Seblante under the guidance of Dr. Ma. Sheila A. Magboo and Prof. Perlita E. Gasmen.

Original (private) repository: adacosta-3/DiabetesMonitoringHub
