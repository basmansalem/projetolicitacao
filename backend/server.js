const express = require('express');
const cors = require('cors');

// Rotas
const licitacoesRoutes = require('./routes/licitacoes');
const prestadoresRoutes = require('./routes/prestadores');
const itensRoutes = require('./routes/itens');
const chamadasRoutes = require('./routes/chamadas');
const ofertasRoutes = require('./routes/ofertas');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes - Licitações (legado)
app.use('/licitacoes', licitacoesRoutes);

// Routes - Novo modelo Prestador/Contratante
app.use('/prestadores', prestadoresRoutes);
app.use('/itens', itensRoutes);
app.use('/chamadas', chamadasRoutes);
app.use('/ofertas', ofertasRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'API Sistema de Controle de Licitações',
        version: '2.0.0',
        status: 'online',
        endpoints: {
            licitacoes: '/licitacoes',
            prestadores: '/prestadores',
            itens: '/itens',
            chamadas: '/chamadas'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'API Backend Licitações Running' });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Seed Admin User after server starts (to ensure DB tables exist)
    try {
        const usersData = require('./data/users');
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin', salt); // Senha padrão: admin
        const hashRoot = bcrypt.hashSync('root123', salt); // Senha Root: root123

        // Pequeno delay para garantir que o sqlite criou as tabelas
        setTimeout(async () => {
            await usersData.seedAdmin(hash);
            await usersData.seedRoot(hashRoot);
        }, 1000);
    } catch (err) {
        console.error("Erro ao semear admin:", err);
    }
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   - Licitações: http://localhost:${PORT}/licitacoes`);
    console.log(`   - Prestadores: http://localhost:${PORT}/prestadores`);
    console.log(`   - Itens: http://localhost:${PORT}/itens`);
    console.log(`   - Chamadas: http://localhost:${PORT}/chamadas`);
    console.log(`   - Ofertas: http://localhost:${PORT}/ofertas`);
});
