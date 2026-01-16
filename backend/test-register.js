// Native fetch in Node 18+

async function testRegister() {
    console.log("Testing Registration...");
    const payload = {
        nome: "Teste Script",
        email: "teste" + Date.now() + "@exemplo.com",
        senha: "123",
        perfil: "prestador",
        tipoPrestador: "pessoa",
        documento: "12345678900"
    };

    try {
        const response = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log("SUCCESS: User registered.");
        } else {
            console.log("FAILURE: Registration failed.");
        }
    } catch (e) {
        console.error("ERROR: Could not connect to server.", e.message);
    }
}

testRegister();
