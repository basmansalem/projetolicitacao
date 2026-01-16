const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const getAll = async (filters = {}) => {
    let sql = "SELECT * FROM ofertas WHERE 1=1";
    const params = [];

    if (filters.chamadaId) {
        sql += " AND chamadaId = ?";
        params.push(filters.chamadaId);
    }
    if (filters.prestadorId) {
        sql += " AND prestadorId = ?";
        params.push(filters.prestadorId);
    }
    sql += " ORDER BY valor ASC"; // Default sort
    return await db.query(sql, params);
};

const getById = async (id) => {
    return await db.get("SELECT * FROM ofertas WHERE id = ?", [id]);
};

const getByChamada = async (chamadaId) => {
    return await db.query("SELECT * FROM ofertas WHERE chamadaId = ? ORDER BY valor ASC", [chamadaId]);
};

const create = async (data) => {
    const newOferta = {
        id: uuidv4(),
        chamadaId: data.chamadaId,
        prestadorId: data.prestadorId,
        prestadorNome: data.prestadorNome,
        valor: typeof data.valor === 'string' ? parseFloat(data.valor) : data.valor,
        descricao: data.descricao || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await db.run(
        `INSERT INTO ofertas (id, chamadaId, prestadorId, prestadorNome, valor, descricao, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newOferta.id, newOferta.chamadaId, newOferta.prestadorId, newOferta.prestadorNome, newOferta.valor, newOferta.descricao, newOferta.createdAt, newOferta.updatedAt]
    );

    return newOferta;
};

const remove = async (id) => {
    await db.run("DELETE FROM ofertas WHERE id = ?", [id]);
    return true;
};

const removeByChamada = async (chamadaId) => {
    await db.run("DELETE FROM ofertas WHERE chamadaId = ?", [chamadaId]);
};

module.exports = {
    getAll,
    getById,
    getByChamada,
    create,
    remove,
    removeByChamada
};
