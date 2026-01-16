const usersData = require('./data/users');
const bcrypt = require('bcryptjs');

async function manualSeed() {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashRoot = bcrypt.hashSync('root123', salt);

        console.log('--- MANUAL SEED ROOT ---');
        await usersData.seedRoot(hashRoot);
        console.log('Seed finished.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Wait for DB init
setTimeout(manualSeed, 1000);
