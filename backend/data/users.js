const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const getAll = async () => {
    return await db.query("SELECT * FROM users");
};

const getAllWithDetails = async () => {
    return await db.query(`
        SELECT u.*, p.categoria 
        FROM users u 
        LEFT JOIN prestadores p ON u.email = p.email
    `);
};

const getByEmail = async (email) => {
    return await db.get("SELECT * FROM users WHERE email = ?", [email]);
};

const getByNome = async (nome) => {
    return await db.get("SELECT * FROM users WHERE lower(nome) = ?", [nome.toLowerCase()]);
};

const create = async (data) => {
    const newUser = {
        id: uuidv4(),
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        perfil: data.perfil,
        relatedId: data.relatedId || null,
        ativo: data.ativo !== undefined ? data.ativo : 1,
        createdAt: new Date().toISOString()
    };

    await db.run(
        `INSERT INTO users (id, nome, email, senha, perfil, relatedId, ativo, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newUser.id, newUser.nome, newUser.email, newUser.senha, newUser.perfil, newUser.relatedId, newUser.ativo, newUser.createdAt]
    );

    return newUser;
};

// Seed initial Admin
const seedAdmin = async (hash) => {
    const admin = await getByEmail('admin@admin.com');
    if (!admin) {
        const adminId = 'admin-id';
        await db.run(
            `INSERT INTO users (id, nome, email, senha, perfil, ativo, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [adminId, 'Administrador', 'admin@admin.com', hash, 'admin', 1, new Date().toISOString()]
        );
        console.log('Admin user seeded.');
    }
};

// Seed Root User (Super Admin)
const seedRoot = async (hash) => {
    const root = await getByEmail('root@root.com');
    if (!root) {
        const rootId = 'root-id';
        await db.run(
            `INSERT INTO users (id, nome, email, senha, perfil, ativo, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [rootId, 'Root User', 'root@root.com', hash, 'root', 1, new Date().toISOString()]
        );
        console.log('Root user seeded.');
    }
};

const updateStatus = async (id, status) => {
    await db.run("UPDATE users SET ativo = ? WHERE id = ?", [status ? 1 : 0, id]);
};

const updatePassword = async (id, hash) => {
    await db.run("UPDATE users SET senha = ? WHERE id = ?", [hash, id]);
};

module.exports = {
    getAll,
    getAllWithDetails,
    getByEmail,
    getByNome,
    create,
    seedAdmin,
    seedRoot,
    updateStatus,
    updatePassword
};
