const express = require('express');
const router = express.Router();
const controller = require('../controllers/itensController');

// GET /itens/categorias - Listar categorias disponíveis
router.get('/categorias', controller.getCategorias);

// GET /itens/unidades - Listar unidades disponíveis
router.get('/unidades', controller.getUnidades);

// GET /itens - Listar todos (com filtros opcionais)
router.get('/', controller.getAll);

// POST /itens - Criar novo
router.post('/', controller.create);

// GET /itens/:id - Obter detalhes
router.get('/:id', controller.getById);

// PUT /itens/:id - Atualizar
router.put('/:id', controller.update);

// DELETE /itens/:id - Remover
router.delete('/:id', controller.remove);

module.exports = router;
