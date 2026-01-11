import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LicitacaoList from './components/LicitacaoList';
import LicitacaoForm from './components/LicitacaoForm';
import LicitacaoDetail from './components/LicitacaoDetail';
import PrestadorDashboard from './components/prestador/PrestadorDashboard';
import ItemForm from './components/prestador/ItemForm';
import ChamadaList from './components/contratante/ChamadaList';
import ChamadaForm from './components/contratante/ChamadaForm';
import ChamadaDetail from './components/contratante/ChamadaDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-container">
            <a href="/" className="logo">
              <span className="logo-icon">📋</span>
              <span className="logo-text">Sistema de Licitações</span>
            </a>
            <nav className="nav">
              <a href="/" className="nav-link">Início</a>
              <a href="/prestador" className="nav-link nav-prestador">Prestador</a>
              <a href="/contratante" className="nav-link nav-contratante">Contratante</a>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Prestador */}
            <Route path="/prestador" element={<PrestadorDashboard />} />
            <Route path="/prestador/item/novo" element={<ItemForm />} />
            <Route path="/prestador/item/:id" element={<ItemForm />} />

            {/* Contratante */}
            <Route path="/contratante" element={<ChamadaList />} />
            <Route path="/contratante/chamada/nova" element={<ChamadaForm />} />
            <Route path="/contratante/chamada/:id" element={<ChamadaDetail />} />

            {/* Licitações (legado) */}
            <Route path="/licitacoes" element={<LicitacaoList />} />
            <Route path="/nova" element={<LicitacaoForm />} />
            <Route path="/editar/:id" element={<LicitacaoForm />} />
            <Route path="/licitacao/:id" element={<LicitacaoDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>Sistema de Controle de Licitações - POC v2.0 © 2026</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
