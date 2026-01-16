import { useState } from 'react';
import api, { TIPOS_PRESTADOR, CATEGORIAS } from '../../services/api';
import './PrestadorFormModal.css';

function PrestadorFormModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        tipo: 'empresa',
        cnpj: '',
        categoria: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            setError('Nome é obrigatório');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const response = await api.prestadores.create(formData);
            onSuccess(response.data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content prestador-modal">
                <div className="modal-header">
                    <h2>Novo Prestador</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="message message-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome *</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Nome da Empresa ou Pessoa"
                            disabled={saving}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            {TIPOS_PRESTADOR.map(tipo => (
                                <option key={tipo} value={tipo}>
                                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.tipo === 'empresa' && (
                        <div className="form-group">
                            <label>CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                placeholder="00.000.000/0000-00"
                                disabled={saving}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Categoria Principal</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            <option value="">Selecione...</option>
                            {CATEGORIAS.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contato@exemplo.com"
                            disabled={saving}
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefone</label>
                        <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                            disabled={saving}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Salvando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PrestadorFormModal;
