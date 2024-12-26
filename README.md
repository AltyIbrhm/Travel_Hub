# Transportation Application

A full-stack application for managing transportation services, built with React and Node.js.

## Project Structure

```
transportation/
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── app/     # Core app components
│   │   ├── features/# Feature-based components
│   │   │   ├── auth/    # Authentication related
│   │   │   ├── dashboard/# Dashboard components
│   │   │   └── profile/ # Profile management
│   │   └── styles/ # Global styles
│   └── public/     # Static files
├── backend/        # Node.js backend application
│   ├── src/
│   │   ├── api/   # API routes and controllers
│   │   ├── models/# Database models
│   │   └── server/# Server configuration
│   └── tests/     # Backend tests
└── README.md      # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transportation
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm start
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Features

- User Authentication
  - Login
  - Register
  - Password Reset
  - Protected Routes
- Dashboard
  - User Welcome Screen
  - Reservation Management
  - Quick Actions
- Profile Management
  - View Profile
  - Edit Profile
  - Update Settings

## API Documentation

API documentation is available at http://localhost:5000/api-docs when the backend server is running.

### Main API Endpoints

- Auth Routes:
  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password

- User Routes:
  - GET /api/users/profile
  - PUT /api/users/profile
  - GET /api/users/settings

- Reservation Routes:
  - GET /api/reservations
  - POST /api/reservations
  - PUT /api/reservations/:id
  - DELETE /api/reservations/:id

## Available Scripts

### Backend

```bash
npm start           # Start the server
npm run dev        # Start the server with nodemon
npm test          # Run tests
```

### Frontend

```bash
npm start          # Start the development server
npm test          # Run tests
npm run build     # Build for production
```

## Project Dependencies

### Frontend
- React
- React Router DOM
- Material-UI
- Axios
- JWT Decode

### Backend
- Express
- MongoDB/Mongoose
- JWT
- Bcrypt
- Cors
- Swagger UI
 
 ##
 api http://localhost:5000/api-docs/

 
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Notes

- Frontend uses a feature-based architecture
- Backend follows MVC pattern
- API documentation is auto-generated using Swagger
- Authentication uses JWT tokens
- All API routes are protected except login and register

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Your Name - ibrhm.altay.12@gmail.com        
Project Link: [https://github.com/AltyIbrhm/transportation](https://github.com/AltyIbrhm/transportation)