const express = require('express');
const router = express.Router();
const controller = require('../controllers/licitacoesController');

// GET /licitacoes - Listar todas as licitações
router.get('/', controller.getAll);

// POST /licitacoes - Criar nova licitação
router.post('/', controller.create);

// GET /licitacoes/:id - Obter detalhes de uma licitação
router.get('/:id', controller.getById);

// PUT /licitacoes/:id - Atualizar licitação
router.put('/:id', controller.update);

// DELETE /licitacoes/:id - Remover licitação
router.delete('/:id', controller.remove);

module.exports = router;
