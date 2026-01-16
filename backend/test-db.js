try {
    console.log('Attempting to require database.js...');
    const db = require('./db/database');
    console.log('Successfully required database.js');
    console.log('DB Object:', db);
} catch (error) {
    console.error('CRASHED requiring database.js');
    console.error(error);
}
