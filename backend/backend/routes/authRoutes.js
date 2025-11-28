import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'patient' } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const usersCol = mongoose.connection.collection('users');
    const existing = await usersCol.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const doc = {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      createdAt: new Date()
    };

    const result = await usersCol.insertOne(doc);
    doc._id = result.insertedId;

    // return created user (omit password in response)
    const { password: _p, ...safe } = doc;
    res.json({ user: safe });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
