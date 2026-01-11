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

        // Polling para atualização dinâmica (a cada 5 segundos)
        const interval = setInterval(() => {
            if (!saving) { // Evita recarregar se estiver salvando algo
                loadChamada(true); // true = silent load (sem loading spinner)
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [id, saving]);

    const loadChamada = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);

            // Buscar chamada e ofertas em paralelo para garantir dados atualizados
            const [chamadaRes, ofertasRes] = await Promise.all([
                api.chamadas.getById(id),
                api.chamadas.getOfertas(id)
            ]);

            // Combinar dados
            setChamada({
                ...chamadaRes.data,
                ofertas: ofertasRes.data // Forçar uso das ofertas do endpoint específico
            });
        } catch (err) {
            if (!silent) setError(err.message);
        } finally {
            if (!silent) setLoading(false);
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

    const getMelhorOfertaId = () => {
        if (!chamada?.ofertas || chamada.ofertas.length === 0) return null;
        // Ofertas já vêm ordenadas por valor do backend
        return chamada.ofertas[0].id;
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

    const melhorOfertaId = getMelhorOfertaId();

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

            {/* Ofertas Recebidas */}
            <div className="detail-section ofertas-section">
                <div className="section-header">
                    <h2>💰 Ofertas Recebidas</h2>
                    <span className="badge-count">
                        {chamada.ofertas?.length || 0}
                    </span>
                </div>

                {!chamada.ofertas || chamada.ofertas.length === 0 ? (
                    <div className="no-ofertas">
                        <span className="empty-icon">💸</span>
                        <h3>Nenhuma oferta recebida</h3>
                        <p>Aguarde as ofertas dos prestadores notificados.</p>
                    </div>
                ) : (
                    <div className="ofertas-list">
                        {chamada.ofertas.map((oferta, index) => (
                            <div
                                key={oferta.id}
                                className={`oferta-card ${oferta.id === melhorOfertaId ? 'melhor-oferta' : ''}`}
                            >
                                {oferta.id === melhorOfertaId && (
                                    <div className="badge-melhor-oferta">🏆 Melhor Oferta</div>
                                )}

                                <div className="oferta-header">
                                    <div className="prestador-info">
                                        <span className="prestador-icon">👤</span>
                                        <h3>{oferta.prestadorNome}</h3>
                                    </div>
                                    <div className="oferta-valor">
                                        {formatCurrency(oferta.valor)}
                                    </div>
                                </div>

                                {oferta.descricao && (
                                    <p className="oferta-descricao">"{oferta.descricao}"</p>
                                )}

                                <div className="oferta-footer">
                                    <span className="oferta-data">
                                        Recebida em: {new Date(oferta.createdAt).toLocaleDateString()} às {new Date(oferta.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
