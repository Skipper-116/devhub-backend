import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profileController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                type: string
 *                example: 1
 *                required: true
 *               reason:
 *                type: string
 *                example: "I no longer need this account"
 *                required: true
 *     responses:
 *       200:
 *         description: Successfully deleted user profile
 *       401:
 *         description: Unauthorized
 */

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.delete("/", authMiddleware, deleteProfile);

export default router;