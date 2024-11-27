const bcrypt = require('bcryptjs');
const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js'); 

// Função para registrar um usuário
const registerUser = async (nome, email, senha) => {
    const connection = await createConnection(); 

    try {
        // Verificar se o email já está registrado
        const [existingUser] = await connection.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            console.log('Erro: Já existe um usuário com este email.');
            return;
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Inserir o usuário no banco de dados
        const [result] = await connection.query(
            'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedPassword]
        );

        console.log(`Usuário cadastrado com sucesso! ID: ${result.insertId}`);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
    } finally {
        await connection.end(); // Fecha a conexão
    }
};

// Exemplo de uso: Registrar um usuário
//registerUser('João Silva', 'joao.silva@example.com', 'senha123');