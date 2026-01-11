const { v4: uuidv4 } = require('uuid');

// Status das chamadas
const STATUS_CHAMADA = [
    'Aberta',
    'Em análise',
    'Contratada',
    'Encerrada'
];

// Dados em memória para chamadas
let chamadas = [
    {
        id: uuidv4(),
        titulo: 'Desenvolvimento de Portal Institucional',
        descricao: 'Contratação de empresa para desenvolvimento de portal web institucional com CMS integrado',
        categoria: 'Tecnologia',
        quantidade: 1,
        valorMaximo: 150000,
        prazoExecucao: '2026-06-30',
        status: 'Aberta',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        titulo: 'Reforma do Prédio Administrativo',
        descricao: 'Serviços de reforma geral do prédio administrativo incluindo pintura e instalações',
        categoria: 'Construção Civil',
        quantidade: 1,
        valorMaximo: 500000,
        prazoExecucao: '2026-12-31',
        status: 'Aberta',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Funções de acesso aos dados
const getAll = (filters = {}) => {
    let result = [...chamadas];

    if (filters.categoria) {
        result = result.filter(c => c.categoria === filters.categoria);
    }
    if (filters.status) {
        result = result.filter(c => c.status === filters.status);
    }

    return result;
};

const getById = (id) => chamadas.find(c => c.id === id);

const create = (data) => {
    const newChamada = {
        id: uuidv4(),
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria: data.categoria,
        quantidade: data.quantidade || 1,
        valorMaximo: data.valorMaximo,
        prazoExecucao: data.prazoExecucao,
        status: data.status || 'Aberta',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    chamadas.push(newChamada);
    return newChamada;
};

const update = (id, data) => {
    const index = chamadas.findIndex(c => c.id === id);
    if (index === -1) return null;

    chamadas[index] = {
        ...chamadas[index],
        ...data,
        id: chamadas[index].id,
        createdAt: chamadas[index].createdAt,
        updatedAt: new Date().toISOString()
    };
    return chamadas[index];
};

const remove = (id) => {
    const index = chamadas.findIndex(c => c.id === id);
    if (index === -1) return false;

    chamadas.splice(index, 1);
    return true;
};

module.exports = {
    STATUS_CHAMADA,
    getAll,
    getById,
    create,
    update,
    remove
};
