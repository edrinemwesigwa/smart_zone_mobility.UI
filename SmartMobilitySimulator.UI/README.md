# Smart Mobility Simulator

A comprehensive congestion pricing decision-support system for UAE transport authorities (RTA Dubai, ITC Abu Dhabi, SRTA Sharjah).

## Overview

Smart Mobility Simulator enables transportation authorities to model, simulate, and analyze the impact of congestion pricing strategies on traffic flow, revenue, environmental factors, and social equity.

## Features

### Core Functionality
- **Zone-Based Traffic Simulation**: Create and manage congestion pricing zones across UAE emirates
- **Multi-Authority Support**: Support for RTA Dubai, ITC Abu Dhabi, and SRTA Sharjah
- **Pilot Proposal Generation**: Generate detailed pilot proposals with financials and risk assessments
- **Business Case Analysis**: Comprehensive business case documentation with ROI calculations
- **Pitch Deck Generator**: Export professional presentations (PPTX) and reports (PDF)
- **Equity Analysis**: Track burden ratio between income groups with regressive pricing warnings

### Security & User Management
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Three roles - Admin, Editor, Viewer
- **Account Lockout**: Automatic lockout after 5 failed login attempts (15 minutes)
- **Password Reset**: Secure password reset with time-limited tokens
- **Password Change**: Users can change their passwords anytime
- **Audit Logging**: Comprehensive logging of all user actions

### Developer Features
- **Swagger API Documentation**: Full API documentation at `/swagger`
- **Docker Support**: Containerized deployment for easy sharing
- **Response Caching**: Optimized API performance

### Internationalization
- **Multi-Language Support**: English and Arabic (العربية)
- **RTL Support**: Full right-to-left layout support for Arabic

### Data Export
- **CSV Export**: Export data to CSV format
- **Excel Export**: Export to Excel format
- **JSON Export**: Export raw data to JSON

### Real-Time Features
- **WebSocket Support**: Real-time simulation progress updates
- **SignalR Ready**: Infrastructure for live notifications

## Technology Stack

### Frontend
- Angular 17
- TypeScript
- Tailwind CSS
- Leaflet (Maps)
- PptxGenJS (Presentations)
- QuestPDF (Reports)

### Backend
- ASP.NET Core 8.0
- SQL Server
- Entity Framework Core
- JWT Authentication
- Swagger/OpenAPI

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 8.0 SDK
- SQL Server (or Docker)

### Running Locally

#### Backend
```bash
cd SmartZoneSimulator.Backend/SmartZoneSimulator.API
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`

#### Frontend
```bash
npm install
npm start
```

The UI will be available at `http://localhost:4200`

### Default Credentials
- **Admin**: admin@smartMobility.ae / admin
- **Editor**: editor@smartMobility.ae / editor
- **Viewer**: viewer@smartMobility.ae / viewer

## Docker Deployment

### Quick Start
```bash
docker-compose up -d
```

This will start:
- Frontend on http://localhost:4200
- Backend API on http://localhost:5000
- SQL Server on localhost:1433

### Custom Deployment
1. Build images:
   ```bash
   docker-compose build
   ```

2. Run containers:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop:
   ```bash
   docker-compose down
   ```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:5000/swagger
- ReDoc: http://localhost:5000/swagger/v1/swagger.json

## Project Structure

```
SmartZoneSimulator/
├── SmartZoneSimulator.UI/          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # UI components
│   │   │   ├── services/           # Angular services
│   │   │   └── models/             # TypeScript models
│   │   └── assets/                 # Static assets
│   └── Dockerfile
│
├── SmartZoneSimulator.Backend/     # ASP.NET Core backend
│   ├── SmartZoneSimulator.API/     # Web API
│   │   ├── Controllers/             # API controllers
│   │   ├── Services/               # Business logic
│   │   ├── Models/                 # Data models
│   │   └── Data/                   # DbContext
│   ├── SmartZoneSimulator.Domain/  # Domain entities
│   └── SmartZoneSimulator.Infrastructure/ # External services
│
└── docker-compose.yml              # Docker orchestration
```

## Configuration

### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| ConnectionStrings__DefaultConnection | SQL Server connection string | localhost |
| Jwt__Key | JWT signing key | (generated) |
| Jwt__Issuer | JWT issuer | SmartMobilitySimulator |
| Jwt__Audience | JWT audience | SmartMobilitySimulator |
| Jwt__ExpiryMinutes | Token expiry | 60 |

### Frontend Environment
Configure API endpoint in `src/environments/environment.ts`

## Security Features

### Authentication
- JWT tokens with 60-minute expiry
- Refresh tokens for persistent sessions
- Secure password hashing (SHA256 with salt)

### Authorization
- Role-based access control (RBAC)
- Endpoint-level authorization
- Policy-based permissions

### Account Protection
- Failed login tracking
- Automatic account lockout (5 attempts → 15 min lockout)
- Password reset tokens with 1-hour expiry
- All refresh tokens invalidated on password change

### Audit Trail
- All user actions logged
- IP address tracking
- Timestamp recording
- Admin-accessible audit logs

## Internationalization

### Supported Languages
- English (en) - Default
- Arabic (ar) - العربية

### Language Switching
Click the language selector in the navigation bar to switch languages. The preference is saved in localStorage.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Private - All rights reserved

---

**Created**: January 31, 2026  
**Last Updated**: February 15, 2026  
**Version**: 1.1.0
