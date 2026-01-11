const chamadasData = require('../data/chamadas');
const possibilidadesData = require('../data/possibilidades');
const itensData = require('../data/itens');

// Validação
const validateChamada = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.titulo !== undefined) {
        if (!data.titulo || data.titulo.trim() === '') {
            errors.push('O campo "titulo" é obrigatório');
        }
    }

    if (!isUpdate || data.categoria !== undefined) {
        if (!data.categoria) {
            errors.push('O campo "categoria" é obrigatório');
        } else if (!itensData.CATEGORIAS.includes(data.categoria)) {
            errors.push(`Categoria inválida. Valores permitidos: ${itensData.CATEGORIAS.join(', ')}`);
        }
    }

    if (!isUpdate || data.valorMaximo !== undefined) {
        if (data.valorMaximo === undefined || data.valorMaximo === null) {
            errors.push('O campo "valorMaximo" é obrigatório');
        } else if (typeof data.valorMaximo !== 'number' || data.valorMaximo < 0) {
            errors.push('O campo "valorMaximo" deve ser um número positivo');
        }
    }

    if (data.status && !chamadasData.STATUS_CHAMADA.includes(data.status)) {
        errors.push(`Status inválido. Valores permitidos: ${chamadasData.STATUS_CHAMADA.join(', ')}`);
    }

    return errors;
};

// GET /chamadas
exports.getAll = (req, res) => {
    try {
        const filters = {
            categoria: req.query.categoria,
            status: req.query.status
        };

        const chamadas = chamadasData.getAll(filters);

        // Adicionar contagem de possibilidades
        const chamadasComPossibilidades = chamadas.map(c => ({
            ...c,
            quantidadePossibilidades: possibilidadesData.countByChamada(c.id)
        }));

        res.json({
            success: true,
            count: chamadasComPossibilidades.length,
            data: chamadasComPossibilidades
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar chamadas' });
    }
};

// GET /chamadas/:id
exports.getById = (req, res) => {
    try {
        const chamada = chamadasData.getById(req.params.id);

        if (!chamada) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        const possibilidades = possibilidadesData.getByChamada(chamada.id);

        res.json({
            success: true,
            data: {
                ...chamada,
                quantidadePossibilidades: possibilidades.length,
                possibilidades
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar chamada' });
    }
};

// GET /chamadas/:id/possibilidades
exports.getPossibilidades = (req, res) => {
    try {
        const chamada = chamadasData.getById(req.params.id);

        if (!chamada) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        const possibilidades = possibilidadesData.getByChamada(chamada.id);

        res.json({
            success: true,
            count: possibilidades.length,
            data: possibilidades
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar possibilidades' });
    }
};

// POST /chamadas
exports.create = (req, res) => {
    try {
        const errors = validateChamada(req.body);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // Criar a chamada
        const newChamada = chamadasData.create(req.body);

        // Gerar possibilidades automaticamente
        const possibilidades = possibilidadesData.gerarPossibilidades(newChamada);

        res.status(201).json({
            success: true,
            message: `Chamada criada com sucesso. ${possibilidades.length} possibilidade(s) encontrada(s).`,
            data: {
                ...newChamada,
                quantidadePossibilidades: possibilidades.length,
                possibilidades
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro ao criar chamada' });
    }
};

// PUT /chamadas/:id
exports.update = (req, res) => {
    try {
        const existing = chamadasData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        const errors = validateChamada(req.body, true);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const updated = chamadasData.update(req.params.id, req.body);

        // Se categoria ou valor máximo mudou, regenerar possibilidades
        if (req.body.categoria !== undefined || req.body.valorMaximo !== undefined) {
            possibilidadesData.gerarPossibilidades(updated);
        }

        const possibilidades = possibilidadesData.getByChamada(updated.id);

        res.json({
            success: true,
            message: 'Chamada atualizada com sucesso',
            data: {
                ...updated,
                quantidadePossibilidades: possibilidades.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao atualizar chamada' });
    }
};

// DELETE /chamadas/:id
exports.remove = (req, res) => {
    try {
        const existing = chamadasData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        // Remover possibilidades associadas
        possibilidadesData.removeByChamada(req.params.id);

        chamadasData.remove(req.params.id);

        res.json({
            success: true,
            message: 'Chamada removida com sucesso'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao remover chamada' });
    }
};

// POST /chamadas/:id/regenerar-possibilidades
exports.regenerarPossibilidades = (req, res) => {
    try {
        const chamada = chamadasData.getById(req.params.id);

        if (!chamada) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        const possibilidades = possibilidadesData.gerarPossibilidades(chamada);

        res.json({
            success: true,
            message: `Possibilidades regeneradas. ${possibilidades.length} encontrada(s).`,
            count: possibilidades.length,
            data: possibilidades
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao regenerar possibilidades' });
    }
};
