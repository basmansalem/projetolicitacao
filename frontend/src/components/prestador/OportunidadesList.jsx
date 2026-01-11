import { useState, useEffect } from 'react';
import api from '../../services/api';
import './OportunidadesList.css';
import OfertaModal from './OfertaModal';

function OportunidadesList({ prestadorId, onUpdateCount }) {
    const [oportunidades, setOportunidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOportunidade, setSelectedOportunidade] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (prestadorId) {
            loadOportunidades();

            // Polling para atualização dinâmica
            const interval = setInterval(() => {
                loadOportunidades(true);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [prestadorId]);

    const loadOportunidades = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            // Na POC, não temos um endpoint direto "minhas oportunidades", 
            // então vamos buscar todas as chamadas e filtrar onde tenho "possibilidade"
            // O ideal seria um endpoint /prestadores/:id/oportunidades

            const chamadasRes = await api.chamadas.getAll();
            const chamadas = chamadasRes.data || [];

            const minhasOportunidades = [];

            for (const chamada of chamadas) {
                // Verificar se tenho match
                const possibilidadesRes = await api.chamadas.getPossibilidades(chamada.id);
                const possibilidades = possibilidadesRes.data || [];

                const match = possibilidades.find(p => p.prestadorId === prestadorId);

                if (match) {
                    // Verificar se já ofertei
                    const ofertasRes = await api.chamadas.getOfertas(chamada.id);
                    const ofertas = ofertasRes.data || [];
                    const jaOfertei = ofertas.find(o => o.prestadorId === prestadorId);

                    minhasOportunidades.push({
                        ...chamada,
                        matchScore: match.scoreCompatibilidade,
                        jaOfertei: !!jaOfertei,
                        minhaOferta: jaOfertei
                    });
                }
            }

            // Ordenar por score (maior primeiro)
            minhasOportunidades.sort((a, b) => b.matchScore - a.matchScore);

            setOportunidades(minhasOportunidades);

            if (onUpdateCount) {
                onUpdateCount(minhasOportunidades.length);
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao carregar oportunidades');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleOfertarClick = (oportunidade) => {
        setSelectedOportunidade(oportunidade);
        setModalOpen(true);
    };

    const handleOfertaSuccess = (novaOferta) => {
        setMessage({ type: 'success', text: 'Oferta enviada com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
        loadOportunidades(); // Recarregar para atualizar status
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) return <div className="loading">Carregando oportunidades...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="oportunidades-list">
            <h2>🔔 Minhas Oportunidades (Alertas)</h2>
            <p>Chamadas compatíveis com seus serviços</p>

            {message && <div className={`message message-${message.type}`}>{message.text}</div>}

            {oportunidades.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhuma oportunidade encontrada no momento.</p>
                </div>
            ) : (
                <div className="oportunidades-grid">
                    {oportunidades.map(op => (
                        <div key={op.id} className={`oportunidade-card ${op.jaOfertei ? 'ofertado' : ''}`}>
                            {op.jaOfertei && <div className="status-ofertada-badge">Ofertada</div>}

                            <div className="oportunidade-info">
                                <h3>{op.titulo}</h3>
                                <div className="info-badges">
                                    <span className="categoria-badge">{op.categoria}</span>
                                    <span className="deadline-badge">
                                        📅 Até {new Date(op.prazoExecucao).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="oportunidade-descricao">
                                    {op.descricao}
                                </p>

                                <div className="match-details">
                                    <span className="match-label">Match Score:</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${Math.min(op.matchScore, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="score-text">{op.matchScore}</span>
                                </div>
                            </div>

                            <div className="detalhes">
                                <span>Valor Máx: {formatCurrency(op.valorMaximo)}</span>
                            </div>

                            <div className="actions">
                                {op.jaOfertei ? (
                                    <div className="status-ofertado">
                                        ✅ Oferta enviada: {formatCurrency(op.minhaOferta.valor)}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleOfertarClick(op)}
                                        className="btn-oferta"
                                    >
                                        Enviar Oferta
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <OfertaModal
                    chamada={selectedOportunidade}
                    prestadorId={prestadorId}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handleOfertaSuccess}
                />
            )}
        </div>
    );
}

export default OportunidadesList;
