const { v4: uuidv4 } = require('uuid');

// Status permitidos
const STATUS = {
    CADASTRADA: 'Cadastrada',
    PUBLICADA: 'Publicada',
    EM_DISPUTA: 'Em disputa',
    HOMOLOGADA: 'Homologada',
    ENCERRADA: 'Encerrada'
};

const STATUS_LIST = Object.values(STATUS);

// Dados em memória com exemplos iniciais
let licitacoes = [
    {
        id: uuidv4(),
        numero: '001/2026',
        orgao: 'Prefeitura Municipal de São Paulo',
        objeto: 'Aquisição de equipamentos de informática para as escolas municipais',
        modalidade: 'Pregão Eletrônico',
        valorEstimado: 250000.00,
        status: STATUS.PUBLICADA,
        dataAbertura: '2026-01-20',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        numero: '002/2026',
        orgao: 'Secretaria de Saúde',
        objeto: 'Contratação de serviços de limpeza hospitalar',
        modalidade: 'Concorrência',
        valorEstimado: 1500000.00,
        status: STATUS.CADASTRADA,
        dataAbertura: '2026-02-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        numero: '003/2026',
        orgao: 'Departamento de Obras',
        objeto: 'Pavimentação asfáltica de vias urbanas - Lote 3',
        modalidade: 'Tomada de Preços',
        valorEstimado: 850000.00,
        status: STATUS.EM_DISPUTA,
        dataAbertura: '2026-01-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Funções de acesso aos dados
const getAll = () => licitacoes;

const getById = (id) => licitacoes.find(l => l.id === id);

const create = (data) => {
    const newLicitacao = {
        id: uuidv4(),
        ...data,
        status: data.status || STATUS.CADASTRADA,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    licitacoes.push(newLicitacao);
    return newLicitacao;
};

const update = (id, data) => {
    const index = licitacoes.findIndex(l => l.id === id);
    if (index === -1) return null;

    licitacoes[index] = {
        ...licitacoes[index],
        ...data,
        id: licitacoes[index].id, // Preserva o ID original
        createdAt: licitacoes[index].createdAt, // Preserva data de criação
        updatedAt: new Date().toISOString()
    };
    return licitacoes[index];
};

const remove = (id) => {
    const index = licitacoes.findIndex(l => l.id === id);
    if (index === -1) return false;

    licitacoes.splice(index, 1);
    return true;
};

module.exports = {
    STATUS,
    STATUS_LIST,
    getAll,
    getById,
    create,
    update,
    remove
};
