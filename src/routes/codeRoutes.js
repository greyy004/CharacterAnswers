import express from 'express';
import {generateCode} from '../controllers/codeController.js';
const router = express.Router();

router.get('/generate', generateCode);

export default router;