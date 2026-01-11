import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { CATEGORIAS } from '../../services/api';
import './ChamadaList.css';

function ChamadaList() {
    const [chamadas, setChamadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');

    useEffect(() => {
        loadChamadas();
    }, []);

    const loadChamadas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.chamadas.getAll();
            setChamadas(response.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (chamada) => {
        if (!window.confirm(`Deseja excluir a chamada "${chamada.titulo}"?`)) return;

        try {
            await api.chamadas.delete(chamada.id);
            setChamadas(chamadas.filter(c => c.id !== chamada.id));
            setMessage({ type: 'success', text: 'Chamada excluída com sucesso!' });
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Aberta': 'status-aberta',
            'Em análise': 'status-analise',
            'Contratada': 'status-contratada',
            'Encerrada': 'status-encerrada'
        };
        return statusMap[status] || '';
    };

    const chamadasFiltradas = chamadas.filter(c => {
        if (filtroCategoria && c.categoria !== filtroCategoria) return false;
        if (filtroStatus && c.status !== filtroStatus) return false;
        return true;
    });

    const estatisticas = {
        total: chamadas.length,
        abertas: chamadas.filter(c => c.status === 'Aberta').length,
        comPossibilidades: chamadas.filter(c => c.quantidadePossibilidades > 0).length,
        totalPossibilidades: chamadas.reduce((acc, c) => acc + (c.quantidadePossibilidades || 0), 0)
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando chamadas...</p>
            </div>
        );
    }

    return (
        <div className="chamada-list">
            <div className="list-header">
                <div className="header-info">
                    <Link to="/" className="back-link">← Voltar</Link>
                    <h1>🏛️ Área do Contratante</h1>
                    <p>Gerencie suas chamadas e encontre prestadores</p>
                </div>
            </div>

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

            {/* Estatísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">📋</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.total}</span>
                        <span className="stat-label">Total de Chamadas</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🟢</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.abertas}</span>
                        <span className="stat-label">Chamadas Abertas</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🔗</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.comPossibilidades}</span>
                        <span className="stat-label">Com Possibilidades</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⚡</span>
                    <div className="stat-info">
                        <span className="stat-value">{estatisticas.totalPossibilidades}</span>
                        <span className="stat-label">Total Possibilidades</span>
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
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todos os status</option>
                        <option value="Aberta">Aberta</option>
                        <option value="Em análise">Em análise</option>
                        <option value="Contratada">Contratada</option>
                        <option value="Encerrada">Encerrada</option>
                    </select>
                </div>
                <Link to="/contratante/chamada/nova" className="btn btn-primary btn-contratante">
                    + Nova Chamada
                </Link>
            </div>

            {/* Lista de Chamadas */}
            {chamadasFiltradas.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h2>Nenhuma chamada encontrada</h2>
                    <p>Crie uma nova chamada para encontrar prestadores!</p>
                    <Link to="/contratante/chamada/nova" className="btn btn-primary btn-contratante">
                        Criar Chamada
                    </Link>
                </div>
            ) : (
                <div className="chamadas-grid">
                    {chamadasFiltradas.map(chamada => (
                        <div key={chamada.id} className="chamada-card">
                            <div className="chamada-header">
                                <span className="chamada-categoria">{chamada.categoria}</span>
                                <span className={`status-badge ${getStatusClass(chamada.status)}`}>
                                    {chamada.status}
                                </span>
                            </div>

                            <h3 className="chamada-titulo">{chamada.titulo}</h3>
                            <p className="chamada-descricao">{chamada.descricao || 'Sem descrição'}</p>

                            <div className="chamada-info">
                                <div className="info-item">
                                    <span className="info-label">Valor Máximo</span>
                                    <span className="info-value">{formatCurrency(chamada.valorMaximo)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Prazo</span>
                                    <span className="info-value">{formatDate(chamada.prazoExecucao)}</span>
                                </div>
                            </div>

                            <div className="chamada-possibilidades">
                                <span className="possibilidades-count">
                                    {chamada.quantidadePossibilidades || 0}
                                </span>
                                <span className="possibilidades-label">
                                    {chamada.quantidadePossibilidades === 1 ? 'possibilidade' : 'possibilidades'}
                                </span>
                            </div>

                            <div className="chamada-actions">
                                <Link to={`/contratante/chamada/${chamada.id}`} className="btn btn-view">
                                    👁️ Ver Detalhes
                                </Link>
                                <button onClick={() => handleDelete(chamada)} className="btn btn-delete-small">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChamadaList;
