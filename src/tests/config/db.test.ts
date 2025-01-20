import mongoose from "mongoose";
import connectDB from "../../config/db";

jest.mock("mongoose", () => ({
    connect: jest.fn()
}));


describe("Database connection", () => {
    it("should connect to the database", async () => {
        await connectDB();
        expect(mongoose.connect).toHaveBeenCalled();
    });

    it("should exit the process with code 1 if it fails to connect", async () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
            throw new Error(`process.exit: ${code}`);
        });

        (mongoose.connect as jest.Mock).mockRejectedValue(new Error("Failed to connect"));

        await expect(connectDB()).rejects.toThrow("process.exit: 1");

        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
    });
});