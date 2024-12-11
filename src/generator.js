const createConnection = require('C:/xampp/htdocs/cronograma_personalizado/connection.js');

const gerarCronograma = async (id_user, id_tarefa) => {
    const connection = await createConnection();

    try {
        // Buscar tarefa
        const [tarefas] = await connection.query(
            'SELECT data, conteudo FROM tarefa WHERE id_tarefa = ? AND id_user = ?',
            [id_tarefa, id_user]
        );

        if (tarefas.length === 0) {
            console.log('Tarefa não encontrada para o usuário.');
            return;
        }

        const tarefa = tarefas[0];

        // Buscar disponibilidade do usuário
        const [disponibilidade] = await connection.query(
            'SELECT dia, turno FROM disponibilidade WHERE id_user = ? AND disponibilidade = ?',
            [id_user, 'livre']
        );

        if (disponibilidade.length === 0) {
            console.log('Nenhuma disponibilidade encontrada para o usuário.');
            return;
        }

        // Buscar eventos que possam impactar na disponibilidade
        const [eventos] = await connection.query(
            'SELECT data, turno FROM evento WHERE id_user = ? AND disponibilidade = ?',
            [id_user, 'não']
        );

        const diasIndisponiveis = eventos.map(evento => ({ dia: evento.data, turno: evento.turno }));

        // Montar o cronograma com base na tarefa
        const { data, conteudo } = tarefa;
        const tarefaData = new Date(data);
        const conteudos = conteudo.split(',').map(c => c.trim());
        const cronograma = [];

        // Iterar pelos dias anteriores para alocar conteúdos
        for (let i = 1; i <= 7 && conteudos.length > 0; i++) {
            const diaAnterior = new Date(tarefaData);
            diaAnterior.setDate(tarefaData.getDate() - i);
            const diaSemana = diaAnterior.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
            const diaString = diaAnterior.toISOString().split('T')[0];

            // Iterar pelos turnos livres e alocar conteúdos disponíveis
            for (const d of disponibilidade) {
                if (
                    d.dia === diaSemana &&
                    !diasIndisponiveis.some(e => e.dia === diaString && e.turno === d.turno) &&
                    conteudos.length > 0
                ) {
                    cronograma.push({
                        conteudo: conteudos.shift(),
                        dia: diaString,
                        turno: d.turno
                    });

                    if (conteudos.length === 0) break; // Todos os conteúdos foram alocados
                }
            }
        }

        if (cronograma.length > 0) {
            console.log('Cronograma gerado:', cronograma);
        } else {
            console.log('Não foi possível gerar um cronograma com base nas restrições.');
        }

    } catch (err) {
        console.error('Erro ao gerar cronograma:', err.message);
    } finally {
        await connection.end();
    }
};

// Exemplo de chamada
gerarCronograma(1, 7);
