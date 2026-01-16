const db = require('./db/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedPrestador() {
    try {
        const prestadorEmail = 'prestador@teste.com';
        const existing = await db.get("SELECT * FROM users WHERE email = ?", [prestadorEmail]);

        if (existing) {
            console.log('User prestador@teste.com already exists.');
            return;
        }

        const prestadorId = uuidv4();
        const relatedId = uuidv4(); // Simulated related prestador record ID
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('123456', salt);

        // Create User
        await db.run(
            `INSERT INTO users (id, nome, email, senha, perfil, relatedId, ativo, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [prestadorId, 'Prestador Teste', prestadorEmail, hash, 'prestador', relatedId, 1, new Date().toISOString()]
        );

        // Also create the Prestador record itself (important for logic!)
        await db.run(
            `INSERT INTO prestadores (id, nome, email, tipo, categoria) 
             VALUES (?, ?, ?, ?, ?)`,
            [relatedId, 'Prestador Teste', prestadorEmail, 'pessoa', 'Tecnologia']
        );

        console.log('Prestador user seeded successfully.');
    } catch (err) {
        console.error('Error seeding prestador:', err);
    }
}

// Wait for DB init
setTimeout(seedPrestador, 1000);
