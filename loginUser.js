const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js');
const express = require('express');

const app = express();

// Configurar sessão
app.use(session({
    secret: 'gfTALkSvWDcy4PzpBKCmqd',
    resave: false,
    saveUninitialized: true,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Login tradicional (email e senha)
const loginUser = async (email, senha) => {
    const connection = await createConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (rows.length === 0) {
            console.log('Erro: Usuário não encontrado.');
            return false;
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            console.log('Erro: Senha incorreta.');
            return false;
        }

        console.log('Login bem-sucedido!');
        return true;
    } catch (error) {
        console.error('Erro ao realizar login:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

// Configurar estratégia do Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const connection = await createConnection();

    try {
        const [existingUser] = await connection.query('SELECT * FROM usuario WHERE google_id = ?', [profile.id]);
        if (existingUser.length > 0) {
            return done(null, existingUser[0]);
        }

        // Registrar usuário, se não existir
        const [result] = await connection.query(
            'INSERT INTO usuario (nome, email, google_id) VALUES (?, ?, ?)',
            [profile.displayName, profile.emails[0].value, profile.id]
        );

        const newUser = {
            id: result.insertId,
            nome: profile.displayName,
            email: profile.emails[0].value,
        };

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    } finally {
        await connection.end();
    }
}));

// Serializar e desserializar usuários
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const connection = await createConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM usuario WHERE id = ?', [id]);
        done(null, rows[0]);
    } catch (error) {
        done(error, null);
    } finally {
        await connection.end();
    }
});

// Rotas de login com Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/'); // Redireciona após login bem-sucedido
    }
);

// Rota protegida (exemplo)
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.send(`Bem-vindo, ${req.user.nome}`);
});

// Exemplo de uso do login tradicional
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const success = await loginUser(email, senha);

    if (success) {
        res.send('Login tradicional bem-sucedido!');
    } else {
        res.send('Falha no login tradicional.');
    }
});

// Iniciar servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

