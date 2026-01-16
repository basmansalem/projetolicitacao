const API_BASE_URL = 'http://localhost:3001';

// Serviço de API para comunicação com o backend
const api = {
    // =====================
    // LICITAÇÕES (legado)
    // =====================
    licitacoes: {
        async getAll() {
            const response = await fetch(`${API_BASE_URL}/licitacoes`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar licitações');
            return data;
        },
        async getById(id) {
            const response = await fetch(`${API_BASE_URL}/licitacoes/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Licitação não encontrada');
            return data;
        },
        async create(licitacao) {
            const response = await fetch(`${API_BASE_URL}/licitacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(licitacao)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async update(id, licitacao) {
            const response = await fetch(`${API_BASE_URL}/licitacoes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(licitacao)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async delete(id) {
            const response = await fetch(`${API_BASE_URL}/licitacoes/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        }
    },

    // =====================
    // PRESTADORES
    // =====================
    prestadores: {
        async getAll() {
            const response = await fetch(`${API_BASE_URL}/prestadores`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar prestadores');
            return data;
        },
        async getById(id) {
            const response = await fetch(`${API_BASE_URL}/prestadores/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Prestador não encontrado');
            return data;
        },
        async create(prestador) {
            const response = await fetch(`${API_BASE_URL}/prestadores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prestador)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async update(id, prestador) {
            const response = await fetch(`${API_BASE_URL}/prestadores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prestador)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async delete(id) {
            const response = await fetch(`${API_BASE_URL}/prestadores/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        }
    },

    // =====================
    // ITENS
    // =====================
    itens: {
        async getAll(filters = {}) {
            const params = new URLSearchParams();
            if (filters.prestadorId) params.append('prestadorId', filters.prestadorId);
            if (filters.categoria) params.append('categoria', filters.categoria);
            if (filters.ativo !== undefined) params.append('ativo', filters.ativo);

            const url = `${API_BASE_URL}/itens${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar itens');
            return data;
        },
        async getById(id) {
            const response = await fetch(`${API_BASE_URL}/itens/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Item não encontrado');
            return data;
        },
        async getCategorias() {
            const response = await fetch(`${API_BASE_URL}/itens/categorias`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar categorias');
            return data;
        },
        async getUnidades() {
            const response = await fetch(`${API_BASE_URL}/itens/unidades`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar unidades');
            return data;
        },
        async create(item) {
            const response = await fetch(`${API_BASE_URL}/itens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async update(id, item) {
            const response = await fetch(`${API_BASE_URL}/itens/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async delete(id) {
            const response = await fetch(`${API_BASE_URL}/itens/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        }
    },

    // =====================
    // CHAMADAS
    // =====================
    chamadas: {
        async getAll(filters = {}) {
            const params = new URLSearchParams();
            if (filters.categoria) params.append('categoria', filters.categoria);
            if (filters.status) params.append('status', filters.status);

            const url = `${API_BASE_URL}/chamadas${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar chamadas');
            return data;
        },
        async getById(id) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Chamada não encontrada');
            return data;
        },
        async getPossibilidades(id) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}/possibilidades`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar possibilidades');
            return data;
        },
        async create(chamada) {
            const response = await fetch(`${API_BASE_URL}/chamadas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chamada)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async update(id, chamada) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chamada)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        },
        async delete(id) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        },
        async regenerarPossibilidades(id) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}/regenerar-possibilidades`, {
                method: 'POST'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        },
        async getOfertas(id) {
            const response = await fetch(`${API_BASE_URL}/chamadas/${id}/ofertas`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar ofertas');
            return data;
        }
    },

    // =====================
    // OFERTAS
    // =====================
    ofertas: {
        async getAll(filters = {}) {
            const params = new URLSearchParams();
            if (filters.chamadaId) params.append('chamadaId', filters.chamadaId);
            if (filters.prestadorId) params.append('prestadorId', filters.prestadorId);

            const url = `${API_BASE_URL}/ofertas${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar ofertas');
            return data;
        },
        async getById(id) {
            const response = await fetch(`${API_BASE_URL}/ofertas/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Oferta não encontrada');
            return data;
        },
        async create(oferta) {
            const response = await fetch(`${API_BASE_URL}/ofertas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(oferta)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors?.join(', ') || data.error);
            return data;
        }
    },
    admin: {
        async getAllUsers() {
            const response = await fetch(`${API_BASE_URL}/admin/users`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao buscar usuários');
            return data;
        },
        async toggleStatus(id) {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
                method: 'PATCH'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao alterar status');
            return data;
        },
        async resetPassword(id) {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}/reset-password`, {
                method: 'POST'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao redefinir senha');
            return data;
        }
    }
};

export default api;

// Constantes
export const CATEGORIAS = [
    'Tecnologia',
    'Construção Civil',
    'Serviços Gerais',
    'Saúde',
    'Educação',
    'Transporte e Logística',
    'Alimentação'
];

export const UNIDADES = ['unidade', 'hora', 'diária', 'mensal', 'anual', 'projeto'];

export const STATUS_CHAMADA = ['Aberta', 'Em análise', 'Contratada', 'Encerrada'];

export const TIPOS_PRESTADOR = ['empresa', 'pessoa'];

// Constantes para o módulo de Licitações (legado)
export const STATUS_OPTIONS = [
    'Cadastrada',
    'Publicada',
    'Em disputa',
    'Homologada',
    'Encerrada'
];

export const MODALIDADES = [
    'Pregão Eletrônico',
    'Pregão Presencial',
    'Concorrência',
    'Tomada de Preços',
    'Convite',
    'Leilão',
    'Dispensa de Licitação',
    'Inexigibilidade'
];
