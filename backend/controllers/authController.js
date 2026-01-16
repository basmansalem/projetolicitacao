const usersData = require('../data/users');
const prestadoresData = require('../data/prestadores');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'segredo_poc_super_seguro'; // Em prod usar env var

const register = async (req, res) => {
    console.log("Register Request Body:", req.body);
    try {
        const { nome, email, senha, perfil, tipoPrestador, documento } = req.body;

        // Validações básicas
        if (!nome || !email || !senha || !perfil) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const existingUser = await usersData.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);

        let relatedId = null;

        // Se for prestador, cria perfil de prestador automaticamente
        if (perfil === 'prestador') {
            // Cria prestador básico
            const novoPrestador = await prestadoresData.create({
                nome: nome,
                // Se o usuário mandou tipo e documento no registro, usa. Senão defaults.
                tipo: tipoPrestador || 'pessoa', // Default pra facilitar
                cnpj: tipoPrestador === 'empresa' ? documento : '',
                cpf: tipoPrestador === 'pessoa' ? documento : '',
                email: email, // Vincula email
                categoria: req.body.categoria || 'Geral' // Usa categoria enviada ou default
            });
            relatedId = novoPrestador.id;
        }

        const newUser = await usersData.create({
            nome,
            email,
            senha: hash,
            perfil,
            relatedId
        });

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, perfil: newUser.perfil, relatedId: newUser.relatedId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                nome: newUser.nome,
                email: newUser.email,
                perfil: newUser.perfil,
                relatedId: newUser.relatedId
            }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: 'Erro interno no servidor ao registrar' });
    }
};

const login = async (req, res) => {
    try {
        const { nome, senha, email } = req.body;

        // Tenta buscar por nome (prioridade) ou email (legado)
        let user = null;
        if (nome) {
            user = await usersData.getByNome(nome);
        } else if (email) {
            user = await usersData.getByEmail(email);
        }

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Check if active
        if (user.ativo === 0 || user.ativo === false) {
            return res.status(403).json({ error: 'Usuário bloqueado/inativo. Contate o administrador.' });
        }

        const validPass = bcrypt.compareSync(senha, user.senha);
        if (!validPass) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, perfil: user.perfil, relatedId: user.relatedId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                perfil: user.perfil,
                relatedId: user.relatedId
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Erro interno no servidor ao logar' });
    }
};

module.exports = { register, login };
