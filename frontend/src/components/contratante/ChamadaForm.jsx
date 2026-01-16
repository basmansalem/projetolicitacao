import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { CATEGORIAS } from '../../services/api';
import './ChamadaForm.css';

function ChamadaForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        quantidade: 1,
        valorMaximo: '',
        prazoExecucao: ''
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
        if (!formData.categoria) newErrors.categoria = 'Selecione uma categoria';
        if (!formData.valorMaximo || parseFloat(formData.valorMaximo) <= 0) {
            newErrors.valorMaximo = 'Valor máximo deve ser maior que zero';
        }
        if (!formData.prazoExecucao) newErrors.prazoExecucao = 'Prazo é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                quantidade: parseInt(formData.quantidade) || 1,
                valorMaximo: parseFloat(formData.valorMaximo)
            };

            const response = await api.chamadas.create(dataToSend);

            if (response.warning) {
                alert(response.warning);
            }

            // Navegar para detalhes da chamada criada
            navigate(`/contratante/chamada/${response.data.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="chamada-form-container">
            <div className="form-header">
                <Link to="/contratante" className="back-link">← Voltar para Minhas Chamadas</Link>
                <h1>➕ Nova Chamada</h1>
                <p>Crie uma chamada e o sistema encontrará prestadores compatíveis automaticamente</p>
            </div>

            {error && (
                <div className="message message-error">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="chamada-form">
                <div className="form-grid">
                    <div className={`form-group full-width ${errors.titulo ? 'has-error' : ''}`}>
                        <label htmlFor="titulo">
                            Título da Chamada <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ex: Contratação de serviços de desenvolvimento de software"
                            disabled={saving}
                        />
                        {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                    </div>

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
                            <option value="">Selecione a categoria...</option>
                            {CATEGORIAS.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.categoria && <span className="error-message">{errors.categoria}</span>}
                        <span className="field-hint">
                            💡 O sistema buscará prestadores com itens nesta categoria
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input
                            type="number"
                            id="quantidade"
                            name="quantidade"
                            value={formData.quantidade}
                            onChange={handleChange}
                            min="1"
                            disabled={saving}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Descreva detalhadamente o que você precisa contratar..."
                            rows="4"
                            disabled={saving}
                        />
                    </div>

                    <div className={`form-group ${errors.valorMaximo ? 'has-error' : ''}`}>
                        <label htmlFor="valorMaximo">
                            Valor Máximo (R$) <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="valorMaximo"
                            name="valorMaximo"
                            value={formData.valorMaximo}
                            onChange={handleChange}
                            placeholder="0,00"
                            step="0.01"
                            min="0"
                            disabled={saving}
                        />
                        {errors.valorMaximo && <span className="error-message">{errors.valorMaximo}</span>}
                        <span className="field-hint">
                            💡 Apenas itens com valor ≤ este limite serão considerados
                        </span>
                    </div>

                    <div className={`form-group ${errors.prazoExecucao ? 'has-error' : ''}`}>
                        <label htmlFor="prazoExecucao">
                            Prazo de Execução <span className="required">*</span>
                        </label>
                        <input
                            type="date"
                            id="prazoExecucao"
                            name="prazoExecucao"
                            value={formData.prazoExecucao}
                            onChange={handleChange}
                            disabled={saving}
                        />
                        {errors.prazoExecucao && <span className="error-message">{errors.prazoExecucao}</span>}
                    </div>
                </div>

                <div className="form-info-box">
                    <span className="info-icon">⚡</span>
                    <div>
                        <strong>Matching Automático</strong>
                        <p>Ao criar a chamada, o sistema irá automaticamente buscar prestadores com itens compatíveis na categoria selecionada e gerar uma lista de possibilidades.</p>
                    </div>
                </div>

                <div className="form-actions">
                    <Link to="/contratante" className="btn btn-secondary">Cancelar</Link>
                    <button type="submit" className="btn btn-primary btn-contratante" disabled={saving}>
                        {saving ? 'Criando...' : '🔍 Criar e Buscar Prestadores'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChamadaForm;
