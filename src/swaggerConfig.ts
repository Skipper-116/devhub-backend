import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();
const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'DevHub API Documentation',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`, // Replace with your server URL
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;
