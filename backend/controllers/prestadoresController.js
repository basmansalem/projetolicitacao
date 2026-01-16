const prestadoresData = require('../data/prestadores');
const itensData = require('../data/itens');

// Validação
const validatePrestador = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.nome !== undefined) {
        if (!data.nome || data.nome.trim() === '') {
            errors.push('O campo "nome" é obrigatório');
        }
    }

    if (data.tipo && !prestadoresData.TIPOS_PRESTADOR.includes(data.tipo)) {
        errors.push(`Tipo inválido. Valores permitidos: ${prestadoresData.TIPOS_PRESTADOR.join(', ')}`);
    }

    if (!isUpdate || data.cnpj !== undefined) {
        if (data.tipo === 'empresa' && (!data.cnpj || data.cnpj.trim() === '')) {
            // Validar apenas se for empresa e estiver sendo enviado
            // Nota: Para POC não vamos validar o formato estrito do CNPJ
            // errors.push('CNPJ é obrigatório para empresas');
        }
    }

    if (!isUpdate || data.categoria !== undefined) {
        if (data.categoria && !itensData.CATEGORIAS.includes(data.categoria)) {
            // Validar categoria se fornecida
            errors.push(`Categoria inválida. Valores permitidos: ${itensData.CATEGORIAS.join(', ')}`);
        }
    }

    return errors;
};

// GET /prestadores
exports.getAll = (req, res) => {
    try {
        const prestadores = prestadoresData.getAll();

        // Adicionar contagem de itens para cada prestador
        const prestadoresComItens = prestadores.map(p => ({
            ...p,
            quantidadeItens: itensData.getByPrestador(p.id).length
        }));

        res.json({
            success: true,
            count: prestadoresComItens.length,
            data: prestadoresComItens
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar prestadores' });
    }
};

// GET /prestadores/:id
exports.getById = (req, res) => {
    try {
        const prestador = prestadoresData.getById(req.params.id);

        if (!prestador) {
            return res.status(404).json({ success: false, error: 'Prestador não encontrado' });
        }

        // Incluir itens do prestador
        const itens = itensData.getByPrestador(prestador.id);

        res.json({
            success: true,
            data: {
                ...prestador,
                itens
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar prestador' });
    }
};

// POST /prestadores
exports.create = (req, res) => {
    try {
        const errors = validatePrestador(req.body);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const newPrestador = prestadoresData.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Prestador criado com sucesso',
            data: newPrestador
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao criar prestador' });
    }
};

// PUT /prestadores/:id
exports.update = (req, res) => {
    try {
        const existing = prestadoresData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Prestador não encontrado' });
        }

        const errors = validatePrestador(req.body, true);

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const updated = prestadoresData.update(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Prestador atualizado com sucesso',
            data: updated
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao atualizar prestador' });
    }
};

// DELETE /prestadores/:id
exports.remove = (req, res) => {
    try {
        const existing = prestadoresData.getById(req.params.id);

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Prestador não encontrado' });
        }

        prestadoresData.remove(req.params.id);

        res.json({
            success: true,
            message: 'Prestador removido com sucesso'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao remover prestador' });
    }
};
