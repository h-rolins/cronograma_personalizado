const { subDays, format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
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
        const tarefaData = new Date(tarefa.data);

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

        const conteudos = tarefa.conteudo.split(',').map(c => c.trim());
        const cronograma = [];

        console.log(`Conteúdos a alocar: ${conteudos.join(', ')}`);

        const encontrarTurnosLivres = () => {
            const turnosLivres = [];
            let i = 0;

            while (i < 7 && turnosLivres.length < conteudos.length) {
                const diaAnterior = subDays(tarefaData, i);

                const diaSemana = format(diaAnterior, 'eeee', { locale: ptBR }).toLowerCase();

                const diaString = format(diaAnterior, 'yyyy-MM-dd');

                const turnosLivresDoDia = disponibilidade.filter(d => d.dia === diaSemana);
                for (const turnoLivre of turnosLivresDoDia) {
                    if (!diasIndisponiveis.some(e => e.dia === diaString && e.turno === turnoLivre.turno)) {
                        turnosLivres.push({ dia: diaString, turno: turnoLivre.turno });
                    }
                }
                i++;
            }
            return turnosLivres;
        };

        const turnosLivres = encontrarTurnosLivres();
        console.log('Turnos livres encontrados para alocação:', turnosLivres);

        let conteudosAlocados = 0;
        for (let i = 0; i < turnosLivres.length && conteudosAlocados < conteudos.length; i++) {
            const turnoLivre = turnosLivres[i];
            const conteudoAtual = conteudos[conteudosAlocados];

            cronograma.push({
                conteudo: conteudoAtual,
                dia: turnoLivre.dia,
                turno: turnoLivre.turno
            });

            // Salvar no banco de dados
            await connection.query(
                'INSERT INTO cronograma (turno, data, conteudo, id_user) VALUES (?, ?, ?, ?)',
                [turnoLivre.turno, turnoLivre.dia, conteudoAtual, id_user]
            );

            console.log(`Alocado: ${conteudoAtual} no dia ${turnoLivre.dia}, turno ${turnoLivre.turno}`);
            conteudosAlocados++;
        }

        if (cronograma.length === conteudos.length) {
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
