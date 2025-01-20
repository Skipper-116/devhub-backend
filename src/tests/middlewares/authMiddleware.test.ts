import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../../middlewares/authMiddleware";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = { headers: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    it("should return 401 if no token is provided", () => {
        authMiddleware(mockReq as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized: No token provided" });
    });

    it("should return 403 if token is invalid", () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error();
        });

        mockReq.headers = { authorization: "Bearer invalid-token" };
        authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden: Invalid token" });
    });

    it("should attach user info to the request if token is valid", () => {
        (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

        mockReq.headers = { authorization: "Bearer valid-token" };
        authMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockReq.user).toEqual({ id: 1 });
        expect(mockNext).toHaveBeenCalled();
    });
});