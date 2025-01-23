// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import '../types/express';
import { JwtPayload } from '../types/jwtPayload';
import jwt from 'jsonwebtoken';

// Middleware function
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = res.status(401).json({ message: 'Unauthorized: No token provided' });
        return next(response);
    }

    const token = authHeader.split(' ')[1];

    try {
        const secretKey = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        // Attach user info to the request
        req.user = {
            id: decoded.id,
        };

        next();
    } catch (error) {
        const response = res.status(403).json({ message: 'Forbidden: Invalid token' });
        return next(response);
    }
};

export default authMiddleware;
