import express from "express";
import { validateUser } from "../middlewares/authMiddleware.js";
import { createRoom, joinRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", validateUser, createRoom);
router.get("/join-room/:code", validateUser, joinRoom);

export default router;
