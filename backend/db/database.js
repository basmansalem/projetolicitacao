const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT UNIQUE,
            senha TEXT NOT NULL,
            perfil TEXT NOT NULL,
            relatedId TEXT,
            ativo INTEGER DEFAULT 1,
            createdAt TEXT
        )`);

        // Prestadores Table
        db.run(`CREATE TABLE IF NOT EXISTS prestadores (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT,
            tipo TEXT,
            cnpj TEXT,
            cpf TEXT,
            categoria TEXT
        )`);

        // Chamadas Table
        db.run(`CREATE TABLE IF NOT EXISTS chamadas (
            id TEXT PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT,
            categoria TEXT,
            quantidade INTEGER,
            valorMaximo REAL,
            prazoExecucao TEXT,
            status TEXT DEFAULT 'Aberta',
            createdAt TEXT,
            updatedAt TEXT
        )`);

        // Ofertas Table
        db.run(`CREATE TABLE IF NOT EXISTS ofertas (
            id TEXT PRIMARY KEY,
            chamadaId TEXT,
            prestadorId TEXT,
            prestadorNome TEXT,
            valor REAL,
            descricao TEXT,
            createdAt TEXT,
            updatedAt TEXT,
            FOREIGN KEY(chamadaId) REFERENCES chamadas(id),
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id)
        )`);

        // Itens Table
        db.run(`CREATE TABLE IF NOT EXISTS itens (
            id TEXT PRIMARY KEY,
            prestadorId TEXT,
            categoria TEXT,
            nome TEXT NOT NULL,
            descricao TEXT,
            valorReferencia REAL,
            unidade TEXT,
            ativo INTEGER DEFAULT 1,
            createdAt TEXT,
            updatedAt TEXT,
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id)
        )`);

        console.log('Database tables initialized.');
    });
}

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

module.exports = { db, query, get, run };
