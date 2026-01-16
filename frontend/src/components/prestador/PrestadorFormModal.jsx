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
        cpf: '',
        cnaes: [],
        categoria: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // CNAE Search State
    const [cnaeSearch, setCnaeSearch] = useState('');
    const [cnaeResults, setCnaeResults] = useState([]);
    const [loadingCnae, setLoadingCnae] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCnaeSearch = async (e) => {
        const term = e.target.value;
        setCnaeSearch(term);

        if (term.length < 3) {
            setCnaeResults([]);
            return;
        }

        setLoadingCnae(true);
        try {
            // Busca na API do IBGE (CNAE Subclasses)
            // Como a API do IBGE não tem busca por termo "full text" simples em um único endpoint de subclasses de forma performática para autocomplete,
            // A melhor estratégia oficial é listar ou tentar filtrar.
            // Para simplificar neste POC, vamos assumir que o usuário digita algo e tentamos filtrar localmente se a API retornar tudo, 
            // ou usar um endpoint de busca se disponível.
            // O endpoint https://servicodados.ibge.gov.br/api/v2/cnae/subclasses retorna TODAS se não filtrar.
            // Isso é pesado (MBs de dados).
            // A recomendação é usar a busca por ID ou termos específicos, mas a API pública do IBGE é RESTful estrita.
            // Workaround comum: Tentar buscar na API de metadados ou assumir que o usuário digita o código.
            // Mas o request do usuário foi "busca automática".
            // Vamos usar o endpoint de pesquisa de classes que é mais leve ou tentar subclass por id se for numérico.

            // Tentativa de busca textual: A API do IBGE não suporta "q=termo" diretamente em /subclasses.
            // Vamos usar o endpoint de PESQUISA do IBGE se existir, ou fallback para uma lista reduzida/mocked para POC se a API travar.
            // Mas, tentando o endpoint de subclasses/...

            // UPDATE: Vamos fazer fetch e filtrar no front (limitado a 50) pois não há backend proxy search.
            // NOTA: Em PRD, teríamos nosso backend fazendo cache.

            // Para não travar, vamos buscar APENAS SE for numérico (código) ou se tiver uma lista pré-carregada.
            // Como não podemos carregar tudo, vou implementar um fetch simples que tenta buscar.

            // API Alternativa: https://servicodados.ibge.gov.br/api/v2/cnae/subclasses
            // Visto que não tem "search", vou simular uma busca para o POC buscando todas as CLASSES e filtrando (menos dados)
            // ou alertar que busca por Código é melhor.

            // Vamos testar buscar classes que é mais leve:
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v2/cnae/classes`);
            const data = await response.json();

            const filtered = data.filter(item =>
                item.descricao.toLowerCase().includes(term.toLowerCase()) ||
                item.id.includes(term)
            ).slice(0, 10); // Top 10

            setCnaeResults(filtered);
        } catch (err) {
            console.error("Erro IBGE API", err);
        } finally {
            setLoadingCnae(false);
        }
    };

    const handleCnpjBlur = async (e) => {
        const cnpjRaw = e.target.value.replace(/\D/g, '');
        if (cnpjRaw.length !== 14) return;

        setLoadingCnae(true); // Re-using loading state for feedback
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjRaw}`);
            if (!response.ok) throw new Error('Erro ao buscar CNPJ');

            const data = await response.json();

            // Mapeia CNAEs da BrasilAPI para nosso formato
            const cnaesEncontrados = [];

            // Principal
            if (data.cnae_fiscal_principal_code) {
                cnaesEncontrados.push({
                    id: String(data.cnae_fiscal_principal_code), // Garantir string
                    descricao: data.cnae_fiscal_principal_descricao
                });
            }

            // Secundários
            if (data.cnaes_secundarios && Array.isArray(data.cnaes_secundarios)) {
                data.cnaes_secundarios.forEach(c => {
                    cnaesEncontrados.push({
                        id: String(c.codigo),
                        descricao: c.descricao
                    });
                });
            }

            // Atualiza form
            setFormData(prev => ({
                ...prev,
                // Preenche Nome se vazio
                nome: !prev.nome ? (data.razao_social || data.nome_fantasia) : prev.nome,
                // Preenche Email se vazio (BrasilAPI retorna email em minúsculo geralmente)
                email: !prev.email ? (data.email || '') : prev.email,
                // Preenche Telefone se vazio (ddd_telefon_1)
                telefone: !prev.telefone ? (data.ddd_telefone_1 || '') : prev.telefone,
                // Adiciona CNAEs (substitui ou merge? Vamos substituir para ser "fresh data" da receita)
                cnaes: cnaesEncontrados
            }));

        } catch (err) {
            console.error("Erro ao buscar CNPJ", err);
            // Não bloqueia o fluxo, apenas loga e não preenche
        } finally {
            setLoadingCnae(false);
        }
    };

    const selectCnae = (item) => {
        // Evitar duplicados
        const exists = formData.cnaes.find(c => c.id === item.id);
        if (exists) {
            setCnaeSearch('');
            setCnaeResults([]);
            return;
        }

        const novoCnae = { id: item.id, descricao: item.descricao };
        setFormData(prev => ({
            ...prev,
            cnaes: [...prev.cnaes, novoCnae]
        }));
        setCnaeSearch('');
        setCnaeResults([]);
    };

    const removeCnae = (id) => {
        setFormData(prev => ({
            ...prev,
            cnaes: prev.cnaes.filter(c => c.id !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = [];
        if (!formData.nome.trim()) newErrors.push('Nome é obrigatório');
        if (!formData.email.trim()) newErrors.push('Email é obrigatório');
        if (!formData.telefone.trim()) newErrors.push('Telefone é obrigatório');
        if (!formData.categoria) newErrors.push('Categoria é obrigatória');

        if (formData.tipo === 'empresa' && !formData.cnpj.trim()) {
            newErrors.push('CNPJ é obrigatório para empresas');
        }

        if (formData.tipo === 'pessoa' && !formData.cpf.trim()) {
            newErrors.push('CPF é obrigatório para pessoa física');
        }

        if (newErrors.length > 0) {
            setError(newErrors.join(', '));
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
                        <>
                            <div className="form-group">
                                <label>CNPJ *</label>
                                <input
                                    type="text"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    onBlur={handleCnpjBlur}
                                    placeholder="00.000.000/0000-00 (Busca automática)"
                                    disabled={saving}
                                />
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label>CNAE (Busca Automática)</label>
                                <input
                                    type="text"
                                    value={cnaeSearch}
                                    onChange={handleCnaeSearch}
                                    placeholder="Digite o código ou descrição da atividade..."
                                    disabled={saving || loadingCnae}
                                    autoComplete="off"
                                />
                                {loadingCnae && <div className="cnae-loading">{formData.cnaes.length > 0 ? 'Atualizando...' : 'Buscando...'}</div>}
                                {cnaeResults.length > 0 && (
                                    <ul className="cnae-results">
                                        {cnaeResults.map(item => (
                                            <li key={item.id} onClick={() => selectCnae(item)}>
                                                <strong>{item.id}</strong> - {item.descricao}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {formData.cnaes.length > 0 && (
                                    <div className="cnae-tags">
                                        {formData.cnaes.map(c => (
                                            <span key={c.id} className="cnae-tag">
                                                {c.id} - {c.descricao}
                                                <button type="button" onClick={() => removeCnae(c.id)}>&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {formData.tipo === 'pessoa' && (
                        <div className="form-group">
                            <label>CPF *</label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                disabled={saving}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Categoria Principal *</label>
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
                        <label>Email *</label>
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
                        <label>Telefone *</label>
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
