import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { CATEGORIAS } from '../../services/api';
import './PrestadorDashboard.css';
import OportunidadesList from './OportunidadesList';

function PrestadorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Estado
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [oportunidadesCount, setOportunidadesCount] = useState(0);

    // O ID do prestador vem do usuário logado
    const prestadorId = user?.relatedId;

    console.log('PrestadorDashboard Debug:', {
        user,
        prestadorId,
        loading,
        itensCount: itens.length
    });

    useEffect(() => {
        if (prestadorId) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [prestadorId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Carregar itens do prestador
            const itensRes = await api.itens.getAll({ prestadorId });
            setItens(itensRes.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleToggleAtivo = async (item) => {
        try {
            await api.itens.update(item.id, { ativo: !item.ativo });
            setItens(itens.map(i => i.id === item.id ? { ...i, ativo: !i.ativo } : i));
            setMessage({ type: 'success', text: `Item ${item.ativo ? 'desativado' : 'ativado'} com sucesso!` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Deseja excluir o item "${item.nome}"?`)) return;

        try {
            await api.itens.delete(item.id);
            setItens(itens.filter(i => i.id !== item.id));
            setMessage({ type: 'success', text: 'Item excluído com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const itensFiltrados = filtroCategoria
        ? itens.filter(i => i.categoria === filtroCategoria)
        : itens;

    const estatisticas = {
        total: itens.length,
        ativos: itens.filter(i => i.ativo).length,
        categorias: [...new Set(itens.map(i => i.categoria))].length,
        valorTotal: itens.reduce((acc, i) => acc + i.valorReferencia, 0)
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    if (!prestadorId) {
        return (
            <div className="prestador-dashboard">
                <header className="dashboard-header">
                    <h1>🏢 Painel do Prestador</h1>
                    <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
                </header>
                <div className="message message-error">
                    Erro: Seu usuário não está vinculado a um perfil de prestador válido.
                </div>
            </div>
        );
    }

    return (
        <div className="prestador-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>🏢 Painel do Prestador</h1>
                    <p>Olá, <strong>{user?.nome}</strong></p>
                </div>

                <div className="header-right">
                    {/* Botão de Notificação */}
                    <div className="notification-icon-container" title="Novas Oportunidades">
                        <span className="notification-icon">🔔</span>
                        {oportunidadesCount > 0 && (
                            <span className="notification-badge">{oportunidadesCount}</span>
                        )}
                    </div>

                    <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '15px' }}>
                        Sair
                    </button>
                </div>
            </header>

            {/* Modal removido pois o cadastro é na tela de registro */}

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            {error && (
                <div className="message message-error">
                    Erro: {error}
                </div>
            )}

            {/* Lista de Oportunidades */}
            {prestadorId && (
                <OportunidadesList
                    prestadorId={prestadorId}
                    onUpdateCount={setOportunidadesCount}
                />
            )}

            {/* Estatísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.total}</span>
                        <span className="stat-label">Itens Cadastrados</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.ativos}</span>
                        <span className="stat-label">Itens Ativos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📁</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.categorias}</span>
                        <span className="stat-label">Categorias</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                        <span className="stat-value">{formatCurrency(estatisticas.valorTotal)}</span>
                        <span className="stat-label">Valor Total</span>
                    </div>
                </div>
            </div>

            {/* Filtros e Ações */}
            <div className="actions-bar">
                <div className="filters">
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas as categorias</option>
                        {CATEGORIAS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <Link to="/prestador/item/novo" className="btn btn-primary">
                    + Novo Item
                </Link>
            </div>

            {/* Lista de Itens */}
            {itensFiltrados.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h2>Nenhum item cadastrado</h2>
                    <p>Comece cadastrando seus itens e serviços!</p>
                    <Link to="/prestador/item/novo" className="btn btn-primary">
                        Cadastrar Item
                    </Link>
                </div>
            ) : (
                <div className="items-grid">
                    {itensFiltrados.map(item => (
                        <div key={item.id} className={`item-card ${!item.ativo ? 'inactive' : ''}`}>
                            <div className="item-header">
                                <span className="item-categoria">{item.categoria}</span>
                                <button
                                    className={`toggle-btn ${item.ativo ? 'active' : ''}`}
                                    onClick={() => handleToggleAtivo(item)}
                                    title={item.ativo ? 'Desativar' : 'Ativar'}
                                >
                                    {item.ativo ? '✓' : '○'}
                                </button>
                            </div>
                            <h3 className="item-nome">{item.nome}</h3>
                            <p className="item-descricao">{item.descricao || 'Sem descrição'}</p>
                            <div className="item-footer">
                                <div className="item-valor">
                                    <span className="valor">{formatCurrency(item.valorReferencia)}</span>
                                    <span className="unidade">/ {item.unidade}</span>
                                </div>
                                <div className="item-actions">
                                    <Link to={`/prestador/item/${item.id}`} className="btn-icon" title="Editar">
                                        ✏️
                                    </Link>
                                    <button onClick={() => handleDelete(item)} className="btn-icon delete" title="Excluir">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PrestadorDashboard;
