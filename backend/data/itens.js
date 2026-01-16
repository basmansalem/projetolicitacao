const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

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

const getAll = async (filters = {}) => {
    let sql = "SELECT * FROM itens WHERE 1=1";
    const params = [];

    if (filters.prestadorId) {
        sql += " AND prestadorId = ?";
        params.push(filters.prestadorId);
    }
    if (filters.categoria) {
        sql += " AND categoria = ?";
        params.push(filters.categoria);
    }
    if (filters.ativo !== undefined) {
        sql += " AND ativo = ?";
        params.push(filters.ativo ? 1 : 0);
    }

    return await db.query(sql, params);
};

const getById = async (id) => {
    return await db.get("SELECT * FROM itens WHERE id = ?", [id]);
};

const getByPrestador = async (prestadorId) => {
    return await db.query("SELECT * FROM itens WHERE prestadorId = ?", [prestadorId]);
};

const getByCategoria = async (categoria, apenasAtivos = true) => {
    let sql = "SELECT * FROM itens WHERE categoria = ?";
    const params = [categoria];
    if (apenasAtivos) {
        sql += " AND ativo = 1";
    }
    return await db.query(sql, params);
};

const create = async (data) => {
    const newItem = {
        id: uuidv4(),
        prestadorId: data.prestadorId,
        categoria: data.categoria,
        nome: data.nome,
        descricao: data.descricao || '',
        valorReferencia: data.valorReferencia,
        unidade: data.unidade || 'unidade',
        ativo: data.ativo !== undefined ? data.ativo : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await db.run(
        `INSERT INTO itens (id, prestadorId, categoria, nome, descricao, valorReferencia, unidade, ativo, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newItem.id, newItem.prestadorId, newItem.categoria, newItem.nome, newItem.descricao, newItem.valorReferencia, newItem.unidade, newItem.ativo, newItem.createdAt, newItem.updatedAt]
    );

    return newItem;
};

const update = async (id, data) => {
    const existing = await getById(id);
    if (!existing) return null;

    const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString()
    };

    await db.run(
        `UPDATE itens SET 
            categoria = ?, nome = ?, descricao = ?, valorReferencia = ?, 
            unidade = ?, ativo = ?, updatedAt = ?
         WHERE id = ?`,
        [updated.categoria, updated.nome, updated.descricao, updated.valorReferencia, updated.unidade, updated.ativo ? 1 : 0, updated.updatedAt, id]
    );

    return updated;
};

const remove = async (id) => {
    await db.run("DELETE FROM itens WHERE id = ?", [id]);
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
