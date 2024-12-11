const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js');

const salvarDisponibilidade = async (dia, turno, disponibilidade, id_user) => {
    const connection = await createConnection();

    if (!dia || !turno || !disponibilidade || !id_user) {
        console.log('Todos os campos são obrigatórios');
        return;
    }

    try {
        const [result] = await connection.query(
            'INSERT INTO disponibilidade (dia, turno, disponibilidade, id_user) VALUES (?, ?, ?, ?)',
            [dia, turno, disponibilidade, id_user]
        );

        console.log('Disponibilidade salva com sucesso, ID:', result.insertId);
    } catch (err) {
        console.error('Erro ao salvar disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

const atualizarDisponibilidade = async (id, dia, turno, disponibilidade) => {
    const connection = await createConnection();

    if (!id || !dia || !turno || !disponibilidade) {
        console.log('Todos os campos são obrigatórios');
        return;
    }

    try {
        const [result] = await connection.query(
            'UPDATE disponibilidade SET dia = ?, turno = ?, disponibilidade = ? WHERE id = ?',
            [dia, turno, disponibilidade, id]
        );

        if (result.affectedRows > 0) {
            console.log('Disponibilidade atualizada com sucesso, ID:', id);
        } else {
            console.log('Nenhuma disponibilidade encontrada com o ID fornecido:', id);
        }
    } catch (err) {
        console.error('Erro ao atualizar disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

const deletarDisponibilidade = async (id) => {
    const connection = await createConnection();

    if (!id) {
        console.log('ID é obrigatório');
        return;
    }

    try {
        const [result] = await connection.query(
            'DELETE FROM disponibilidade WHERE id = ?',
            [id]
        );

        if (result.affectedRows > 0) {
            console.log('Disponibilidade deletada com sucesso, ID:', id);
        } else {
            console.log('Nenhuma disponibilidade encontrada com o ID fornecido:', id);
        }
    } catch (err) {
        console.error('Erro ao deletar disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

/*salvarDisponibilidade(
    'segunda',         // dia
    'tarde',           // turno
    'ocupado',         // disponibilidade
    1                  // id_user
);

atualizarDisponibilidade(
    3,                  // id
    'quinta',            // dia
    'manhã',            // turno
    'ocupado'             // disponibilidade
);

deletarDisponibilidade(1); // id*/
