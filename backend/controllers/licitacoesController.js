const licitacoesData = require('../data/licitacoes');

// Validação de campos obrigatórios
const validateLicitacao = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.numero !== undefined) {
        if (!data.numero || data.numero.trim() === '') {
            errors.push('O campo "numero" é obrigatório');
        }
    }

    if (!isUpdate || data.orgao !== undefined) {
        if (!data.orgao || data.orgao.trim() === '') {
            errors.push('O campo "orgao" é obrigatório');
        }
    }

    if (!isUpdate || data.objeto !== undefined) {
        if (!data.objeto || data.objeto.trim() === '') {
            errors.push('O campo "objeto" é obrigatório');
        }
    }

    if (!isUpdate || data.modalidade !== undefined) {
        if (!data.modalidade || data.modalidade.trim() === '') {
            errors.push('O campo "modalidade" é obrigatório');
        }
    }

    if (!isUpdate || data.valorEstimado !== undefined) {
        if (data.valorEstimado === undefined || data.valorEstimado === null) {
            errors.push('O campo "valorEstimado" é obrigatório');
        } else if (typeof data.valorEstimado !== 'number' || data.valorEstimado < 0) {
            errors.push('O campo "valorEstimado" deve ser um número positivo');
        }
    }

    if (!isUpdate || data.dataAbertura !== undefined) {
        if (!data.dataAbertura) {
            errors.push('O campo "dataAbertura" é obrigatório');
        }
    }

    if (data.status && !licitacoesData.STATUS_LIST.includes(data.status)) {
        errors.push(`Status inválido. Valores permitidos: ${licitacoesData.STATUS_LIST.join(', ')}`);
    }

    return errors;
};

// GET /licitacoes - Listar todas
exports.getAll = (req, res) => {
    try {
        const licitacoes = licitacoesData.getAll();
        res.json({
            success: true,
            count: licitacoes.length,
            data: licitacoes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar licitações'
        });
    }
};

// GET /licitacoes/:id - Obter por ID
exports.getById = (req, res) => {
    try {
        const licitacao = licitacoesData.getById(req.params.id);

        if (!licitacao) {
            return res.status(404).json({
                success: false,
                error: 'Licitação não encontrada'
            });
        }

        res.json({
            success: true,
            data: licitacao
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar licitação'
        });
    }
};

// POST /licitacoes - Criar nova
exports.create = (req, res) => {
    try {
        const errors = validateLicitacao(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const newLicitacao = licitacoesData.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Licitação criada com sucesso',
            data: newLicitacao
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao criar licitação'
        });
    }
};

// PUT /licitacoes/:id - Atualizar
exports.update = (req, res) => {
    try {
        const existing = licitacoesData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Licitação não encontrada'
            });
        }

        const errors = validateLicitacao(req.body, true);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const updated = licitacoesData.update(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Licitação atualizada com sucesso',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar licitação'
        });
    }
};

// DELETE /licitacoes/:id - Remover
exports.remove = (req, res) => {
    try {
        const existing = licitacoesData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Licitação não encontrada'
            });
        }

        licitacoesData.remove(req.params.id);

        res.json({
            success: true,
            message: 'Licitação removida com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao remover licitação'
        });
    }
};
