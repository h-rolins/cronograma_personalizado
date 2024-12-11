const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js'); 

const registrarTarefa = async (titulo, data, hora, disciplina, prioridade, conteudo, id_user) => {
    const connection = await createConnection();

    if (!titulo || !data || !hora || !disciplina || !prioridade || !conteudo || !id_user) {
      console.log('Todos os campos são obrigatórios');
      return;
    }
  
    try {
  
      const [result] = await connection.query(
            'INSERT INTO tarefa (titulo, data, hora, disciplina, prioridade, conteudo, id_user) VALUES (?, ?, ?, ?, ?, ?, ?)',
            values = [titulo, data, hora, disciplina, prioridade, conteudo, id_user]
        ); 


        console.log('Tarefa adicionada com sucesso, ID:', result.insertId);    
    } catch (err) {
        console.error('Erro ao adicionar tarefa:', error.message);
    } finally {
        await connection.end(); // Fecha a conexão
    }
  };


const atualizarTarefa = async (id, titulo, data, hora, disciplina, prioridade, conteudo) => {
  const connection = await createConnection();

  if (!id || !titulo || !data || !hora || !disciplina || !prioridade || !conteudo) {
      console.log('Todos os campos são obrigatórios');
      return;
  }

  try {
      const [result] = await connection.query(
          'UPDATE tarefa SET titulo = ?, data = ?, hora = ?, disciplina = ?, prioridade = ?, conteudo = ? WHERE id = ?',
          [titulo, data, hora, disciplina, prioridade, conteudo, id]
      );

      if (result.affectedRows > 0) {
          console.log('Tarefa atualizada com sucesso, ID:', id);
      } else {
          console.log('Nenhuma tarefa encontrada com o ID fornecido:', id);
      }
  } catch (err) {
      console.error('Erro ao atualizar tarefa:', err.message);
  } finally {
      await connection.end();
  }
};

const deletarTarefa = async (id) => {
  const connection = await createConnection();

  if (!id) {
      console.log('ID da tarefa é obrigatório');
      return;
  }

  try {
      const [result] = await connection.query(
          'DELETE FROM tarefa WHERE id = ?',
          [id]
      );

      if (result.affectedRows > 0) {
          console.log('Tarefa deletada com sucesso, ID:', id);
      } else {
          console.log('Nenhuma tarefa encontrada com o ID fornecido:', id);
      }
  } catch (err) {
      console.error('Erro ao deletar tarefa:', err.message);
  } finally {
      await connection.end();
  }
};
  
  // Exemplo de chamada para registrar uma tarefa
  /*registrarTarefa(
    'Prova ED1',        // título
    '2024-12-01',             // data
    '15:00',                  // hora
    'ED1',            // disciplina
    'Alta',                   // prioridade
    'Estudar pilha', // conteúdo
    1                          // id_user
  );*/

/*atualizarTarefa(
    6,                  // id
    'Prova ED2',        // título
    '2024-12-05',       // data
    '14:00',            // hora
    'ED2',              // disciplina
    'Alta',             // prioridade
    'Estudar filas'     // conteúdo
);

deletarTarefa(5); // id*/
