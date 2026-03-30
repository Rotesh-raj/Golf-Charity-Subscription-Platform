import express from "express";
import { authenticate } from "../middleware/auth.js";
import { supabase } from "../config/database.js";

const router = express.Router();

// ================= ADD SCORE =================
router.post("/", authenticate, async (req, res) => {
  try {
    const { numbers, played_at } = req.body;

    // ✅ VALIDATION - array of 5 unique nums 1-45 (PRD)
    if (!Array.isArray(numbers) || numbers.length !== 5) {
      return res.status(400).json({ error: "Must provide exactly 5 numbers" });
    }

    const invalidNums = numbers.filter(n => !Number.isInteger(n) || n < 1 || n > 45);
    if (invalidNums.length > 0) {
      return res.status(400).json({ error: "Numbers must be integers 1-45" });
    }

    const uniqueNums = [...new Set(numbers)];
    if (uniqueNums.length !== 5) {
      return res.status(400).json({ error: "Numbers must be unique" });
    }


    if (!played_at) {
      return res.status(400).json({ error: "Date required" });
    }

    const userId = req.user.id;

    // ✅ GET EXISTING SCORES
    const { data: scores } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    // ✅ IF ALREADY 5 → DELETE OLDEST
    if (scores.length >= 5) {
      const oldest = scores[0];

      await supabase
        .from("scores")
        .delete()
        .eq("id", oldest.id);
    }

    // ✅ INSERT NEW SCORE
    const { data, error } = await supabase
      .from("scores")
      .insert([
        {
          user_id: userId,
          numbers,
          played_at,
        },
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, score: data[0] });

  } catch (err) {
    console.error("SCORE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= GET SCORES =================
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("played_at", { ascending: false }) 
      .limit(5);

    res.json(data || []);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
