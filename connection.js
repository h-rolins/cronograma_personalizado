require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const mysql = require('mysql2/promise');

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
        console.log('Conexão com o banco de dados bem-sucedida!');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
};

module.exports = createConnection;
