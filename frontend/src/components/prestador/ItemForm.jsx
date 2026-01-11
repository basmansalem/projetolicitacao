import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { CATEGORIAS, UNIDADES } from '../../services/api';
import './ItemForm.css';

function ItemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'novo';

    const [prestadores, setPrestadores] = useState([]);
    const [formData, setFormData] = useState({
        prestadorId: '',
        categoria: '',
        nome: '',
        descricao: '',
        valorReferencia: '',
        unidade: 'unidade',
        ativo: true
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadPrestadores();
        if (isEditing) {
            loadItem();
        }
    }, [id]);

    const loadPrestadores = async () => {
        try {
            const response = await api.prestadores.getAll();
            setPrestadores(response.data || []);

            // Se não estiver editando, selecionar primeiro prestador
            if (!isEditing && response.data?.length > 0) {
                setFormData(prev => ({ ...prev, prestadorId: response.data[0].id }));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const loadItem = async () => {
        try {
            setLoading(true);
            const response = await api.itens.getById(id);
            const item = response.data;
            setFormData({
                prestadorId: item.prestadorId || '',
                categoria: item.categoria || '',
                nome: item.nome || '',
                descricao: item.descricao || '',
                valorReferencia: item.valorReferencia || '',
                unidade: item.unidade || 'unidade',
                ativo: item.ativo !== undefined ? item.ativo : true
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.prestadorId) newErrors.prestadorId = 'Selecione um prestador';
        if (!formData.categoria) newErrors.categoria = 'Selecione uma categoria';
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
        if (!formData.valorReferencia || parseFloat(formData.valorReferencia) <= 0) {
            newErrors.valorReferencia = 'Valor deve ser maior que zero';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSaving(true);
            setError(null);

            const dataToSend = {
                ...formData,
                valorReferencia: parseFloat(formData.valorReferencia)
            };

            if (isEditing) {
                await api.itens.update(id, dataToSend);
            } else {
                await api.itens.create(dataToSend);
            }

            navigate('/prestador');
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
                <p>Carregando item...</p>
            </div>
        );
    }

    return (
        <div className="item-form-container">
            <div className="form-header">
                <Link to="/prestador" className="back-link">← Voltar para Meus Itens</Link>
                <h1>{isEditing ? '✏️ Editar Item' : '➕ Novo Item'}</h1>
            </div>

            {error && (
                <div className="message message-error">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="item-form">
                <div className="form-grid">
                    {!isEditing && (
                        <div className={`form-group ${errors.prestadorId ? 'has-error' : ''}`}>
                            <label htmlFor="prestadorId">
                                Prestador <span className="required">*</span>
                            </label>
                            <select
                                id="prestadorId"
                                name="prestadorId"
                                value={formData.prestadorId}
                                onChange={handleChange}
                                disabled={saving}
                            >
                                <option value="">Selecione...</option>
                                {prestadores.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </select>
                            {errors.prestadorId && <span className="error-message">{errors.prestadorId}</span>}
                        </div>
                    )}

                    <div className={`form-group ${errors.categoria ? 'has-error' : ''}`}>
                        <label htmlFor="categoria">
                            Categoria <span className="required">*</span>
                        </label>
                        <select
                            id="categoria"
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
                        {errors.categoria && <span className="error-message">{errors.categoria}</span>}
                    </div>

                    <div className={`form-group full-width ${errors.nome ? 'has-error' : ''}`}>
                        <label htmlFor="nome">
                            Nome do Item <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex: Desenvolvimento de Sistema Web"
                            disabled={saving}
                        />
                        {errors.nome && <span className="error-message">{errors.nome}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Descreva o item ou serviço oferecido..."
                            rows="3"
                            disabled={saving}
                        />
                    </div>

                    <div className={`form-group ${errors.valorReferencia ? 'has-error' : ''}`}>
                        <label htmlFor="valorReferencia">
                            Valor de Referência (R$) <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="valorReferencia"
                            name="valorReferencia"
                            value={formData.valorReferencia}
                            onChange={handleChange}
                            placeholder="0,00"
                            step="0.01"
                            min="0"
                            disabled={saving}
                        />
                        {errors.valorReferencia && <span className="error-message">{errors.valorReferencia}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="unidade">Unidade</label>
                        <select
                            id="unidade"
                            name="unidade"
                            value={formData.unidade}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            {UNIDADES.map(uni => (
                                <option key={uni} value={uni}>{uni}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="ativo"
                                checked={formData.ativo}
                                onChange={handleChange}
                                disabled={saving}
                            />
                            <span className="checkmark"></span>
                            Item ativo (disponível para chamadas)
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <Link to="/prestador" className="btn btn-secondary">Cancelar</Link>
                    <button type="submit" className="btn btn-primary btn-prestador" disabled={saving}>
                        {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ItemForm;
