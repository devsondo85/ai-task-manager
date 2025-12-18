import express from 'express';
import {
  getTaskBreakdown,
  getPrioritySuggestion,
  getTimeEstimate,
  getAllSuggestions
} from '../controllers/aiController.js';

const router = express.Router();

// AI feature routes
router.post('/breakdown', getTaskBreakdown);           // POST /api/ai/breakdown
router.post('/priority', getPrioritySuggestion);       // POST /api/ai/priority
router.post('/time-estimate', getTimeEstimate);       // POST /api/ai/time-estimate
router.post('/suggestions', getAllSuggestions);        // POST /api/ai/suggestions (all at once)

export default router;

