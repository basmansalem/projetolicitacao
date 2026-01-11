import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { STATUS_OPTIONS } from '../services/api';
import './LicitacaoDetail.css';

function LicitacaoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [licitacao, setLicitacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadLicitacao();
    }, [id]);

    const loadLicitacao = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getById(id);
            setLicitacao(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setSaving(true);
            await api.update(id, { status: newStatus });
            setLicitacao(prev => ({ ...prev, status: newStatus }));
            setMessage({ type: 'success', text: `Status alterado para "${newStatus}"` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Deseja realmente excluir a licitação ${licitacao.numero}?`)) {
            return;
        }

        try {
            await api.delete(id);
            navigate('/');
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
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Cadastrada': 'status-cadastrada',
            'Publicada': 'status-publicada',
            'Em disputa': 'status-disputa',
            'Homologada': 'status-homologada',
            'Encerrada': 'status-encerrada'
        };
        return statusMap[status] || '';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando detalhes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Erro ao carregar licitação</h2>
                <p>{error}</p>
                <Link to="/" className="btn btn-primary">Voltar para lista</Link>
            </div>
        );
    }

    if (!licitacao) {
        return (
            <div className="error-container">
                <div className="error-icon">🔍</div>
                <h2>Licitação não encontrada</h2>
                <Link to="/" className="btn btn-primary">Voltar para lista</Link>
            </div>
        );
    }

    return (
        <div className="licitacao-detail">
            <div className="detail-header">
                <Link to="/" className="back-link">← Voltar para lista</Link>
                <div className="header-content">
                    <div className="header-info">
                        <h1>📄 Licitação {licitacao.numero}</h1>
                        <span className={`status-badge large ${getStatusClass(licitacao.status)}`}>
                            {licitacao.status}
                        </span>
                    </div>
                    <div className="header-actions">
                        <Link to={`/editar/${id}`} className="btn btn-secondary">
                            ✏️ Editar
                        </Link>
                        <button onClick={handleDelete} className="btn btn-danger">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="detail-content">
                <div className="detail-card main-info">
                    <h2>Informações Principais</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Número</label>
                            <span className="value highlight">{licitacao.numero}</span>
                        </div>
                        <div className="info-item">
                            <label>Órgão</label>
                            <span className="value">{licitacao.orgao}</span>
                        </div>
                        <div className="info-item full-width">
                            <label>Objeto</label>
                            <span className="value">{licitacao.objeto}</span>
                        </div>
                        <div className="info-item">
                            <label>Modalidade</label>
                            <span className="value">{licitacao.modalidade}</span>
                        </div>
                        <div className="info-item">
                            <label>Valor Estimado</label>
                            <span className="value money">{formatCurrency(licitacao.valorEstimado)}</span>
                        </div>
                        <div className="info-item">
                            <label>Data de Abertura</label>
                            <span className="value">{formatDate(licitacao.dataAbertura)}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card status-card">
                    <h2>Status da Licitação</h2>
                    <div className="status-section">
                        <div className="current-status">
                            <label>Status Atual</label>
                            <span className={`status-badge large ${getStatusClass(licitacao.status)}`}>
                                {licitacao.status}
                            </span>
                        </div>
                        <div className="status-change">
                            <label>Alterar Status</label>
                            <select
                                value={licitacao.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={saving}
                                className="status-select"
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            {saving && <span className="saving-indicator">Salvando...</span>}
                        </div>
                    </div>
                </div>

                <div className="detail-card metadata">
                    <h2>Metadados</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>ID</label>
                            <span className="value code">{licitacao.id}</span>
                        </div>
                        <div className="info-item">
                            <label>Criado em</label>
                            <span className="value">{formatDateTime(licitacao.createdAt)}</span>
                        </div>
                        <div className="info-item">
                            <label>Última atualização</label>
                            <span className="value">{formatDateTime(licitacao.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LicitacaoDetail;
