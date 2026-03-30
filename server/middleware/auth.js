import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET required');
}

// Verify JWT and attach user
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: user, error } = await supabase.from('users').select('*').eq('id', decoded.userId).single();

    if (error || !user) return res.status(401).json({ error: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin only
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

// ✅ PRD: REQUIRE ACTIVE SUB FOR PROTECTED ROUTES
export const requireSubscription = async (req, res, next) => {
  try {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', req.user.id)
      .single();

    if (!sub || sub.status !== 'active') {
      return res.status(403).json({ error: "Active subscription required" });
    }
    next();
  } catch (err) {
    res.status(403).json({ error: "Subscription check failed" });
  }
};

