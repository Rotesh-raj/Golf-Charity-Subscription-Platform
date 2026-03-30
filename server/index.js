import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { cronJob } from './cron/drawCron.js';

import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscriptions.js';
import scoreRoutes from './routes/scores.js';
import drawRoutes from './routes/draws.js';
import winnerRoutes from './routes/winners.js';
import charityRoutes from './routes/charities.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';

import { supabase } from './config/database.js';

dotenv.config();

// ✅ REQUIRED (YOU MISSED THIS)
const app = express();
const PORT = process.env.PORT || 5000;

// ================= SECURITY =================
app.use(helmet());

// ================= CORS =================
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ================= STRIPE WEBHOOK (IMPORTANT) =================
app.use('/api/subscriptions/webhook',
  express.raw({ type: 'application/json' })
);

// ================= BODY =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= TRUST PROXY =================
app.set('trust proxy', 1);

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date().toISOString(),
  });
});

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// ================= 404 =================
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ================= CRON =================
cronJob.start();

// ================= DB CHECK =================
supabase.from('users').select('id').limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected');
    }
  });

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;