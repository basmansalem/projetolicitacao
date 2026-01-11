const express = require('express');
const router = express.Router();
const controller = require('../controllers/chamadasController');

// GET /chamadas - Listar todas
router.get('/', controller.getAll);

// POST /chamadas - Criar nova (gera possibilidades automaticamente)
router.post('/', controller.create);

// GET /chamadas/:id - Obter detalhes
router.get('/:id', controller.getById);

// GET /chamadas/:id/possibilidades - Listar possibilidades
router.get('/:id/possibilidades', controller.getPossibilidades);

// POST /chamadas/:id/regenerar-possibilidades - Regenerar possibilidades
router.post('/:id/regenerar-possibilidades', controller.regenerarPossibilidades);

// PUT /chamadas/:id - Atualizar
router.put('/:id', controller.update);

// DELETE /chamadas/:id - Remover
router.delete('/:id', controller.remove);

module.exports = router;
