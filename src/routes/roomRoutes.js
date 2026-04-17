import express from 'express';
import { createRoomHandler } from '../controllers/roomController.js';
import { checkRoomExists} from '../middlewares/roomMiddlwares.js';

const router = express.Router();

router.post('/create-room', createRoomHandler);
router.post('/join-room/:roomCode', checkRoomExists);

export default router;
