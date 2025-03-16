# GrubLog - Meal Tracking Application

GrubLog is a full-stack meal tracking application built with Express, TypeScript, and Firebase. It allows users to track their meals, including details like difficulty, nutrition rating, cuisine type, and more.

## Features

- User authentication with Firebase (Email/Password and Google Sign-in)
- Create, read, update, and delete meal entries
- Track meal details:
  - Name
  - Date
  - Difficulty (easy, medium, hard)
  - Nutrition (healthy, unhealthy)
  - Cuisine
  - Rating (0-5 with 0.5 increments)
  - Notes

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Frontend**: React (to be implemented)

## Project Structure

```
GrubLog/
├── src/
│   ├── api/                  # Backend API code
│   │   ├── config/           # Firebase and other configurations
│   │   ├── controllers/      # API controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   ├── client/               # Frontend React application
│   └── index.ts              # Main server entry point
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore database
3. Set up Authentication with Email/Password and Google Sign-in providers
4. Generate a new private key for the Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd GrubLog
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your Firebase configuration details.

4. Set up the client-side React application:
   ```
   cd src/client
   npm install
   ```

### Running the Application

#### Development Mode

Run the server and client concurrently:
```
npm run dev
```

Or run them separately:
```
npm run dev:server
npm run dev:client
```

#### Production Build

Build both server and client:
```
npm run build
```

Start the production server:
```
npm start
```

## API Endpoints

### Authentication

- `GET /api/auth/verify` - Verify token and get user data
- `POST /api/auth/custom-token` - Create a custom token (development only)

### Meals

- `GET /api/meals` - Get all meals for the authenticated user
- `GET /api/meals/:id` - Get a specific meal by ID
- `POST /api/meals` - Create a new meal
- `PUT /api/meals/:id` - Update an existing meal
- `DELETE /api/meals/:id` - Delete a meal

## License

This project is licensed under the ISC License.
