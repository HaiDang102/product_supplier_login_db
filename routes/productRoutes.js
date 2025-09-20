const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth.isAuthenticated, productController.index);
router.get('/new', auth.isAuthenticated, productController.newForm);
router.post('/', auth.isAuthenticated, productController.create);
router.get('/:id/edit', auth.isAuthenticated, productController.editForm);
router.put('/:id', auth.isAuthenticated, productController.update);
router.delete('/:id', auth.isAuthenticated, productController.delete);

module.exports = router;