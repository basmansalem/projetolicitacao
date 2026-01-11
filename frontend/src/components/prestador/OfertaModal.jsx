import { useState } from 'react';
import api from '../../services/api';
import './OfertaModal.css';

function OfertaModal({ chamada, prestadorId, onClose, onSuccess }) {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.ofertas.create({
                chamadaId: chamada.id,
                prestadorId: prestadorId,
                valor: parseFloat(valor),
                descricao
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Erro ao enviar oferta');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Enviar Oferta</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <div className="modal-body">
                    <div className="chamada-summary">
                        <h4>{chamada.titulo}</h4>
                        <p>Valor Máximo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(chamada.valorMaximo)}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Seu Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={valor}
                                onChange={e => setValor(e.target.value)}
                                required
                                placeholder="0,00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Descrição / Observações</label>
                            <textarea
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                rows="3"
                                placeholder="Detalhes da sua oferta..."
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Enviando...' : 'Confirmar Oferta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OfertaModal;
