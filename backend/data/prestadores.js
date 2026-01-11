const { v4: uuidv4 } = require('uuid');

// Dados em memória para prestadores
let prestadores = [
    {
        id: uuidv4(),
        nome: 'Tech Solutions Ltda',
        tipo: 'empresa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        nome: 'Construtora Alfa',
        tipo: 'empresa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        nome: 'João Silva - Consultor',
        tipo: 'pessoa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Tipos de prestador
const TIPOS_PRESTADOR = ['empresa', 'pessoa'];

// Funções de acesso aos dados
const getAll = () => prestadores;

const getById = (id) => prestadores.find(p => p.id === id);

const create = (data) => {
    const newPrestador = {
        id: uuidv4(),
        nome: data.nome,
        tipo: data.tipo || 'empresa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    prestadores.push(newPrestador);
    return newPrestador;
};

const update = (id, data) => {
    const index = prestadores.findIndex(p => p.id === id);
    if (index === -1) return null;

    prestadores[index] = {
        ...prestadores[index],
        ...data,
        id: prestadores[index].id,
        createdAt: prestadores[index].createdAt,
        updatedAt: new Date().toISOString()
    };
    return prestadores[index];
};

const remove = (id) => {
    const index = prestadores.findIndex(p => p.id === id);
    if (index === -1) return false;

    prestadores.splice(index, 1);
    return true;
};

module.exports = {
    TIPOS_PRESTADOR,
    getAll,
    getById,
    create,
    update,
    remove
};
