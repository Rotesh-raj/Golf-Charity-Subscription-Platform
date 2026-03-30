import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// Protected dashboard data
router.use(authenticate);

router.get('/dashboard', async (req, res) => {
  const [subsRes, scoresRes, charitiesRes, drawsRes, winnersRes] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', req.user.id),
    supabase.from('scores').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('charities').select('*').eq('id', req.user.charity_id).single(),
    supabase.from('draws').select('*').order('date', { ascending: false }).limit(5),
    supabase.from('winners').select('*').eq('user_id', req.user.id)
  ]);

  res.json({
    subscription: subsRes.data?.[0],
    scores: scoresRes.data || [],
    charity: charitiesRes.data,
    recentDraws: drawsRes.data || [],
    winnings: winnersRes.data || []
  });
});

export default router;

