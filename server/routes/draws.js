import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import * as drawService from '../services/drawService.js';
import { supabase } from '../config/database.js';

const router = express.Router();


// ================= GET DRAWS (ALL USERS) =================
router.get('/', authenticate, async (req, res) => {
  try {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= CREATE/RUN DRAW (ADMIN ONLY) =================
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { type } = req.body; // 'random' | 'algo'
    const isSimulation = req.body.simulation;

    const numbers =
      type === 'algo'
        ? await drawService.generateAlgoDraw()
        : drawService.generateRandomDraw();

    const draw = {
      numbers,
      date: new Date().toISOString(),
      type,
      status: 'completed',
      is_simulation: !!isSimulation
    };

    const { data, error } = await supabase
      .from('draws')
      .insert([draw])
      .select()
      .single();

    if (error) throw error;

    let winners = null;

    if (!isSimulation) {
      winners = await drawService.findMatches(numbers, data.id);
      const prizes = await drawService.calculatePrizes(
        winners['5'],
        winners['4'],
        winners['3']
      );
      await drawService.recordWinners(data.id, winners, prizes);
    }

    res.json({ draw: data, winners });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;