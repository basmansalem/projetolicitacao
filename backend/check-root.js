const db = require('./db/database');

async function checkRoot() {
    try {
        console.log('--- CHECKING ROOT USER ---');
        const root = await db.get("SELECT * FROM users WHERE email = 'root@root.com'");
        if (root) {
            console.log('Root user found:', root.nome, root.perfil);
        } else {
            console.log('Root user NOT found!');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Wait for DB init
setTimeout(checkRoot, 1000);
