import express from 'express';
import { createRoomHandler, joinRoom } from '../controllers/roomController.js';
import {validateRoom} from '../middlewares/roomMiddlewares.js';

const router = express.Router();

router.post('/create-room', createRoomHandler);
router.get('/join-room/:roomCode', validateRoom, joinRoom);

export default router;
