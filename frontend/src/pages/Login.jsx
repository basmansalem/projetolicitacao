import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({ email: '', senha: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(data.email, data.senha);
            if (user.perfil === 'prestador') {
                navigate('/prestador');
            } else if (user.perfil === 'admin' || user.perfil === 'root') {
                navigate('/admin');
            } else {
                navigate('/contratante');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f7fa'
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
            }}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>Entrar no Sistema</h1>
                {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Nome de Usuário</label>
                        <input
                            type="text"
                            value={data.email} // Mantendo state 'email' por enquanto mas tratando como user
                            onChange={e => setData({ ...data, email: e.target.value })}
                            required
                            placeholder="Digite seu nome de cadastro"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Senha</label>
                        <input
                            type="password"
                            value={data.senha}
                            onChange={e => setData({ ...data, senha: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px', background: '#5d5fef', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        Não tem conta? <Link to="/register" style={{ color: '#5d5fef' }}>Cadastre-se</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
