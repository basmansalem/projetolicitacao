const { v4: uuidv4 } = require('uuid');
const itensData = require('./itens');
const prestadoresData = require('./prestadores');
const chamadasData = require('./chamadas');

// Dados em memória para possibilidades
let possibilidades = [];

// Gerar possibilidades para uma chamada
const gerarPossibilidades = (chamada) => {
    // Remover possibilidades antigas desta chamada
    possibilidades = possibilidades.filter(p => p.chamadaId !== chamada.id);

    // Buscar itens ativos na mesma categoria
    const itensCompativeis = itensData.getByCategoria(chamada.categoria, true);

    // Filtrar por valor máximo (se definido)
    const itensFiltrados = chamada.valorMaximo
        ? itensCompativeis.filter(i => i.valorReferencia <= chamada.valorMaximo)
        : itensCompativeis;

    // Agrupar itens por prestador
    const itensPorPrestador = {};
    itensFiltrados.forEach(item => {
        if (!itensPorPrestador[item.prestadorId]) {
            itensPorPrestador[item.prestadorId] = [];
        }
        itensPorPrestador[item.prestadorId].push(item);
    });

    // Criar possibilidades para cada prestador
    const novasPossibilidades = [];

    Object.entries(itensPorPrestador).forEach(([prestadorId, itens]) => {
        const prestador = prestadoresData.getById(prestadorId);
        if (!prestador) return;

        // Calcular score de compatibilidade
        let score = 100;

        // Bonus por ter múltiplos itens compatíveis
        score += (itens.length - 1) * 5;

        // Bonus se valor médio é <= 50% do máximo
        if (chamada.valorMaximo) {
            const valorMedio = itens.reduce((acc, i) => acc + i.valorReferencia, 0) / itens.length;
            if (valorMedio <= chamada.valorMaximo * 0.5) {
                score += 10;
            }
        }

        // Limitar score máximo
        score = Math.min(score, 120);

        const possibilidade = {
            id: uuidv4(),
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
        };

        novasPossibilidades.push(possibilidade);
        possibilidades.push(possibilidade);
    });

    // Ordenar por score (maior primeiro)
    novasPossibilidades.sort((a, b) => b.scoreCompatibilidade - a.scoreCompatibilidade);

    return novasPossibilidades;
};

// Funções de acesso aos dados
const getByChamada = (chamadaId) => {
    return possibilidades
        .filter(p => p.chamadaId === chamadaId)
        .sort((a, b) => b.scoreCompatibilidade - a.scoreCompatibilidade);
};

const getById = (id) => possibilidades.find(p => p.id === id);

const getAll = () => possibilidades;

const countByChamada = (chamadaId) => {
    return possibilidades.filter(p => p.chamadaId === chamadaId).length;
};

const removeByChamada = (chamadaId) => {
    possibilidades = possibilidades.filter(p => p.chamadaId !== chamadaId);
};

// Atualizar possibilidades quando um item é criado ou alterado
const atualizarPorItem = (item) => {
    // Buscar chamadas da mesma categoria e "Aberta" ou "Em análise" (que aceitam propostas)
    const allChamadas = chamadasData.getAll();
    const chamadasRelevantes = allChamadas.filter(c =>
        c.categoria === item.categoria &&
        (c.status === 'Aberta' || c.status === 'Em análise')
    );

    console.log(`[Possibilidades] Item atualizado: ${item.nome}. Atualizando ${chamadasRelevantes.length} chamadas.`);

    chamadasRelevantes.forEach(chamada => {
        gerarPossibilidades(chamada);
    });
};

module.exports = {
    gerarPossibilidades,
    getByChamada,
    getById,
    getAll,
    countByChamada,
    removeByChamada,
    atualizarPorItem
};
