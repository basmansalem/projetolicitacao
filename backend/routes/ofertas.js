const express = require('express');
const router = express.Router();
const controller = require('../controllers/ofertasController');

// GET /ofertas
router.get('/', controller.getAll);

// POST /ofertas
router.post('/', controller.create);

// GET /ofertas/:id
router.get('/:id', controller.getById);

module.exports = router;
