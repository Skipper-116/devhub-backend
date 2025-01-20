// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import '../types/express';
import { JwtPayload } from '../types/jwtPayload';
import jwt from 'jsonwebtoken';

// Middleware function
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
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
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export default authMiddleware;
