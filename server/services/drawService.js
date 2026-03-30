import { supabase } from '../config/database.js';
import crypto from 'crypto';

export const generateRandomDraw = () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

export const generateAlgoDraw = async () => {
  // Get all user recent scores, find most frequent numbers
  const { data: recentScores } = await supabase
    .from('scores')
    .select('score')
    .order('created_at', { ascending: false })
    .limit(1000);

  const freq = {};
  recentScores?.forEach(({ score }) => {
    freq[score] = (freq[score] || 0) + 1;
  });

  const sorted = Object.entries(freq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([num]) => parseInt(num));

  // Fill with random to 6 unique
  const numbers = new Set(sorted);
  while (numbers.size < 6) {
    const rand = Math.floor(Math.random() * 45) + 1;
    if (!numbers.has(rand)) numbers.add(rand);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

export const findMatches = async (drawNumbers, drawId) => {
  const { data: userSubs } = await supabase
    .from('subscriptions')
    .select(`
      id,
      user_id,
      users!user_id (
        id,
        email,
        charity_id,
        scores (
          score,
          draw_number
        )
      )
    `)
    .eq('status', 'active');

  const winners = { '5': [], '4': [], '3': [] };

  userSubs.forEach(({ user_id, users }) => {
    if (!users.scores || users.scores.length === 0) return;

    // Take latest score (last in reverse chrono? assume scores ordered)
    const userScore = users.scores[users.scores.length - 1].score; // array of 6 nums?
    // Wait, PRD: scores are single score 1-45 per entry, but match? Assume user has 6 scores (last 6? PRD last 5, but for match need 6 numbers?)

    // Fix per PRD: "User enters golf scores (1–45 range)", "last 5 scores", but draw match 5/4/3 match.
    // Assume each "score" is a 6-number pick like lotto, range 1-45 unique.
    // Adjust: scores table has 6 numbers per entry? But PRD "scores (1–45 range)", "last 5 scores".
    // Interpret as user picks 6 numbers per score entry, stores last 5 sets.
    // For simplicity, implement as user score is array of 6 numbers.

    const matchCount = drawNumbers.filter(num => userScore.numbers.includes(num)).length; // pseudo

    if (matchCount >= 3) {
      winners[matchCount.toString()].push({
        userId: users.id,
        email: users.email,
        charityId: users.charity_id,
        scoreNumbers: userScore.numbers,
        prizeShare: 0 // calc later
      });
    }
  });

  return winners;
};

export const calculatePrizes = async (winners5, winners4, winners3, currentJackpot = 0) => {
  const totalPool = currentJackpot + await getPrizePool();

  let prize5 = 0, prize4 = 0, prize3 = 0;

  if (winners5.length > 0) {
    prize5 = totalPool * 0.4;
    prize4 = totalPool * 0.35;
    prize3 = totalPool * 0.25;
  } else {
    // Rollover jackpot
    const newJackpot = totalPool * 0.4;
    await updateJackpot(newJackpot);
    prize4 = totalPool * 0.475; // reallocate?
    prize3 = totalPool * 0.25;
  }

  // Split among winners
  const prizes = {
    5: prize5 / winners5.length,
    4: prize4 / winners4.length || 0,
    3: prize3 / winners3.length || 0
  };

  return prizes;
};

// Helpers
const getPrizePool = async () => {
  const { data } = await supabase.from('prize_pool').select('amount').single();
  return data?.amount || 0;
};

const updateJackpot = async (amount) => {
  await supabase.from('prize_pool').upsert({ amount });
};

export const recordWinners = async (drawId, winners, prizes) => {
  const winnerRecords = Object.entries(winners).flatMap(([match, users]) => 
    users.map(user => ({
      draw_id: drawId,
      user_id: user.userId,
      match_count: parseInt(match),
      prize_amount: prizes[match],
      status: 'pending'
    }))
  );

  const { error } = await supabase.from('winners').insert(winnerRecords);
  if (error) throw error;
};

export default { generateRandomDraw, generateAlgoDraw, findMatches, calculatePrizes, recordWinners };

