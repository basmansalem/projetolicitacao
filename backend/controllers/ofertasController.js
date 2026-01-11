const ofertasData = require('../data/ofertas');
const chamadasData = require('../data/chamadas');
const prestadoresData = require('../data/prestadores');
const possibilidadesData = require('../data/possibilidades');

// Validar oferta
const validateOferta = (data) => {
    const errors = [];

    if (!data.chamadaId) errors.push('ID da chamada é obrigatório');
    if (!data.prestadorId) errors.push('ID do prestador é obrigatório');

    if (data.valor === undefined || data.valor === null) {
        errors.push('Valor é obrigatório');
    } else if (parseFloat(data.valor) <= 0) {
        errors.push('Valor deve ser positivo');
    }

    return errors;
};

// GET /ofertas (filtros query: chamadaId, prestadorId)
exports.getAll = (req, res) => {
    try {
        const filters = {
            chamadaId: req.query.chamadaId,
            prestadorId: req.query.prestadorId
        };

        const ofertas = ofertasData.getAll(filters);
        res.json({ success: true, count: ofertas.length, data: ofertas });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar ofertas' });
    }
};

// GET /ofertas/:id
exports.getById = (req, res) => {
    try {
        const oferta = ofertasData.getById(req.params.id);
        if (!oferta) {
            return res.status(404).json({ success: false, error: 'Oferta não encontrada' });
        }
        res.json({ success: true, data: oferta });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar oferta' });
    }
};

// GET /chamadas/:id/ofertas (Rota aninhada opcional, ou usar getAll com filtro)
exports.getByChamada = (req, res) => {
    try {
        const ofertas = ofertasData.getByChamada(req.params.id);
        res.json({ success: true, count: ofertas.length, data: ofertas });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar ofertas da chamada' });
    }
};

// POST /ofertas
exports.create = (req, res) => {
    try {
        const errors = validateOferta(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // Verificar se chamada existe
        const chamada = chamadasData.getById(req.body.chamadaId);
        if (!chamada) {
            return res.status(404).json({ success: false, error: 'Chamada não encontrada' });
        }

        // Verificar se prestador existe
        const prestador = prestadoresData.getById(req.body.prestadorId);
        if (!prestador) {
            return res.status(404).json({ success: false, error: 'Prestador não encontrado' });
        }

        // Verificar se o prestador tem uma "possibilidade" (match) para esta chamada
        // Opcional: permitir ofertas apenas de quem recebeu alerta?
        // Vamos permitir apenas se houver possibilidade, conforme regra de negócio implícita "alertar prestadores compatíveis"
        const possibilidades = possibilidadesData.getByChamada(req.body.chamadaId);
        const temPossibilidade = possibilidades.some(p => p.prestadorId === req.body.prestadorId);

        if (!temPossibilidade) {
            return res.status(403).json({
                success: false,
                error: 'Este prestador não está habilitado para ofertar nesta chamada (sem compatibilidade de itens).'
            });
        }

        // Adicionar nome do prestador
        const ofertaData = {
            ...req.body,
            prestadorNome: prestador.nome
        };

        const newOferta = ofertasData.create(ofertaData);

        res.status(201).json({
            success: true,
            message: 'Oferta enviada com sucesso',
            data: newOferta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro ao criar oferta' });
    }
};
