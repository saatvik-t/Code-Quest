import express from 'express';
import { getSubmissions } from '../controllers/submission.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router()

// Route to get all submissions
router.get('/', authMiddleware, getSubmissions);

export { router as submissionRouter };