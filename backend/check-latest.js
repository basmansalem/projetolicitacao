const db = require('./db/database');

async function checkLatestData() {
    try {
        console.log('--- LATEST USERS ---');
        const users = await db.query("SELECT id, nome, email, perfil, relatedId FROM users ORDER BY createdAt DESC LIMIT 2");
        console.log(JSON.stringify(users, null, 2));

        console.log('\n--- LATEST PRESTADORES ---');
        const prestadores = await db.query("SELECT id, nome, email, categoria FROM prestadores ORDER BY id DESC LIMIT 2");
        console.log(JSON.stringify(prestadores, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Wait for DB init
setTimeout(checkLatestData, 1000);
