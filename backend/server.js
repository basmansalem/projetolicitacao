const express = require('express');
const cors = require('cors');

// Rotas
const licitacoesRoutes = require('./routes/licitacoes');
const prestadoresRoutes = require('./routes/prestadores');
const itensRoutes = require('./routes/itens');
const chamadasRoutes = require('./routes/chamadas');

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

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   - Licitações: http://localhost:${PORT}/licitacoes`);
    console.log(`   - Prestadores: http://localhost:${PORT}/prestadores`);
    console.log(`   - Itens: http://localhost:${PORT}/itens`);
    console.log(`   - Chamadas: http://localhost:${PORT}/chamadas`);
});
