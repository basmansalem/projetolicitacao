const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestadoresController');

// GET /prestadores - Listar todos
router.get('/', controller.getAll);

// POST /prestadores - Criar novo
router.post('/', controller.create);

// GET /prestadores/:id - Obter detalhes
router.get('/:id', controller.getById);

// PUT /prestadores/:id - Atualizar
router.put('/:id', controller.update);

// DELETE /prestadores/:id - Remover
router.delete('/:id', controller.remove);

module.exports = router;
