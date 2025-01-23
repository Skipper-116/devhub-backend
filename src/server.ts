import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);

// Init Middleware
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));