import express from "express";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);

export default router;
