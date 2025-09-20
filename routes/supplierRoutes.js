const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middlewares/authMiddleware');

// CRUD - chỉ user đã login mới thao tác
router.get('/', auth.isAuthenticated, supplierController.index);
router.get('/new', auth.isAuthenticated, supplierController.newForm);
router.post('/', auth.isAuthenticated, supplierController.create);
router.get('/:id/edit', auth.isAuthenticated, supplierController.editForm);
router.put('/:id', auth.isAuthenticated, supplierController.update);
router.delete('/:id', auth.isAuthenticated, supplierController.delete);

module.exports = router;