import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.admin.getAllUsers();
            setUsers(response);
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao carregar usuários: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (targetUser) => {
        try {
            await api.admin.toggleStatus(targetUser.id);
            setUsers(users.map(u =>
                u.id === targetUser.id ? { ...u, ativo: !u.ativo } : u
            ));
            setMessage({ type: 'success', text: `Usuário ${targetUser.ativo ? 'desativado' : 'ativado'} com sucesso.` });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || err.message });
        }
    };

    const handleResetPassword = async (targetUser) => {
        if (!window.confirm(`Tem certeza que deseja redefinir a senha de ${targetUser.nome}?`)) return;

        try {
            await api.admin.resetPassword(targetUser.id);
            setMessage({ type: 'success', text: `Senha de ${targetUser.nome} redefinida. Novo email simulado no console do servidor.` });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || err.message });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>🛡️ Painel do Administrador</h1>
                    <p>Olá, <strong>{user?.nome}</strong></p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
            </header>

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                    <button onClick={() => setMessage(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>x</button>
                </div>
            )}

            <div className="users-list-container">
                <h2>Gerenciamento de Usuários</h2>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Categoria</th>
                            <th>Senha (Hash)</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.nome}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`badge badge-${u.perfil}`}>{u.perfil}</span>
                                </td>
                                <td>{u.categoria}</td>
                                <td title={u.senha} style={{ fontSize: '10px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {u.senha}
                                </td>
                                <td>
                                    <span className={`status-dot ${u.ativo ? 'active' : 'inactive'}`}></span>
                                    {u.ativo ? 'Ativo' : 'Inativo'}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleToggleStatus(u)}
                                            className={`btn-small ${u.ativo ? 'btn-danger' : 'btn-success'}`}
                                            disabled={u.perfil === 'admin' || u.perfil === 'root'}
                                        >
                                            {u.ativo ? 'Bloquear' : 'Ativar'}
                                        </button>
                                        <button
                                            onClick={() => handleResetPassword(u)}
                                            className="btn-small btn-warning"
                                        >
                                            Redefinir Senha
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
