import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// 🔐 Admin Middleware
router.use(authenticate);
router.use(isAdmin);

/* =========================================================
   📊 ANALYTICS
========================================================= */
router.get('/analytics', async (req, res) => {
  try {
    const [users, draws, charities, subs] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('draws').select('*', { count: 'exact', head: true }),
      supabase.from('charities').select('total_contribution'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true })
    ]);

    const totalCharity =
      charities.data?.reduce((sum, c) => sum + (c.total_contribution || 0), 0) || 0;

    res.json({
      totalUsers: users.count || 0,
      totalDraws: draws.count || 0,
      totalSubscriptions: subs.count || 0,
      totalCharity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   👥 USER MANAGEMENT
========================================================= */

// Get all users
router.get('/users', async (req, res) => {
  try {
    // 1. Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;

    // 2. Attach subscriptions + scores manually
    const result = await Promise.all(
      users.map(async (user) => {
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);

        const { data: scores } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id);

        return {
          ...user,
          subscriptions: subscriptions || [],
          scores: scores || []
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("❌ ADMIN USERS ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
});
// Update user profile
router.put('/users/:id', async (req, res) => {
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update({ name, email })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});
// Ban / Activate user
router.patch('/users/:id/status', async (req, res) => {
  const { status } = req.body; // active / banned

  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});
// Admin override scores
router.patch('/users/:id/scores', async (req, res) => {
  const { numbers } = req.body;

  const { data, error } = await supabase
    .from('scores')
    .insert({
      user_id: req.params.id,
      numbers
    });

  if (error) return res.status(400).json(error);
  res.json(data);
});

/* =========================================================
   💳 SUBSCRIPTION MANAGEMENT




========================================================= */

// Get all subscriptions
router.patch('/users/:id/subscription', async (req, res) => {
  const { plan, status } = req.body;

  const { data, error } = await supabase
    .from('subscriptions')
    .update({ plan, status })
    .eq('user_id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});
// Update subscription manually
router.put('/subscriptions/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(req.body)
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

/* =========================================================
   🎲 DRAW MANAGEMENT
========================================================= */

// Helper: Generate random numbers
const generateNumbers = () => {
  const nums = new Set();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums);
};

// Simulate draw (no DB write)
router.post('/draw/simulate', async (req, res) => {
  const numbers = generateNumbers();
  res.json({ numbers });
});

// Run draw (save to DB)
router.post('/draw/run', async (req, res) => {
  const numbers = generateNumbers();

  const { data, error } = await supabase
    .from('draws')
    .insert({
      winning_numbers: numbers,
      status: 'draft'
    })
    .select()
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Publish draw
router.post('/draw/:id/publish', async (req, res) => {
  const { data, error } = await supabase
    .from('draws')
    .update({ status: 'published' })
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

/* =========================================================
   ❤️ CHARITY MANAGEMENT
========================================================= */

// Get charities
router.get('/charities', async (req, res) => {
  const { data, error } = await supabase.from('charities').select('*');

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Create charity
router.post('/charities', async (req, res) => {
  const { data, error } = await supabase
    .from('charities')
    .insert(req.body);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Update charity
router.put('/charities/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('charities')
    .update(req.body)
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Delete charity
router.delete('/charities/:id', async (req, res) => {
  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json({ success: true });
});

/* =========================================================
   🏆 WINNERS MANAGEMENT
========================================================= */

// Get all winners
router.get('/winners', async (req, res) => {
  const { data, error } = await supabase.from('winners').select('*');

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Verify winner
router.put('/winners/:id/verify', async (req, res) => {
  const { data, error } = await supabase
    .from('winners')
    .update({ status: 'verified' })
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Mark payout complete
router.put('/winners/:id/payout', async (req, res) => {
  const { data, error } = await supabase
    .from('winners')
    .update({ status: 'paid' })
    .eq('id', req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;