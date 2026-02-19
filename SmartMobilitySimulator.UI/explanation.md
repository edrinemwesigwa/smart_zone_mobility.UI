# Smart Mobility Simulator - Technical Explanation

## Overview

This document explains the Smart Mobility Simulator application - a congestion pricing decision-support system designed for UAE transport authorities.

## What is Congestion Pricing?

Congestion pricing is a traffic management strategy where drivers are charged fees for entering busy areas during peak hours. This encourages:
- Route diversification
- Public transport usage
- Off-peak travel
- Reduced traffic congestion

Examples: Singapore, London, Stockholm, Milan

---

## System Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Angular 17 | User interface |
| Backend | ASP.NET Core 8.0 | Business logic & API |
| Database | SQL Server | Data storage |
| Maps | Leaflet | Geographic visualization |

### Project Structure

```
├── SmartZoneSimulator.UI/          # Angular Frontend
│   ├── src/app/
│   │   ├── components/             # UI pages
│   │   │   ├── home/              # Landing page
│   │   │   ├── login/             # Authentication
│   │   │   ├── user-management/   # Admin user mgmt
│   │   │   ├── zone-editor/       # Zone creation
│   │   │   ├── simulation-controls/ # Run simulations
│   │   │   ├── results-dashboard/ # View results
│   │   │   └── ...
│   │   ├── services/              # API communication
│   │   └── models/                # Data structures
│
└── SmartZoneSimulator.Backend/    # .NET Backend
    ├── SmartZoneSimulator.API/    # Web API
    │   ├── Controllers/           # API endpoints
    │   ├── Services/              # Business logic
    │   └── Models/               # DTOs & entities
    ├── SmartZoneSimulator.Domain/ # Domain entities
    └── SmartZoneSimulator.Infrastructure/ # External APIs
```

---

## Features

### 1. Authority Selection
The system supports three UAE transport authorities:
- **RTA Dubai** - Roads & Transport Authority
- **ITC Abu Dhabi** - Integrated Transport Centre  
- **SRTA Sharjah** - Sharjah Roads & Transport Authority

Each authority has different:
- Geographic zones
- Pricing strategies
- Traffic patterns
- Strategic targets

### 2. Zone Management
Create congestion pricing zones with:
- Name and location (emirate)
- Zone type (residential, commercial, mixed)
- Hourly charges
- Peak hour definitions

### 3. Traffic Simulation
The simulation engine calculates:
- Total vehicles in zone
- Vehicles that divert (avoid charges)
- Congestion reduction percentage
- Estimated revenue
- Environmental impact (emissions)
- Equity impact (income group burden)

### 4. Reports & Documents

| Document | Format | Description |
|----------|--------|-------------|
| Pilot Proposal | PDF | Detailed pilot program plan |
| Business Case | PDF | ROI and financial analysis |
| Pitch Deck | PPTX | Executive presentation |
| Authority Report | PDF | Authority-specific analysis |

### 5. Equity Analysis
Tracks burden ratio between low-income and high-income groups. Shows warnings if pricing is "regressive" (>2x burden disparity).

---

## User Management & Security

### Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Full access, user management, audit logs |
| **Editor** | Create/edit zones, run simulations |
| **Viewer** | View-only access |

### Authentication Flow
1. User logs in with email/password
2. Server validates credentials
3. Returns JWT token (1-hour expiry)
4. Refresh token for persistent sessions
5. Token included in API requests

### Security Features
- ✅ Password hashing (SHA256 + salt)
- ✅ Account lockout (5 failed attempts → 15 min lockout)
- ✅ Password reset with time-limited tokens
- ✅ Password change functionality
- ✅ Audit logging (all actions tracked)
- ✅ JWT token authentication

---

## How to Use

### Running the Application

#### Option 1: Docker (Recommended for Sharing)
```bash
# Build and run all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:5000
# SQL Server: localhost:1433
```

#### Option 2: Local Development
```bash
# Backend
cd SmartZoneSimulator.Backend/SmartZoneSimulator.API
dotnet run

# Frontend (new terminal)
cd SmartZoneSimulator.UI
npm start
```

### Default Login
```
Email: admin@smartMobility.ae
Password: admin
```

---

## Docker Deployment - Sharing with Others

The Docker setup makes it easy to share the application with your uncle:

### Prerequisites
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Steps
1. Copy these files to a USB drive or share folder:
   - `docker-compose.yml`
   - `Dockerfile`
   - `nginx.conf`

2. Also copy the backend folder (or build the image)

3. On the target machine:
   ```bash
   docker-compose up -d
   ```

4. Open browser to `http://localhost:4200`

### Ports Used
| Port | Service |
|------|---------|
| 4200 | Frontend (Angular) |
| 5000 | Backend API |
| 1433 | SQL Server |

---

## API Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:5000/swagger
- Displays all API endpoints
- Try requests directly from browser

---

## Internationalization

### Languages
- **English** (default)
- **Arabic** (العربية) - Full RTL support

### Switching Languages
Click the language dropdown in the navigation bar. Your preference is saved.

---

## Data Export

Export data in multiple formats:
- **CSV** - For Excel/spreadsheets
- **Excel** - Formatted Excel files  
- **JSON** - Raw data export

---

## Recent Updates (v1.1.0)

### Security Enhancements
- Account lockout after 5 failed login attempts
- Password reset functionality
- Password change feature
- Comprehensive audit logging

### Developer Experience
- Swagger API documentation
- Docker containerization
- Response caching

### Internationalization
- Arabic language support
- Language switcher component
- RTL layout support

### Data & Analytics
- CSV/Excel/JSON export
- WebSocket service for real-time updates
- SignalR infrastructure ready

---

## Troubleshooting

### Backend won't start
- Check SQL Server is running
- Verify connection string in appsettings.json
- Check port 5000 is available

### Frontend shows errors
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in environment.ts

### Docker issues
- Ensure Docker Desktop is running
- Check port conflicts
- Try: `docker-compose down && docker-compose up -d`

---

## Support

For technical questions or issues, check:
1. Backend logs in terminal
2. Browser developer console (F12)
3. Swagger API docs at /swagger

---

**Document Version**: 1.1  
**Last Updated**: February 15, 2026
**Author**: Smart Mobility Simulator Team
