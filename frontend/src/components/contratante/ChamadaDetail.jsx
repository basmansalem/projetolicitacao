import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { STATUS_CHAMADA } from '../../services/api';
import './ChamadaDetail.css';

function ChamadaDetail() {
    const { id } = useParams();
    const [chamada, setChamada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadChamada();
    }, [id]);

    const loadChamada = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.chamadas.getById(id);
            setChamada(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setSaving(true);
            await api.chamadas.update(id, { status: newStatus });
            setChamada(prev => ({ ...prev, status: newStatus }));
            setMessage({ type: 'success', text: `Status alterado para "${newStatus}"` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleRegenerar = async () => {
        try {
            setSaving(true);
            const response = await api.chamadas.regenerarPossibilidades(id);
            setChamada(prev => ({
                ...prev,
                possibilidades: response.data,
                quantidadePossibilidades: response.count
            }));
            setMessage({ type: 'success', text: `${response.count} possibilidade(s) encontrada(s)` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
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

    const getScoreClass = (score) => {
        if (score >= 110) return 'score-excellent';
        if (score >= 100) return 'score-good';
        return 'score-normal';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando chamada...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Erro ao carregar chamada</h2>
                <p>{error}</p>
                <Link to="/contratante" className="btn btn-primary">Voltar</Link>
            </div>
        );
    }

    if (!chamada) return null;

    return (
        <div className="chamada-detail">
            <div className="detail-header">
                <Link to="/contratante" className="back-link">← Voltar para Minhas Chamadas</Link>
                <div className="header-content">
                    <div className="header-info">
                        <span className="chamada-categoria">{chamada.categoria}</span>
                        <h1>{chamada.titulo}</h1>
                    </div>
                    <div className="header-status">
                        <select
                            value={chamada.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={saving}
                            className={`status-select ${getStatusClass(chamada.status)}`}
                        >
                            {STATUS_CHAMADA.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Dados da Chamada */}
            <div className="detail-section">
                <h2>📋 Dados da Chamada</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <span className="info-label">Descrição</span>
                        <span className="info-value">{chamada.descricao || 'Não informada'}</span>
                    </div>
                    <div className="info-card">
                        <span className="info-label">Quantidade</span>
                        <span className="info-value">{chamada.quantidade}</span>
                    </div>
                    <div className="info-card">
                        <span className="info-label">Valor Máximo</span>
                        <span className="info-value highlight">{formatCurrency(chamada.valorMaximo)}</span>
                    </div>
                    <div className="info-card">
                        <span className="info-label">Prazo de Execução</span>
                        <span className="info-value">{formatDate(chamada.prazoExecucao)}</span>
                    </div>
                </div>
            </div>

            {/* Possibilidades */}
            <div className="detail-section possibilidades-section">
                <div className="section-header">
                    <h2>⚡ Possibilidades Encontradas</h2>
                    <button
                        className="btn btn-secondary"
                        onClick={handleRegenerar}
                        disabled={saving}
                    >
                        🔄 Atualizar Busca
                    </button>
                </div>

                {!chamada.possibilidades || chamada.possibilidades.length === 0 ? (
                    <div className="no-possibilidades">
                        <span className="empty-icon">🔍</span>
                        <h3>Nenhuma possibilidade encontrada</h3>
                        <p>Não há prestadores com itens compatíveis nesta categoria e faixa de valor.</p>
                    </div>
                ) : (
                    <div className="possibilidades-list">
                        {chamada.possibilidades.map((poss, index) => (
                            <div key={poss.id} className="possibilidade-card">
                                <div className="possibilidade-rank">#{index + 1}</div>

                                <div className="possibilidade-header">
                                    <div className="prestador-info">
                                        <span className="prestador-icon">
                                            {poss.prestadorTipo === 'empresa' ? '🏢' : '👤'}
                                        </span>
                                        <div>
                                            <h3>{poss.prestadorNome}</h3>
                                            <span className="prestador-tipo">{poss.prestadorTipo}</span>
                                        </div>
                                    </div>
                                    <div className={`score-badge ${getScoreClass(poss.scoreCompatibilidade)}`}>
                                        <span className="score-value">{poss.scoreCompatibilidade}</span>
                                        <span className="score-label">Score</span>
                                    </div>
                                </div>

                                <div className="itens-compativeis">
                                    <h4>Itens Compatíveis ({poss.itensCompativeis.length})</h4>
                                    <div className="itens-list">
                                        {poss.itensCompativeis.map(item => (
                                            <div key={item.id} className="item-compativel">
                                                <div className="item-info">
                                                    <span className="item-nome">{item.nome}</span>
                                                    <span className="item-descricao">{item.descricao}</span>
                                                </div>
                                                <div className="item-valor">
                                                    <span className="valor">{formatCurrency(item.valorReferencia)}</span>
                                                    <span className="unidade">/ {item.unidade}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="possibilidade-footer">
                                    <div className="valor-total">
                                        <span className="label">Valor Total Estimado:</span>
                                        <span className="valor">{formatCurrency(poss.valorTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChamadaDetail;
