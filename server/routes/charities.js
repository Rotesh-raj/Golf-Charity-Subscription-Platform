import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// Protected
router.use(authenticate);

// List
router.get('/', async (req, res) => {
  const { data } = await supabase
    .from('charities')
    .select('*')
    .order('name');
  res.json(data || []);
});

// Profile
router.get('/:id', async (req, res) => {
  const { data } = await supabase
    .from('charities')
    .select('*')
    .eq('id', req.params.id)
    .single();
  res.json(data || null);
});

// Select charity for user
// ================= SELECT CHARITY =================
router.post('/select', async (req, res) => {
  try {
    const { charity_id } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ charity_id })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

