const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, optionalAuth, isAdmin } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, submissionController.createSubmission);
router.get('/', [verifyToken, isAdmin], submissionController.getPendingSubmissions);
router.put('/:id/approve', [verifyToken, isAdmin], submissionController.approveSubmission);
router.put('/:id/reject', [verifyToken, isAdmin], submissionController.rejectSubmission);

module.exports = router;