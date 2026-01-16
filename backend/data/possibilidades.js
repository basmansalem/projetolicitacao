const { v4: uuidv4 } = require('uuid');
const itensData = require('./itens');
const prestadoresData = require('./prestadores');
const chamadasData = require('./chamadas');

// Helper to calculate score
const calculateScore = (chamada, itens) => {
    let score = 100;
    score += (itens.length - 1) * 5;

    if (chamada.valorMaximo) {
        const valorMedio = itens.reduce((acc, i) => acc + i.valorReferencia, 0) / itens.length;
        if (valorMedio <= chamada.valorMaximo * 0.5) {
            score += 10;
        }
    }
    return Math.min(score, 120);
};

// Generate possibilities on-the-fly (not persisted)
const gerarPossibilidades = async (chamada) => {
    if (!chamada) return [];

    // Busca itens compatíveis (async)
    // Note: getByCategoria is async now
    const itensCompativeis = await itensData.getByCategoria(chamada.categoria, true);

    const itensFiltrados = chamada.valorMaximo
        ? itensCompativeis.filter(i => i.valorReferencia <= chamada.valorMaximo)
        : itensCompativeis;

    const itensPorPrestador = {};
    itensFiltrados.forEach(item => {
        if (!itensPorPrestador[item.prestadorId]) {
            itensPorPrestador[item.prestadorId] = [];
        }
        itensPorPrestador[item.prestadorId].push(item);
    });

    const novasPossibilidades = [];

    // Processing prestadores in parallel or serial? Serial is safer for now.
    // keys of itensPorPrestador
    const prestadorIds = Object.keys(itensPorPrestador);

    for (const prestadorId of prestadorIds) {
        const prestador = await prestadoresData.getById(prestadorId);
        if (!prestador) continue;

        const itens = itensPorPrestador[prestadorId];
        const score = calculateScore(chamada, itens);

        novasPossibilidades.push({
            id: uuidv4(), // Generated on fly, ephemeral
            chamadaId: chamada.id,
            prestadorId: prestadorId,
            prestadorNome: prestador.nome,
            prestadorTipo: prestador.tipo,
            itensCompativeis: itens.map(i => ({
                id: i.id,
                nome: i.nome,
                descricao: i.descricao,
                valorReferencia: i.valorReferencia,
                unidade: i.unidade
            })),
            valorTotal: itens.reduce((acc, i) => acc + i.valorReferencia, 0),
            scoreCompatibilidade: score,
            createdAt: new Date().toISOString()
        });
    }

    novasPossibilidades.sort((a, b) => b.scoreCompatibilidade - a.scoreCompatibilidade);
    return novasPossibilidades;
};

const getByChamada = async (chamadaId) => {
    // Need to fetch chamada first to know criteria
    const chamada = await chamadasData.getById(chamadaId);
    if (!chamada) return [];
    return await gerarPossibilidades(chamada);
};

const countByChamada = async (chamadaId) => {
    const list = await getByChamada(chamadaId);
    return list.length;
};

// No longer needing removal or updates because it's dynamic
const removeByChamada = async (chamadaId) => {
    return true;
};

const actualizarPorItem = async (item) => {
    // No-op for dynamic calculation
    return true;
};

module.exports = {
    gerarPossibilidades,
    getByChamada,
    countByChamada,
    removeByChamada,
    atualizarPorItem: actualizarPorItem
};
