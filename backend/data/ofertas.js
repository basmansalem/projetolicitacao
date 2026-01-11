const { v4: uuidv4 } = require('uuid');

// Dados em memória para ofertas
let ofertas = [];

// Funções de acesso aos dados
const getAll = (filters = {}) => {
    let result = [...ofertas];

    if (filters.chamadaId) {
        result = result.filter(o => o.chamadaId === filters.chamadaId);
    }
    if (filters.prestadorId) {
        result = result.filter(o => o.prestadorId === filters.prestadorId);
    }

    return result;
};

const getById = (id) => ofertas.find(o => o.id === id);

const getByChamada = (chamadaId) => {
    return ofertas
        .filter(o => o.chamadaId === chamadaId)
        .sort((a, b) => a.valor - b.valor); // Menor valor primeiro
};

const create = (data) => {
    const newOferta = {
        id: uuidv4(),
        chamadaId: data.chamadaId,
        prestadorId: data.prestadorId,
        prestadorNome: data.prestadorNome, // Desnormalizado para facilitar
        valor: typeof data.valor === 'string' ? parseFloat(data.valor) : data.valor,
        descricao: data.descricao || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    ofertas.push(newOferta);
    return newOferta;
};

const remove = (id) => {
    const index = ofertas.findIndex(o => o.id === id);
    if (index === -1) return false;

    ofertas.splice(index, 1);
    return true;
};

const removeByChamada = (chamadaId) => {
    ofertas = ofertas.filter(o => o.chamadaId !== chamadaId);
};

module.exports = {
    getAll,
    getById,
    getByChamada,
    create,
    remove,
    removeByChamada
};
