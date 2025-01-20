import Jwt from "jsonwebtoken";

const encodeToken = (payload: any): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    if (!process.env.JWT_EXPIRES_IN) {
        throw new Error("JWT_EXPIRES_IN is not defined");
    }

    return Jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: "HS512"
    });
}

const decodeToken = (token: string): any => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return Jwt.verify(token, process.env.JWT_SECRET);
}

export { encodeToken, decodeToken };