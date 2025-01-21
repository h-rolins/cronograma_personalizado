const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js'); 

const registrarTarefa = async (titulo, data, turno, disciplina, conteudo, id_user) => {
    const connection = await createConnection();

    if (!titulo || !data || !turno || !disciplina || !conteudo || !id_user) {
      console.log('Todos os campos são obrigatórios');
      return;
    }
  
    try {
  
      const [result] = await connection.query(
            'INSERT INTO tarefa (titulo, data, turno, disciplina,  conteudo, id_user) VALUES (?, ?, ?, ?, ?, ?)',
            values = [titulo, data, turno, disciplina,  conteudo, id_user]
        ); 


        console.log('Tarefa adicionada com sucesso, ID:', result.insertId);    
    } catch (err) {
        console.error('Erro ao adicionar tarefa:', error.message);
    } finally {
        await connection.end(); // Fecha a conexão
    }
  };

const atualizarTarefa = async (id_tarefa, titulo, data, turno, disciplina,  conteudo) => {
  const connection = await createConnection();

  if (!id_tarefa || !titulo || !data || !turno || !disciplina || !conteudo) {
      console.log('Todos os campos são obrigatórios');
      return;
  }

  try {
      const [result] = await connection.query(
          'UPDATE tarefa SET titulo = ?, data = ?, turno = ?, disciplina = ?, conteudo = ? WHERE id_tarefa = ?',
          [titulo, data, turno, disciplina,  conteudo, id_tarefa]
      );

      if (result.affectedRows > 0) {
          console.log('Tarefa atualizada com sucesso, ID:', id_tarefa);
      } else {
          console.log('Nenhuma tarefa encontrada com o ID fornecido:', id_tarefa);
      }
  } catch (err) {
      console.error('Erro ao atualizar tarefa:', err.message);
  } finally {
      await connection.end();
  }
};

const deletarTarefa = async (id_tarefa) => {
  const connection = await createConnection();

  if (!id_tarefa) {
      console.log('ID da tarefa é obrigatório');
      return;
  }

  try {
      const [result] = await connection.query(
          'DELETE FROM tarefa WHERE id_tarefa = ?',
          [id_tarefa]
      );

      if (result.affectedRows > 0) {
          console.log('Tarefa deletada com sucesso, ID:', id_tarefa);
      } else {
          console.log('Nenhuma tarefa encontrada com o ID fornecido:', id_tarefa);
      }
  } catch (err) {
      console.error('Erro ao deletar tarefa:', err.message);
  } finally {
      await connection.end();
  }
};

const lerTarefas = async (id_user) => {
    const connection = await createConnection();

    if (!id_user) {
        console.log('ID do usuário é obrigatório');
        return;
    }

    try {
        const [rows] = await connection.query(
            'SELECT * FROM tarefa WHERE id_user = ?',
            [id_user]
        );

        if (rows.length > 0) {
            console.log('Tarefas encontradas:', rows);
        } else {
            console.log('Nenhuma tarefa encontrada para o ID do usuário:', id_user);
        }
    } catch (err) {
        console.error('Erro ao ler tarefas:', err.message);
    } finally {
        await connection.end();
    }
};

/*
lerTarefas(6); 

registrarTarefa(
    'Seminário Literatura',        // título
    '2025-02-19',             // data
    'manha',                  // turno
    'Literatura',            // disciplina
    'Revisão, 1ª geração modernismo, 2ª geração modernismo, 3ª geração modernismo', // conteúdo
    6                          // id_user
  );

atualizarTarefa(
    8,                  // id
    'Seminário Literatura',        // título
    '2025-02-17',       // data
    'tarde',            // turno
    'Literatura',            // disciplina
    'Revisão, 1ª geração modernismo, 2ª geração modernismo, 3ª geração modernismo', // conteúdo
);

deletarTarefa(9); // id*/
