import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({
        nome: '',
        email: '',
        senha: '',
        perfil: 'contratante',
        tipoPrestador: 'pessoa',
        documento: '',
        categoria: 'Tecnologia' // Default for providers
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Auto-generate email for testing since field was removed
            const randomId = Math.floor(Math.random() * 10000);
            const generatedEmail = `${data.nome.toLowerCase().replace(/\s/g, '')}${randomId}@teste.com`;
            const payload = { ...data, email: generatedEmail };

            console.log("Enviando dados:", payload);
            const user = await register(payload);

            // Show generated email to user so they can login
            alert(`✅ CADASTRO REALIZADO!\n\n📧 Email gerado para login: ${generatedEmail}\n🔑 Senha: ${data.senha}\n\nGuarde esses dados para entrar!`);

            if (user.perfil === 'prestador') {
                navigate('/prestador');
            } else {
                navigate('/contratante');
            }
        } catch (err) {
            console.error("Erro no cadastro:", err);
            setError(err.message);
            alert("Erro ao cadastrar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f7fa', padding: '20px'
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px'
            }}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>Criar Conta</h1>
                {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            value={data.nome}
                            onChange={e => setData({ ...data, nome: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={data.senha}
                            onChange={e => setData({ ...data, senha: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Tipo de Perfil</label>
                        <select
                            value={data.perfil}
                            onChange={e => setData({ ...data, perfil: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                        >
                            <option value="contratante">Contratante (Quero contratar)</option>
                            <option value="prestador">Prestador (Quero trabalhar)</option>
                        </select>
                    </div>

                    {data.perfil === 'prestador' ? (
                        <>
                            <div style={{ marginBottom: '15px', background: '#eef', padding: '15px', borderRadius: '8px' }}>
                                <label>Tipo de Prestador</label>
                                <select
                                    value={data.tipoPrestador}
                                    onChange={e => setData({ ...data, tipoPrestador: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px' }}
                                >
                                    <option value="pessoa">Pessoa Física</option>
                                    <option value="empresa">Empresa</option>
                                </select>
                                <label>{data.tipoPrestador === 'pessoa' ? 'CPF' : 'CNPJ'} (Apenas Números)</label>
                                <input
                                    type="text"
                                    value={data.documento}
                                    onChange={e => setData({ ...data, documento: e.target.value })}
                                    required
                                    placeholder={data.tipoPrestador === 'pessoa' ? 'Apenas números do CPF' : 'Apenas números do CNPJ'}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px' }}
                                />
                                <label>Categoria Principal</label>
                                <select
                                    value={data.categoria}
                                    onChange={e => setData({ ...data, categoria: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                >
                                    <option value="Tecnologia">Tecnologia</option>
                                    <option value="Construção Civil">Construção Civil</option>
                                    <option value="Serviços Gerais">Serviços Gerais</option>
                                    <option value="Saúde">Saúde</option>
                                    <option value="Educação">Educação</option>
                                    <option value="Transporte e Logística">Transporte e Logística</option>
                                    <option value="Alimentação">Alimentação</option>
                                </select>
                            </div>
                        </>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px', background: '#5d5fef', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        Já tem conta? <Link to="/login" style={{ color: '#5d5fef' }}>Entrar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
