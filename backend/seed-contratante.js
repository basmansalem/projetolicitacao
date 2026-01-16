const db = require('./db/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedContratante() {
    try {
        const email = 'contratante@teste.com';
        const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);

        if (existing) {
            console.log('User contratante@teste.com already exists.');
            return;
        }

        const id = uuidv4();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('123456', salt);

        // Create User - Contratante doesn't need a separate "profile" table for now, or maybe it does?
        // The instructions said "Contratante" logic is simpler.
        // Dashboard uses `user.nome`.

        await db.run(
            `INSERT INTO users (id, nome, email, senha, perfil, ativo, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, 'Contratante Teste', email, hash, 'contratante', 1, new Date().toISOString()]
        );

        console.log('Contratante user seeded successfully.');
    } catch (err) {
        console.error('Error seeding contratante:', err);
    }
}

// Wait for DB init
setTimeout(seedContratante, 1000);
