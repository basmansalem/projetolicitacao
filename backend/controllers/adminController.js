const usersData = require('../data/users');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const users = await usersData.getAllWithDetails();
        // Plain sqlite objects are already JSON-friendly, checking fields
        const safeUsers = users.map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            perfil: u.perfil,
            senha: u.senha, // Passando o hash conforme solicitado
            categoria: u.categoria || (u.perfil === 'admin' || u.perfil === 'root' ? 'Administração' : 'Contratante'),
            ativo: u.ativo === 1 || u.ativo === true, // handle sqlite 1/0
            createdAt: u.createdAt
        }));
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Ideally getById, but getAll works for now
        const users = await usersData.getAll();
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.perfil === 'admin') {
            return res.status(400).json({ error: 'Não é possível desativar o administrador principal' });
        }

        const newStatus = !user.ativo; // Toggle
        await usersData.updateStatus(id, newStatus);

        res.json({ message: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso` });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao alterar status' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await usersData.getAll();
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const newPassword = Math.random().toString(36).slice(-8);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        await usersData.updatePassword(id, hash);

        console.log(`[EMAIL SIMULADO] Para: ${user.email} | Assunto: Redefinição de Senha | Nova Senha: ${newPassword}`);

        res.json({ message: 'Senha redefinida com sucesso. Email enviado.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
};

module.exports = {
    getAllUsers,
    toggleStatus,
    resetPassword
};
