import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));