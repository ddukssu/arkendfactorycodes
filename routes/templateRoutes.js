const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/', [verifyToken, isAdmin], templateController.createTemplate);
router.delete('/:id', [verifyToken, isAdmin], templateController.deleteTemplate);

module.exports = router;