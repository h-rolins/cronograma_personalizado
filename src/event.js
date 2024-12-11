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
  
const atualizarEvento = async (id, titulo, data, hora, disponibilidade) => {
  const connection = await createConnection();

  if (!id || !titulo || !data || !hora || !disponibilidade) {
      console.log('Todos os campos são obrigatórios');
      return;
  }

  try {
      const [result] = await connection.query(
          'UPDATE evento SET titulo = ?, data = ?, hora = ?, disponibilidade = ? WHERE id = ?',
          [titulo, data, hora, disponibilidade, id]
      );

      if (result.affectedRows > 0) {
          console.log('Evento atualizado com sucesso, ID:', id);
      } else {
          console.log('Nenhum evento encontrado com o ID fornecido:', id);
      }
  } catch (err) {
      console.error('Erro ao atualizar evento:', err.message);
  } finally {
      await connection.end();
  }
};

const deletarEvento = async (id) => {
  const connection = await createConnection();

  if (!id) {
      console.log('ID do evento é obrigatório');
      return;
  }

  try {
      const [result] = await connection.query(
          'DELETE FROM evento WHERE id = ?',
          [id]
      );

      if (result.affectedRows > 0) {
          console.log('Evento deletado com sucesso, ID:', id);
      } else {
          console.log('Nenhum evento encontrado com o ID fornecido:', id);
      }
  } catch (err) {
      console.error('Erro ao deletar evento:', err.message);
  } finally {
      await connection.end();
  }
};
  
 /*registrarEvento(
    'Dentista',        // título
    '2024-12-21',             // data
    '9:00',                  // hora
    'Sim',            // disponibilidade
    1                          // id_user
  );
  
atualizarEvento(
    1,                  // id
    'Reunião COPESE',        // título
    '2024-12-14',       // data
    '14:00',            // hora
    'Sim'              // disponibilidade
);*/

deletarEvento(3); // id
