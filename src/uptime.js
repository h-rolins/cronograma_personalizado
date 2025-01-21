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

const atualizarDisponibilidade = async (id_disp, dia, turno, disponibilidade) => {
    const connection = await createConnection();

    if (!id_disp || !dia || !turno || !disponibilidade) {
        console.log('Todos os campos são obrigatórios');
        return;
    }

    try {
        const [result] = await connection.query(
            'UPDATE disponibilidade SET dia = ?, turno = ?, disponibilidade = ? WHERE id_disp = ?',
            [dia, turno, disponibilidade, id_disp]
        );

        if (result.affectedRows > 0) {
            console.log('Disponibilidade atualizada com sucesso, ID:', id_disp);
        } else {
            console.log('Nenhuma disponibilidade encontrada com o ID fornecido:', id_disp);
        }
    } catch (err) {
        console.error('Erro ao atualizar disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

const deletarDisponibilidade = async (id_disp) => {
    const connection = await createConnection();

    if (!id_disp) {
        console.log('ID é obrigatório');
        return;
    }

    try {
        const [result] = await connection.query(
            'DELETE FROM disponibilidade WHERE id_disp = ?',
            [id_disp]
        );

        if (result.affectedRows > 0) {
            console.log('Disponibilidade deletada com sucesso, ID:', id_disp);
        } else {
            console.log('Nenhuma disponibilidade encontrada com o ID fornecido:', id_disp);
        }
    } catch (err) {
        console.error('Erro ao deletar disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

const lerDisponibilidade = async (id_user) => {
    const connection = await createConnection();

    if (!id_user) {
        console.log('ID do usuário é obrigatório');
        return;
    }

    try {
        const [rows] = await connection.query(
            'SELECT * FROM disponibilidade WHERE id_user = ?',
            [id_user]
        );

        if (rows.length > 0) {
            console.log('Disponibilidades encontradas:', rows);
        } else {
            console.log('Nenhuma disponibilidade encontrada para o ID do usuário:', id_user);
        }
    } catch (err) {
        console.error('Erro ao ler disponibilidade:', err.message);
    } finally {
        await connection.end();
    }
};

/*lerDisponibilidade(7); 

salvarDisponibilidade(
    'terça-feira',         // dia
    'tarde',           // turno
    'livre',         // disponibilidade
    7                  // id_user
);

salvarDisponibilidade(
    'quarta-feira',         // dia
    'tarde',           // turno
    'livre',         // disponibilidade
    7                  // id_user
);

salvarDisponibilidade(
    'quinta-feira',         // dia
    'tarde',           // turno
    'livre',         // disponibilidade
    7                  // id_user
);

salvarDisponibilidade(
    'sabado',         // dia
    'tarde',           // turno
    'livre',         // disponibilidade
    7                  // id_user
);

atualizarDisponibilidade(
    17,                  // id
    'segunda-feira',    // dia
    'tarde',            // turno
    'livre'             // disponibilidade
);

deletarDisponibilidade(9); // id*/
