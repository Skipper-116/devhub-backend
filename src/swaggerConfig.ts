import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import dotenv from 'dotenv';

const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : process.env.PRODUCTION_URL;

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
                url: url, // Replace with your server URL
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;
