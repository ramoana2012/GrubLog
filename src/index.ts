import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

// Import API routes
import mealRoutes from './api/routes/meal.routes';
import authRoutes from './api/controllers/auth.controller';
import configRoutes from './api/routes/config.routes';

// Initialize Firebase (after environment variables are loaded)
import './api/config/firebase';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/meals', mealRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);

// Serve test client static files
app.use('/test-client', express.static(path.join(__dirname, 'test-client')));

// Test client route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-client/index.html'));
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test client available at: http://localhost:${PORT}/test`);
  console.log(`API config endpoint: http://localhost:${PORT}/api/config`);
});

export default app;
