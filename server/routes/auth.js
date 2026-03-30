import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { email, password, charity_id } = req.body;

    // ✅ CHECK IF USER EXISTS
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ INSERT NEW USER (defaults: role='user', subscription_status='cancelled')
    const { data: user, error } = await supabase
      .from("users")
      .insert([{
        email,
        password: hashedPassword,
        role: 'user',
        subscription_status: 'cancelled',
        charity_id: charity_id || null,
      }])
      .select("id, email, role, subscription_status, charity_id")
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully. Please login.",
      user 
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});




// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 REMOVE PASSWORD BEFORE SENDING
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_status: user.subscription_status,
      charity_id: user.charity_id,
    };

    res.json({ token, user: safeUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================= PROFILE =================
router.get("/profile", authenticate, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("id, email, role, subscription_status, charity_id")
      .eq("id", req.user.id)
      .single();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;