# Sistema de Controle de Licitações - POC v2.0

Prova de conceito de um sistema web para controle de licitações com suporte a dois perfis de usuário: **Prestador** e **Contratante**, incluindo matching automático entre ofertas e demandas.

## 🆕 Novidades da v2.0

- ✅ **Dois perfis de usuário**: Prestador e Contratante
- ✅ **Cadastro de itens por categoria** (Prestador)
- ✅ **Criação de chamadas/demandas** (Contratante)
- ✅ **Matching automático** entre chamadas e itens
- ✅ **Score de compatibilidade** para ranking de possibilidades
- ✅ **7 categorias** de itens/serviços

## 📋 Funcionalidades

### Prestador 🏢
- Cadastrar itens/serviços por categoria
- Definir valores de referência e unidades
- Ativar/desativar itens
- Visualizar estatísticas

### Contratante 🏛️
- Criar chamadas de contratação
- Definir categoria, valor máximo e prazo
- Visualizar prestadores compatíveis automaticamente
- Ver score de compatibilidade
- Gerenciar status das chamadas

### Licitações (Legado)
- CRUD completo de licitações
- Controle de status

## 🏗️ Arquitetura

```
ProjetoCampo/
├── backend/                    # API REST Node.js + Express
│   ├── controllers/
│   │   ├── licitacoesController.js
│   │   ├── prestadoresController.js
│   │   ├── itensController.js
│   │   └── chamadasController.js
│   ├── data/                   # Armazenamento em memória
│   │   ├── licitacoes.js
│   │   ├── prestadores.js
│   │   ├── itens.js
│   │   ├── chamadas.js
│   │   └── possibilidades.js
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/                   # SPA React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── prestador/      # Interface Prestador
│   │   │   ├── contratante/    # Interface Contratante
│   │   │   ├── Home.jsx        # Seleção de perfil
│   │   │   └── Licitacao*.jsx  # Módulo legado
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm start
```

Servidor: **http://localhost:3001**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação: **http://localhost:5173**

## 🔌 API Endpoints

### Prestadores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/prestadores` | Listar todos |
| POST | `/prestadores` | Criar |
| GET | `/prestadores/:id` | Detalhar |
| PUT | `/prestadores/:id` | Atualizar |
| DELETE | `/prestadores/:id` | Remover |

### Itens
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/itens` | Listar (filtros: prestadorId, categoria) |
| GET | `/itens/categorias` | Listar categorias |
| POST | `/itens` | Criar |
| GET | `/itens/:id` | Detalhar |
| PUT | `/itens/:id` | Atualizar |
| DELETE | `/itens/:id` | Remover |

### Chamadas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/chamadas` | Listar todas |
| POST | `/chamadas` | Criar (gera possibilidades) |
| GET | `/chamadas/:id` | Detalhar (inclui possibilidades) |
| GET | `/chamadas/:id/possibilidades` | Listar possibilidades |
| POST | `/chamadas/:id/regenerar-possibilidades` | Atualizar busca |
| PUT | `/chamadas/:id` | Atualizar |
| DELETE | `/chamadas/:id` | Remover |

## 📁 Categorias Disponíveis

1. **Tecnologia** - Sistemas, suporte, hospedagem
2. **Construção Civil** - Reforma, pintura, manutenção
3. **Serviços Gerais** - Limpeza, vigilância, recepção
4. **Saúde** - Exames, atendimento médico
5. **Educação** - Cursos, treinamentos, palestras
6. **Transporte e Logística** - Frete, entregas
7. **Alimentação** - Fornecimento de refeições

## ⚡ Lógica de Matching

Quando uma **Chamada** é criada, o sistema automaticamente:

1. Identifica a **categoria** da chamada
2. Busca todos os **itens ativos** dos prestadores nessa categoria
3. Filtra itens onde `valorReferencia <= valorMaximo`
4. Agrupa itens por **prestador**
5. Cria **Possibilidades** para cada prestador compatível
6. Calcula **Score de Compatibilidade**:
   - Base: 100 pontos
   - +10 se valor médio ≤ 50% do máximo
   - +5 por item compatível adicional

## 🗄️ Modelos de Dados

### Prestador
```json
{
  "id": "uuid",
  "nome": "Tech Solutions",
  "tipo": "empresa | pessoa"
}
```

### Item
```json
{
  "id": "uuid",
  "prestadorId": "uuid",
  "categoria": "Tecnologia",
  "nome": "Desenvolvimento Web",
  "descricao": "Descrição",
  "valorReferencia": 50000,
  "unidade": "projeto",
  "ativo": true
}
```

### Chamada
```json
{
  "id": "uuid",
  "titulo": "Contratação de TI",
  "descricao": "Detalhes",
  "categoria": "Tecnologia",
  "quantidade": 1,
  "valorMaximo": 100000,
  "prazoExecucao": "2026-06-30",
  "status": "Aberta"
}
```

### Possibilidade
```json
{
  "id": "uuid",
  "chamadaId": "uuid",
  "prestadorId": "uuid",
  "prestadorNome": "Tech Solutions",
  "itensCompativeis": [...],
  "valorTotal": 50000,
  "scoreCompatibilidade": 110
}
```

## 📱 Telas

### Home
- Seleção de perfil (Prestador ou Contratante)

### Prestador
- **Dashboard**: Lista de itens, estatísticas, filtro por categoria
- **Formulário**: Cadastro/edição de itens

### Contratante
- **Lista de Chamadas**: Cards com informações e possibilidades
- **Nova Chamada**: Formulário com matching automático
- **Detalhes**: Dados da chamada + lista de possibilidades rankeadas

## 🎨 Design

- **Prestador**: Tema verde (#10b981)
- **Contratante**: Tema roxo (#6366f1)
- Design responsivo (desktop-first)
- Dark mode automático

## ⚠️ Observações

- Esta é uma **POC** (Prova de Conceito)
- Dados armazenados **em memória** (perdem-se ao reiniciar)
- Sem autenticação real (perfil via toggle)
- Preparado para evolução futura

## 📝 Licença

Projeto desenvolvido como prova de conceito.
