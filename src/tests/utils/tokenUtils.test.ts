import { encodeToken, decodeToken } from "../../utils/tokenUtils";
import dotenv from "dotenv";

dotenv.config();

describe("Token Utils", () => {
    it("should encode a token", () => {
        const token = encodeToken({ id: "123" });
        expect(token).toBeDefined();
    });

    it("should decode a token", () => {
        const token = encodeToken({ id: "123" });
        const payload = decodeToken(token);
        expect(payload).toBeDefined();
        expect(payload.id).toBe("123");
    });
});