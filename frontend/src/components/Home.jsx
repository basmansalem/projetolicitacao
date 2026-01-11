import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home-hero">
                <h1>Sistema de Controle de Licitações</h1>
                <p>Selecione seu perfil para continuar</p>
            </div>

            <div className="profile-cards">
                <Link to="/prestador" className="profile-card prestador">
                    <div className="card-icon">🏢</div>
                    <h2>Prestador</h2>
                    <p>Cadastre seus itens e serviços para participar de chamadas de contratação</p>
                    <ul className="card-features">
                        <li>📦 Cadastrar itens por categoria</li>
                        <li>💰 Definir valores de referência</li>
                        <li>📊 Gerenciar ofertas ativas</li>
                    </ul>
                    <span className="card-cta">Acessar como Prestador →</span>
                </Link>

                <Link to="/contratante" className="profile-card contratante">
                    <div className="card-icon">🏛️</div>
                    <h2>Contratante</h2>
                    <p>Crie chamadas e encontre prestadores compatíveis automaticamente</p>
                    <ul className="card-features">
                        <li>📝 Criar chamadas de contratação</li>
                        <li>🔍 Visualizar possibilidades</li>
                        <li>⚡ Matching automático</li>
                    </ul>
                    <span className="card-cta">Acessar como Contratante →</span>
                </Link>
            </div>

            <div className="home-footer">
                <p>POC - Prova de Conceito</p>
                <Link to="/licitacoes" className="legacy-link">
                    Acessar módulo de Licitações (legado)
                </Link>
            </div>
        </div>
    );
}

export default Home;
