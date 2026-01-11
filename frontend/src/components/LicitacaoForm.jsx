import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { STATUS_OPTIONS, MODALIDADES } from '../services/api';
import './LicitacaoForm.css';

function LicitacaoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        numero: '',
        orgao: '',
        objeto: '',
        modalidade: '',
        valorEstimado: '',
        status: 'Cadastrada',
        dataAbertura: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing) {
            loadLicitacao();
        }
    }, [id]);

    const loadLicitacao = async () => {
        try {
            setLoading(true);
            const response = await api.getById(id);
            const data = response.data;
            setFormData({
                numero: data.numero || '',
                orgao: data.orgao || '',
                objeto: data.objeto || '',
                modalidade: data.modalidade || '',
                valorEstimado: data.valorEstimado || '',
                status: data.status || 'Cadastrada',
                dataAbertura: data.dataAbertura || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.numero.trim()) {
            newErrors.numero = 'Número é obrigatório';
        }
        if (!formData.orgao.trim()) {
            newErrors.orgao = 'Órgão é obrigatório';
        }
        if (!formData.objeto.trim()) {
            newErrors.objeto = 'Objeto é obrigatório';
        }
        if (!formData.modalidade.trim()) {
            newErrors.modalidade = 'Modalidade é obrigatória';
        }
        if (!formData.valorEstimado || parseFloat(formData.valorEstimado) <= 0) {
            newErrors.valorEstimado = 'Valor estimado deve ser maior que zero';
        }
        if (!formData.dataAbertura) {
            newErrors.dataAbertura = 'Data de abertura é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa erro do campo ao editar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const dataToSend = {
                ...formData,
                valorEstimado: parseFloat(formData.valorEstimado)
            };

            if (isEditing) {
                await api.update(id, dataToSend);
            } else {
                await api.create(dataToSend);
            }

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando licitação...</p>
            </div>
        );
    }

    return (
        <div className="licitacao-form-container">
            <div className="form-header">
                <Link to="/" className="back-link">← Voltar</Link>
                <h1>{isEditing ? '✏️ Editar Licitação' : '➕ Nova Licitação'}</h1>
            </div>

            {error && (
                <div className="message message-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="licitacao-form">
                <div className="form-grid">
                    <div className={`form-group ${errors.numero ? 'has-error' : ''}`}>
                        <label htmlFor="numero">
                            Número <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            placeholder="Ex: 001/2026"
                            disabled={saving}
                        />
                        {errors.numero && <span className="error-message">{errors.numero}</span>}
                    </div>

                    <div className={`form-group ${errors.orgao ? 'has-error' : ''}`}>
                        <label htmlFor="orgao">
                            Órgão <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="orgao"
                            name="orgao"
                            value={formData.orgao}
                            onChange={handleChange}
                            placeholder="Ex: Prefeitura Municipal"
                            disabled={saving}
                        />
                        {errors.orgao && <span className="error-message">{errors.orgao}</span>}
                    </div>

                    <div className={`form-group full-width ${errors.objeto ? 'has-error' : ''}`}>
                        <label htmlFor="objeto">
                            Objeto <span className="required">*</span>
                        </label>
                        <textarea
                            id="objeto"
                            name="objeto"
                            value={formData.objeto}
                            onChange={handleChange}
                            placeholder="Descreva o objeto da licitação..."
                            rows="3"
                            disabled={saving}
                        />
                        {errors.objeto && <span className="error-message">{errors.objeto}</span>}
                    </div>

                    <div className={`form-group ${errors.modalidade ? 'has-error' : ''}`}>
                        <label htmlFor="modalidade">
                            Modalidade <span className="required">*</span>
                        </label>
                        <select
                            id="modalidade"
                            name="modalidade"
                            value={formData.modalidade}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            <option value="">Selecione...</option>
                            {MODALIDADES.map(mod => (
                                <option key={mod} value={mod}>{mod}</option>
                            ))}
                        </select>
                        {errors.modalidade && <span className="error-message">{errors.modalidade}</span>}
                    </div>

                    <div className={`form-group ${errors.valorEstimado ? 'has-error' : ''}`}>
                        <label htmlFor="valorEstimado">
                            Valor Estimado (R$) <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="valorEstimado"
                            name="valorEstimado"
                            value={formData.valorEstimado}
                            onChange={handleChange}
                            placeholder="0,00"
                            step="0.01"
                            min="0"
                            disabled={saving}
                        />
                        {errors.valorEstimado && <span className="error-message">{errors.valorEstimado}</span>}
                    </div>

                    <div className={`form-group ${errors.dataAbertura ? 'has-error' : ''}`}>
                        <label htmlFor="dataAbertura">
                            Data de Abertura <span className="required">*</span>
                        </label>
                        <input
                            type="date"
                            id="dataAbertura"
                            name="dataAbertura"
                            value={formData.dataAbertura}
                            onChange={handleChange}
                            disabled={saving}
                        />
                        {errors.dataAbertura && <span className="error-message">{errors.dataAbertura}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <Link to="/" className="btn btn-secondary">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LicitacaoForm;
