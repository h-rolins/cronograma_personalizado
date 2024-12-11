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