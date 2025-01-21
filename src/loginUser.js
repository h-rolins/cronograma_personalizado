const bcrypt = require('bcryptjs');
const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js');

const loginUser = async (email, senha) => {
    const connection = await createConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (rows.length === 0) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return { success: false, message: 'Senha incorreta' };
        }

        return { success: true, user };
    } catch (error) {
        console.error('Erro ao realizar login:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

module.exports = { loginUser };
(async () => {
    const email = 'vitoria.lima@example.com'; // Substitua pelo email que existe no banco
    const senha = '142563';     // Substitua pela senha correspondente

    try {
        const result = await loginUser(email, senha);
        console.log(result.success 
            ? `Login bem-sucedido: ${result.user.nome}` 
            : `Falha no login: ${result.message}`);
    } catch (error) {
        console.error('Erro ao testar login:', error.message);
    }
})();
