const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);

router.delete('/:id', verifyToken, isAdmin, templateController.deleteTemplate);
router.put('/:id', verifyToken, isAdmin, templateController.updateTemplate);

module.exports = router;