import express from 'express';
import { completeSetup } from '../database/init.js';
import { z } from 'zod';

const router = express.Router();

const setupSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  adminName: z.string().min(1, 'Admin name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

router.post('/', async (req, res) => {
  try {
    const validatedData = setupSchema.parse(req.body);
    await completeSetup(validatedData);
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error('Setup error:', error);
      res.status(500).json({ error: 'Error completing setup' });
    }
  }
});

export default router;