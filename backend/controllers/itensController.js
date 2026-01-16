const itensData = require('../data/itens');
const prestadoresData = require('../data/prestadores');
const possibilidadesData = require('../data/possibilidades');

// Validação
const validateItem = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate) {
        if (!data.prestadorId) {
            errors.push('O campo "prestadorId" é obrigatório');
        } else if (!prestadoresData.getById(data.prestadorId)) {
            errors.push('Prestador não encontrado');
        }
    }

    if (!isUpdate || data.categoria !== undefined) {
        if (!data.categoria) {
            errors.push('O campo "categoria" é obrigatório');
        } else if (!itensData.CATEGORIAS.includes(data.categoria)) {
            errors.push(`Categoria inválida. Valores permitidos: ${itensData.CATEGORIAS.join(', ')}`);
        }
    }

    if (!isUpdate || data.nome !== undefined) {
        if (!data.nome || data.nome.trim() === '') {
            errors.push('O campo "nome" é obrigatório');
        }
    }

    if (!isUpdate || data.valorReferencia !== undefined) {
        if (data.valorReferencia === undefined || data.valorReferencia === null) {
            errors.push('O campo "valorReferencia" é obrigatório');
        } else if (typeof data.valorReferencia !== 'number' || data.valorReferencia < 0) {
            errors.push('O campo "valorReferencia" deve ser um número positivo');
        }
    }

    if (data.unidade && !itensData.UNIDADES.includes(data.unidade)) {
        errors.push(`Unidade inválida. Valores permitidos: ${itensData.UNIDADES.join(', ')}`);
    }

    return errors;
};

// GET /itens
exports.getAll = async (req, res) => {
    try {
        const filters = {
            prestadorId: req.query.prestadorId,
            categoria: req.query.categoria,
            ativo: req.query.ativo === 'true' ? true : (req.query.ativo === 'false' ? false : undefined)
        };

        const itens = await itensData.getAll(filters);

        // Adicionar informações do prestador (Need await due to DB)
        const itensComPrestador = await Promise.all(itens.map(async item => {
            const prestador = await prestadoresData.getById(item.prestadorId);
            return {
                ...item,
                prestadorNome: prestador ? prestador.nome : 'Desconhecido'
            };
        }));

        res.json({
            success: true,
            count: itensComPrestador.length,
            data: itensComPrestador
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar itens' });
    }
};

// GET /itens/categorias
exports.getCategorias = (req, res) => {
    res.json({
        success: true,
        data: itensData.CATEGORIAS
    });
};

// GET /itens/unidades
exports.getUnidades = (req, res) => {
    res.json({
        success: true,
        data: itensData.UNIDADES
    });
};

// GET /itens/:id
exports.getById = async (req, res) => {
    try {
        const item = await itensData.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, error: 'Item não encontrado' });
        }

        const prestador = await prestadoresData.getById(item.prestadorId);

        res.json({
            success: true,
            data: {
                ...item,
                prestadorNome: prestador ? prestador.nome : 'Desconhecido'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar item' });
    }
};

// POST /itens
exports.create = async (req, res) => {
    try {
        const errors = validateItem(req.body);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const newItem = await itensData.create(req.body);

        // Atualizar possibilidades (matches) dinamicamente
        await possibilidadesData.atualizarPorItem(newItem);

        res.status(201).json({
            success: true,
            message: 'Item criado com sucesso',
            data: newItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro ao criar item' });
    }
};

// PUT /itens/:id
exports.update = async (req, res) => {
    try {
        const existing = await itensData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Item não encontrado' });
        }

        const errors = validateItem(req.body, true);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const updated = await itensData.update(req.params.id, req.body);

        // Atualizar possibilidades (matches) dinamicamente
        await possibilidadesData.atualizarPorItem(updated);

        res.json({
            success: true,
            message: 'Item atualizado com sucesso',
            data: updated
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao atualizar item' });
    }
};

// DELETE /itens/:id
exports.remove = async (req, res) => {
    try {
        const existing = await itensData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Item não encontrado' });
        }

        await itensData.remove(req.params.id);

        res.json({
            success: true,
            message: 'Item removido com sucesso'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao remover item' });
    }
};
