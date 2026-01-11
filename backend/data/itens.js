const { v4: uuidv4 } = require('uuid');
const prestadoresData = require('./prestadores');

// Categorias de itens (enum fixo)
const CATEGORIAS = [
    'Tecnologia',
    'Construção Civil',
    'Serviços Gerais',
    'Saúde',
    'Educação',
    'Transporte e Logística',
    'Alimentação'
];

// Unidades de medida
const UNIDADES = ['unidade', 'hora', 'diária', 'mensal', 'anual', 'projeto'];

// Dados em memória para itens
let itens = [];

// Inicializar com dados de exemplo
const initializeItens = () => {
    const prestadores = prestadoresData.getAll();

    if (prestadores.length >= 3 && itens.length === 0) {
        const techPrestador = prestadores[0];
        const construcaoPrestador = prestadores[1];
        const consultorPrestador = prestadores[2];

        itens = [
            // Itens de Tecnologia
            {
                id: uuidv4(),
                prestadorId: techPrestador.id,
                categoria: 'Tecnologia',
                nome: 'Desenvolvimento de Sistema Web',
                descricao: 'Desenvolvimento completo de sistemas web responsivos com tecnologias modernas',
                valorReferencia: 85000,
                unidade: 'projeto',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: techPrestador.id,
                categoria: 'Tecnologia',
                nome: 'Suporte Técnico',
                descricao: 'Suporte técnico especializado para infraestrutura de TI',
                valorReferencia: 8000,
                unidade: 'mensal',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: techPrestador.id,
                categoria: 'Tecnologia',
                nome: 'Hospedagem de Servidores',
                descricao: 'Serviço de hospedagem em nuvem com alta disponibilidade',
                valorReferencia: 3500,
                unidade: 'mensal',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },

            // Itens de Construção Civil
            {
                id: uuidv4(),
                prestadorId: construcaoPrestador.id,
                categoria: 'Construção Civil',
                nome: 'Reforma Predial',
                descricao: 'Serviços completos de reforma predial incluindo acabamentos',
                valorReferencia: 250000,
                unidade: 'projeto',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: construcaoPrestador.id,
                categoria: 'Construção Civil',
                nome: 'Pintura',
                descricao: 'Serviço de pintura interna e externa',
                valorReferencia: 45000,
                unidade: 'projeto',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: construcaoPrestador.id,
                categoria: 'Construção Civil',
                nome: 'Manutenção Elétrica',
                descricao: 'Manutenção preventiva e corretiva de instalações elétricas',
                valorReferencia: 15000,
                unidade: 'mensal',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },

            // Itens de Educação (Consultor)
            {
                id: uuidv4(),
                prestadorId: consultorPrestador.id,
                categoria: 'Educação',
                nome: 'Cursos de Capacitação',
                descricao: 'Cursos de capacitação profissional em diversas áreas',
                valorReferencia: 12000,
                unidade: 'projeto',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: consultorPrestador.id,
                categoria: 'Educação',
                nome: 'Treinamentos Corporativos',
                descricao: 'Treinamentos personalizados para equipes corporativas',
                valorReferencia: 8500,
                unidade: 'projeto',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                prestadorId: consultorPrestador.id,
                categoria: 'Tecnologia',
                nome: 'Consultoria em TI',
                descricao: 'Consultoria especializada em arquitetura de sistemas',
                valorReferencia: 500,
                unidade: 'hora',
                ativo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
};

// Funções de acesso aos dados
const getAll = (filters = {}) => {
    initializeItens();
    let result = [...itens];

    if (filters.prestadorId) {
        result = result.filter(i => i.prestadorId === filters.prestadorId);
    }
    if (filters.categoria) {
        result = result.filter(i => i.categoria === filters.categoria);
    }
    if (filters.ativo !== undefined) {
        result = result.filter(i => i.ativo === filters.ativo);
    }

    return result;
};

const getById = (id) => {
    initializeItens();
    return itens.find(i => i.id === id);
};

const getByPrestador = (prestadorId) => {
    initializeItens();
    return itens.filter(i => i.prestadorId === prestadorId);
};

const getByCategoria = (categoria, apenasAtivos = true) => {
    initializeItens();
    return itens.filter(i =>
        i.categoria === categoria &&
        (!apenasAtivos || i.ativo)
    );
};

const create = (data) => {
    initializeItens();
    const newItem = {
        id: uuidv4(),
        prestadorId: data.prestadorId,
        categoria: data.categoria,
        nome: data.nome,
        descricao: data.descricao || '',
        valorReferencia: data.valorReferencia,
        unidade: data.unidade || 'unidade',
        ativo: data.ativo !== undefined ? data.ativo : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    itens.push(newItem);
    return newItem;
};

const update = (id, data) => {
    initializeItens();
    const index = itens.findIndex(i => i.id === id);
    if (index === -1) return null;

    itens[index] = {
        ...itens[index],
        ...data,
        id: itens[index].id,
        prestadorId: itens[index].prestadorId,
        createdAt: itens[index].createdAt,
        updatedAt: new Date().toISOString()
    };
    return itens[index];
};

const remove = (id) => {
    initializeItens();
    const index = itens.findIndex(i => i.id === id);
    if (index === -1) return false;

    itens.splice(index, 1);
    return true;
};

module.exports = {
    CATEGORIAS,
    UNIDADES,
    getAll,
    getById,
    getByPrestador,
    getByCategoria,
    create,
    update,
    remove
};
