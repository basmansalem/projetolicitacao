const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Tipos de prestador
const TIPOS_PRESTADOR = ['empresa', 'pessoa'];

const getAll = async () => {
    return await db.query("SELECT * FROM prestadores");
};

const getById = async (id) => {
    return await db.get("SELECT * FROM prestadores WHERE id = ?", [id]);
};

const create = async (data) => {
    const newPrestador = {
        id: uuidv4(),
        nome: data.nome,
        email: data.email || '',
        tipo: data.tipo || 'pessoa',
        cnpj: data.cnpj || '',
        cpf: data.cpf || '',
        categoria: data.categoria || 'Geral'
    };

    await db.run(
        `INSERT INTO prestadores (id, nome, email, tipo, cnpj, cpf, categoria) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newPrestador.id, newPrestador.nome, newPrestador.email, newPrestador.tipo, newPrestador.cnpj, newPrestador.cpf, newPrestador.categoria]
    );

    return newPrestador;
};

const update = async (id, data) => {
    // Simplified update (full update)
    await db.run(
        `UPDATE prestadores SET nome = ?, email = ?, categoria = ? WHERE id = ?`,
        [data.nome, data.email, data.categoria, id]
    );
    return { id, ...data };
};

const remove = async (id) => {
    await db.run("DELETE FROM prestadores WHERE id = ?", [id]);
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
