import express from 'express';
import multer from 'multer';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { supabase } from '../config/database.js';
import stripe from '../config/stripe.js';
import { payoutWinner } from '../services/paymentService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/proofs/' });

// Protected
router.use(authenticate);

router.use('/upload', upload.single('proof'));

// User upload proof for win
router.post('/upload', async (req, res) => {
  try {
    const winnerId = req.body.winnerId;
    const filePath = req.file.path;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('proofs')
      .upload(`proof-${winnerId}-${Date.now()}.jpg`, req.file.buffer);

    if (error) throw error;

    await supabase.from('winner_verifications').insert({
      winner_id: winnerId,
      proof_url: data.path,
      status: 'pending'
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin list pending, approve
router.get('/pending', isAdmin, async (req, res) => {
  const { data } = await supabase
    .from('winners')
    .select(`
      *,
      winner_verifications (
        proof_url
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  res.json(data || []);
});

router.patch('/:id/approve', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const prizeAmount = req.body.prize_amount || 0;

    await payoutWinner(id, prizeAmount);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

