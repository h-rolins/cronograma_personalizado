const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js'); 

const registrarEvento = async (titulo, data, turno, disponibilidade, id_user) => {
    const connection = await createConnection();

    if (!titulo || !data || !turno || !disponibilidade || !id_user) {
      console.log('Todos os campos são obrigatórios');
      return;
    }
  
    try {
  
      const [result] = await connection.query(
            'INSERT INTO evento (titulo, data, turno, disponibilidade, id_user) VALUES (?, ?, ?, ?, ?)',
            values = [titulo, data, turno, disponibilidade, id_user]
        ); 


        console.log('Evento adicionado com sucesso, ID:', result.insertId);    
    } catch (err) {
        console.error('Erro ao adicionar evento:', error.message);
    } finally {
        await connection.end(); // Fecha a conexão
    }
  };
  
const atualizarEvento = async (id_evento, titulo, data, turno, disponibilidade) => {
  const connection = await createConnection();

  if (!id_evento || !titulo || !data || !turno || !disponibilidade) {
      console.log('Todos os campos são obrigatórios');
      return;
  }

  try {
      const [result] = await connection.query(
          'UPDATE evento SET titulo = ?, data = ?, turno = ?, disponibilidade = ? WHERE id_evento = ?',
          [titulo, data, turno, disponibilidade, id_evento]
      );

      if (result.affectedRows > 0) {
          console.log('Evento atualizado com sucesso, ID:', id_evento);
      } else {
          console.log('Nenhum evento encontrado com o ID fornecido:', id_evento);
      }
  } catch (err) {
      console.error('Erro ao atualizar evento:', err.message);
  } finally {
      await connection.end();
  }
};

const deletarEvento = async (id_evento) => {
  const connection = await createConnection();

  if (!id_evento) {
      console.log('ID do evento é obrigatório');
      return;
  }

  try {
      const [result] = await connection.query(
          'DELETE FROM evento WHERE id_evento = ?',
          [id_evento]
      );

      if (result.affectedRows > 0) {
          console.log('Evento deletado com sucesso, ID:', id_evento);
      } else {
          console.log('Nenhum evento encontrado com o ID fornecido:', id_evento);
      }
  } catch (err) {
      console.error('Erro ao deletar evento:', err.message);
  } finally {
      await connection.end();
  }
};
  
const lerEventos = async (id_user) => {
    const connection = await createConnection();

    if (!id_user) {
        console.log('ID do usuário é obrigatório');
        return;
    }

    try {
        const [rows] = await connection.query(
            'SELECT * FROM evento WHERE id_user = ?',
            [id_user]
        );

        if (rows.length > 0) {
            console.log('Eventos encontrados:', rows);
        } else {
            console.log('Nenhum evento encontrado para o ID do usuário:', id_user);
        }
    } catch (err) {
        console.error('Erro ao ler eventos:', err.message);
    } finally {
        await connection.end();
    }
};

/*
lerEventos(6); 

registrarEvento(
    'Aniversário Luisa',        // título
    '2025-02-14',             // data
    'tarde',                  // turno
    'nao',            // disponibilidade
    6                          // id_user
  );
 
atualizarEvento(
    5,                  // id
    'Aniversário Luisa',        // título
    '2025-02-15',             // data
    'tarde',                  // turno
    'nao',            // disponibilidade
);  

deletarEvento(6); // id*/
