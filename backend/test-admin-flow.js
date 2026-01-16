const fetch = require('node-fetch'); // Or native fetch in Node 18+

const BASE_URL = 'http://localhost:3001';

async function testAdminFlow() {
    try {
        console.log('1. Registering new Contratante...');
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Teste User',
                email: 'teste@user.com', // Legacy field, logic uses name or email
                senha: '123',
                perfil: 'contratante',
                documento: '12345678900'
            })
        });
        const regData = await regRes.json();
        console.log('Register Response:', regData);

        if (!regRes.ok) throw new Error('Registration failed');

        console.log('\n2. Logging in as Admin...');
        // Note: Login now accepts 'nome' or 'email'. Admin seed has email admin@admin.com
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Administrador', // Trying name login
                senha: 'admin'
            })
        });
        const loginData = await loginRes.json();
        console.log('Admin Login Response:', loginData.user ? 'Success' : 'Failed');

        if (!loginRes.ok) throw new Error('Admin login failed');

        console.log('\n3. Fetching All Users...');
        const listRes = await fetch(`${BASE_URL}/admin/users`, {
            method: 'GET'
        });
        const listData = await listRes.json();
        console.log('Users found:', listData.length);
        console.log('List content:', listData);

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAdminFlow();
