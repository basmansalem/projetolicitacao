const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Status das chamadas
const STATUS_CHAMADA = [
    'Aberta',
    'Em análise',
    'Contratada',
    'Encerrada'
];

const getAll = async (filters = {}) => {
    let sql = "SELECT * FROM chamadas WHERE 1=1";
    const params = [];

    if (filters.categoria) {
        sql += " AND categoria = ?";
        params.push(filters.categoria);
    }
    if (filters.status) {
        sql += " AND status = ?";
        params.push(filters.status);
    }

    // Default sorting by creation date DESC
    sql += " ORDER BY createdAt DESC";

    return await db.query(sql, params);
};

const getById = async (id) => {
    return await db.get("SELECT * FROM chamadas WHERE id = ?", [id]);
};

const create = async (data) => {
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

    await db.run(
        `INSERT INTO chamadas (id, titulo, descricao, categoria, quantidade, valorMaximo, prazoExecucao, status, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newChamada.id, newChamada.titulo, newChamada.descricao, newChamada.categoria, newChamada.quantidade, newChamada.valorMaximo, newChamada.prazoExecucao, newChamada.status, newChamada.createdAt, newChamada.updatedAt]
    );

    return newChamada;
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
        `UPDATE chamadas SET 
            titulo = ?, descricao = ?, categoria = ?, quantidade = ?, 
            valorMaximo = ?, prazoExecucao = ?, status = ?, updatedAt = ?
         WHERE id = ?`,
        [updated.titulo, updated.descricao, updated.categoria, updated.quantidade, updated.valorMaximo, updated.prazoExecucao, updated.status, updated.updatedAt, id]
    );

    return updated;
};

const remove = async (id) => {
    await db.run("DELETE FROM chamadas WHERE id = ?", [id]);
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
