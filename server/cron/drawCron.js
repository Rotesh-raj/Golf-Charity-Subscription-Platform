import cron from 'node-cron';
import { generateRandomDraw } from '../services/drawService.js';
import { supabase } from '../config/database.js';

const cronJob = cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly draw cron');
  const drawNumbers = generateRandomDraw();
  const draw = {
    numbers: drawNumbers,
    date: new Date().toISOString(),
    type: 'random',
    status: 'completed'
  };

  const { data, error } = await supabase.from('draws').insert([draw]).select().single();
  if (error) {
    console.error('Cron draw failed', error);
    return;
  }

  // Process matches, winners (call services)
  console.log('Monthly draw completed:', drawNumbers);
}, {
  scheduled: true,
  timezone: "UTC"
});

export { cronJob };

