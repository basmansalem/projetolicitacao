const db = require('./db/database');

async function listUsers() {
    try {
        const users = await db.query("SELECT * FROM users");
        console.log('Users found:', users);
    } catch (err) {
        console.error('Error listing users:', err);
    }
}

// Wait for DB init
setTimeout(listUsers, 1000);
