import { notificacaoService } from '../Notificacao/NotificacaoService.js';
import { despesaService } from '../Despesa/DespesaService.js';
import { prisma } from '../../lib/prisma.js';
import 'dotenv/config';
import type { Categoria } from '../../generated/prisma/enums.js';

export class AnaliseGastosService {
    constructor(private db = prisma) {}

    async processarAnalisePosGasto(
        idUsuario: string,
        limiteMensal: number,
        novaDespesa: { id: string; valor: number; categoria: Categoria },
    ) {
        const dataAtual = new Date();
        const FASTAPI_URL =
            process.env.ML_SERVICE_URL || 'http://localhost:8000';
        try {
            const despesasDaCategoria =
                await despesaService.recuperarDespesasAll(
                    idUsuario,
                    undefined,
                    novaDespesa.categoria,
                );

            const history = despesasDaCategoria
                .filter((d) => d.id !== novaDespesa.id)
                .map((d) => d.valor);

            if (history.length > 0) {
                const zScorePayload = {
                    history: history,
                    new_expense: novaDespesa.valor,
                };

                const zScoreRes = await fetch(`${FASTAPI_URL}/zscore`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(zScorePayload),
                });

                if (zScoreRes.ok) {
                    const zScoreDados = await zScoreRes.json();

                    if (zScoreDados.z_score > 2.5) {
                        await notificacaoService.cadastrarNotificacao({
                            idUsuario: idUsuario,
                            titulo: 'Gasto Atípico Detectado',
                            mensagem: `Atenção: O seu novo registro de R$ ${novaDespesa.valor} em ${novaDespesa.categoria} está muito acima da sua média habitual para essa categoria.`,
                        });
                    }
                } else {
                    console.error(
                        `Erro na API de Z-Score: ${zScoreRes.statusText}`,
                    );
                }
            }
        } catch (error) {
            console.error('Erro ao processar a análise de Z-Score:', error);
        }

        try {
            const ano = dataAtual.getFullYear();
            const mes = dataAtual.getMonth();

            const ultimoDiaMes = new Date(ano, mes + 1, 0);

            const todasDespesasMensais =
                await despesaService.recuperarDespesasAll(
                    idUsuario,
                    'mensal',
                    undefined,
                );

            const gastosPorDia = new Map<number, number>();
            let gastoAcumulado = 0;

            for (const desp of todasDespesasMensais) {
                const dataDesp = new Date(desp.data);
                const dia = dataDesp.getDate();
                gastoAcumulado += desp.valor;
                gastosPorDia.set(dia, gastoAcumulado);
            }

            if (gastosPorDia.size < 8) {
                return;
            }

            const train_x: number[][] = [];
            const train_y: number[] = [];

            gastosPorDia.forEach((valorAcumulado, dia) => {
                train_x.push([dia]);
                train_y.push(valorAcumulado);
            });

            const payload = {
                train_x: train_x,
                train_y: train_y,
                salary: [[limiteMensal]],
            };

            const resposta = await fetch(`${FASTAPI_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!resposta.ok) {
                throw new Error(`Erro na API ML: ${resposta.statusText}`);
            }

            const dadosML = await resposta.json();
            const diaDoEstouro = dadosML['Dia do Estouro'][0][0];

            const diaFinal = ultimoDiaMes.getDate();

            if (
                diaDoEstouro <= diaFinal &&
                diaDoEstouro > dataAtual.getDate()
            ) {
                const notificacaoRecente = await this.db.notificacao.findFirst({
                    where: {
                        idUsuario,
                        titulo: 'Alerta de Orçamento',
                        createdAt: {
                            gte: new Date(
                                dataAtual.setDate(dataAtual.getDate() - 2),
                            ),
                        },
                    },
                });

                if (!notificacaoRecente) {
                    await notificacaoService.cadastrarNotificacao({
                        idUsuario: idUsuario,
                        titulo: 'Alerta de Orçamento!',
                        mensagem: `Atenção! No seu ritmo atual de gastos, seu salário vai acabar no dia ${diaDoEstouro}. Considere reduzir as despesas!`,
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao processar análise do modelo:', error);
        }
    }
}

export const analiseGastosService = new AnaliseGastosService();
