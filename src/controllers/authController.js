import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/userModel.js";
import { signAuthToken } from "../utils/jwt.js";

const saltRounds = 10;

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

export async function registerHandler(req, res) {
  const username = String(req.body.username || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await createUser({ username, email, passwordHash });
    const token = signAuthToken(user);
    console.log(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("username", user.username, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Error creating account." });
  }
}

export async function loginHandler(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };
    const token = signAuthToken(safeUser);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("username", safeUser.username, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Error logging in." });
  }
}

export async function logoutHandler(req, res) {
  res.clearCookie("token");
  res.clearCookie("username");
  return res.status(200).json({ message: "Logged out successfully." });
}
