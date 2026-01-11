import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './LicitacaoList.css';

function LicitacaoList() {
    const [licitacoes, setLicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadLicitacoes();
    }, []);

    const loadLicitacoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getAll();
            setLicitacoes(response.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, numero) => {
        if (!window.confirm(`Deseja realmente excluir a licitação ${numero}?`)) {
            return;
        }

        try {
            await api.delete(id);
            setMessage({ type: 'success', text: 'Licitação excluída com sucesso!' });
            loadLicitacoes();
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
                <p>Carregando licitações...</p>
            </div>
        );
    }

    return (
        <div className="licitacao-list">
            <div className="list-header">
                <h1>📋 Licitações</h1>
                <Link to="/nova" className="btn btn-primary">
                    + Nova Licitação
                </Link>
            </div>

            {message && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            {error && (
                <div className="message message-error">
                    Erro: {error}
                    <button onClick={loadLicitacoes} className="btn btn-small">Tentar novamente</button>
                </div>
            )}

            {licitacoes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h2>Nenhuma licitação cadastrada</h2>
                    <p>Comece criando sua primeira licitação!</p>
                    <Link to="/nova" className="btn btn-primary">
                        Criar Licitação
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="licitacao-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Órgão</th>
                                <th>Objeto</th>
                                <th>Modalidade</th>
                                <th>Valor Estimado</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licitacoes.map((licitacao) => (
                                <tr key={licitacao.id}>
                                    <td className="col-numero">{licitacao.numero}</td>
                                    <td className="col-orgao">{licitacao.orgao}</td>
                                    <td className="col-objeto" title={licitacao.objeto}>
                                        {licitacao.objeto.length > 50
                                            ? `${licitacao.objeto.substring(0, 50)}...`
                                            : licitacao.objeto}
                                    </td>
                                    <td className="col-modalidade">{licitacao.modalidade}</td>
                                    <td className="col-valor">{formatCurrency(licitacao.valorEstimado)}</td>
                                    <td className="col-status">
                                        <span className={`status-badge ${getStatusClass(licitacao.status)}`}>
                                            {licitacao.status}
                                        </span>
                                    </td>
                                    <td className="col-acoes">
                                        <div className="action-buttons">
                                            <Link to={`/licitacao/${licitacao.id}`} className="btn btn-view" title="Ver detalhes">
                                                👁️
                                            </Link>
                                            <Link to={`/editar/${licitacao.id}`} className="btn btn-edit" title="Editar">
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(licitacao.id, licitacao.numero)}
                                                className="btn btn-delete"
                                                title="Excluir"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="list-footer">
                <p>Total: {licitacoes.length} licitação(ões)</p>
            </div>
        </div>
    );
}

export default LicitacaoList;
