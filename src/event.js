const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js'); 

const registrarEvento = async (titulo, data, hora, disponibilidade, id_user) => {
    const connection = await createConnection();

    if (!titulo || !data || !hora || !disponibilidade || !id_user) {
      console.log('Todos os campos são obrigatórios');
      return;
    }
  
    try {
  
      const [result] = await connection.query(
            'INSERT INTO evento (titulo, data, hora, disponibilidade, id_user) VALUES (?, ?, ?, ?, ?)',
            values = [titulo, data, hora, disponibilidade, id_user]
        ); 


        console.log('Evento adicionado com sucesso, ID:', result.insertId);    
    } catch (err) {
        console.error('Erro ao adicionar evento:', error.message);
    } finally {
        await connection.end(); // Fecha a conexão
    }
  };
  
  // Exemplo de chamada para registrar um evento
 /*registrarEvento(
    'Aniversário Luisa',        // título
    '2024-12-18',             // data
    '15:00',                  // hora
    'Não',            // disponibilidade
    1                          // id_user
  );*/