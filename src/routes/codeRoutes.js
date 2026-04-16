import express from 'express';
import { createRoomCode } from '../controllers/codeController.js';
const router = express.Router();

router.post('/create-room', createRoomCode);

export default router;
