import type { DespesaRecorrente } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { CategoriaService } from '../Categoria/CategoriaService.js';
import type {
    AtualizaDespesaRecorrenteSchema,
    DespesaRecorrenteSchema,
} from './DespesaRecorrenteSchema.js';

const LIMITE_ITERACOES_BUSCA = 1000;

type ConfigRecorrencia = Pick<
    DespesaRecorrente,
    'frequencia' | 'diaSemana' | 'diaMes' | 'mes' | 'dataInicio'
>;

function inicioDoDia(data: Date) {
    return new Date(
        Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()),
    );
}

function diasNoMes(ano: number, mesIndiceZero: number) {
    return new Date(Date.UTC(ano, mesIndiceZero + 1, 0)).getUTCDate();
}

export function proximaOcorrencia(
    config: ConfigRecorrencia,
    ultimaGerada: Date | null,
) {
    const referencia = ultimaGerada
        ? new Date(ultimaGerada.getTime() + 24 * 60 * 60 * 1000)
        : config.dataInicio;

    const baseDia = inicioDoDia(
        referencia < config.dataInicio ? config.dataInicio : referencia,
    );

    if (config.frequencia === 'SEMANAL') {
        const diff = (config.diaSemana! - baseDia.getUTCDay() + 7) % 7;

        const resultado = new Date(baseDia);
        resultado.setUTCDate(resultado.getUTCDate() + diff);

        return resultado;
    }

    if (config.frequencia === 'MENSAL') {
        let ano = baseDia.getUTCFullYear();
        let mes = baseDia.getUTCMonth();

        for (let i = 0; i < LIMITE_ITERACOES_BUSCA; i++) {
            const dia = Math.min(config.diaMes!, diasNoMes(ano, mes));
            const candidato = new Date(Date.UTC(ano, mes, dia));

            if (candidato >= baseDia) {
                return candidato;
            }

            mes += 1;
            if (mes > 11) {
                mes = 0;
                ano += 1;
            }
        }
    } else {
        let ano = baseDia.getUTCFullYear();
        const mesIndiceZero = config.mes! - 1;

        for (let i = 0; i < LIMITE_ITERACOES_BUSCA; i++) {
            const dia = Math.min(config.diaMes!, diasNoMes(ano, mesIndiceZero));
            const candidato = new Date(Date.UTC(ano, mesIndiceZero, dia));

            if (candidato >= baseDia) {
                return candidato;
            }

            ano += 1;
        }
    }

    throw new Error(
        'Não foi possível calcular a próxima ocorrência da recorrência',
    );
}

export class DespesaRecorrenteService {
    constructor(
        private db = prisma,
        private categoriaService = new CategoriaService(db),
    ) {}

    private formataDespesaRecorrente(recorrente: DespesaRecorrente) {
        return {
            ...recorrente,
            valor: recorrente.valor.toNumber(),
        };
    }

    async recuperarDespesaRecorrente(idUsuario: string, id: string) {
        const recorrente = await this.db.despesaRecorrente.findUnique({
            where: { id },
        });

        if (!recorrente) {
            throw new Error('Despesa recorrente não existe');
        }

        if (recorrente.idUsuario !== idUsuario) {
            throw new Error('Despesa recorrente não pertence a esse usuário');
        }

        return recorrente;
    }

    async listarDespesasRecorrentes(idUsuario: string) {
        const recorrentes = await this.db.despesaRecorrente.findMany({
            where: { idUsuario },
            orderBy: { createdAt: 'asc' },
        });

        return recorrentes.map((r) => this.formataDespesaRecorrente(r));
    }

    async cadastrarDespesaRecorrente(data: DespesaRecorrenteSchema) {
        await this.categoriaService.recuperarCategoriaAcessivel(
            data.idUsuario,
            data.idCategoria,
        );

        const recorrente = await this.db.despesaRecorrente.create({
            data: {
                nome: data.nome,
                idCategoria: data.idCategoria,
                valor: data.valor,
                idUsuario: data.idUsuario,
                frequencia: data.frequencia,
                diaSemana: data.diaSemana ?? null,
                diaMes: data.diaMes ?? null,
                mes: data.mes ?? null,
                dataInicio: data.dataInicio,
                dataFim: data.dataFim ?? null,
            },
        });

        await this.gerarPendentesParaRecorrencia(recorrente);

        return this.formataDespesaRecorrente(recorrente);
    }

    async atualizarDespesaRecorrente(
        idUsuario: string,
        id: string,
        data: AtualizaDespesaRecorrenteSchema,
    ) {
        await this.recuperarDespesaRecorrente(idUsuario, id);

        if (data.idCategoria) {
            await this.categoriaService.recuperarCategoriaAcessivel(
                idUsuario,
                data.idCategoria,
            );
        }

        const recorrente = await this.db.despesaRecorrente.update({
            where: { id },
            data: {
                ...(data.nome !== undefined && { nome: data.nome }),
                ...(data.idCategoria !== undefined && {
                    idCategoria: data.idCategoria,
                }),
                ...(data.valor !== undefined && { valor: data.valor }),
                ...(data.frequencia !== undefined && {
                    frequencia: data.frequencia,
                }),
                ...(data.diaSemana !== undefined && {
                    diaSemana: data.diaSemana,
                }),
                ...(data.diaMes !== undefined && { diaMes: data.diaMes }),
                ...(data.mes !== undefined && { mes: data.mes }),
                ...(data.dataInicio !== undefined && {
                    dataInicio: data.dataInicio,
                }),
                ...(data.dataFim !== undefined && { dataFim: data.dataFim }),
            },
        });

        return this.formataDespesaRecorrente(recorrente);
    }

    async pausarDespesaRecorrente(idUsuario: string, id: string) {
        await this.recuperarDespesaRecorrente(idUsuario, id);

        const recorrente = await this.db.despesaRecorrente.update({
            where: { id },
            data: { ativa: false },
        });

        return this.formataDespesaRecorrente(recorrente);
    }

    async reativarDespesaRecorrente(idUsuario: string, id: string) {
        await this.recuperarDespesaRecorrente(idUsuario, id);

        const recorrente = await this.db.despesaRecorrente.update({
            where: { id },
            data: { ativa: true },
        });

        await this.gerarPendentesParaRecorrencia(recorrente);

        return this.formataDespesaRecorrente(recorrente);
    }

    async deletarDespesaRecorrente(idUsuario: string, id: string) {
        await this.recuperarDespesaRecorrente(idUsuario, id);

        await this.db.despesaRecorrente.delete({ where: { id } });

        return { message: 'Despesa recorrente deletada com sucesso' };
    }

    private async gerarPendentesParaRecorrencia(recorrente: DespesaRecorrente) {
        if (!recorrente.ativa) {
            return;
        }

        const hoje = inicioDoDia(new Date());

        if (recorrente.dataInicio > hoje) {
            return;
        }

        const ultimaDespesa = await this.db.despesa.findFirst({
            where: { idDespesaRecorrente: recorrente.id },
            orderBy: { data: 'desc' },
        });

        const ocorrencias: Date[] = [];
        let ultimaData = ultimaDespesa?.data ?? null;

        for (let i = 0; i < LIMITE_ITERACOES_BUSCA; i++) {
            const candidata = proximaOcorrencia(recorrente, ultimaData);

            if (candidata > hoje) {
                break;
            }

            if (recorrente.dataFim && candidata > recorrente.dataFim) {
                break;
            }

            ocorrencias.push(candidata);
            ultimaData = candidata;
        }

        if (ocorrencias.length === 0) {
            return;
        }

        await this.db.despesa.createMany({
            data: ocorrencias.map((data) => ({
                nome: recorrente.nome,
                idCategoria: recorrente.idCategoria,
                valor: recorrente.valor,
                idUsuario: recorrente.idUsuario,
                idDespesaRecorrente: recorrente.id,
                data,
            })),
            skipDuplicates: true,
        });
    }

    async gerarDespesasPendentes(idUsuario: string) {
        const hoje = inicioDoDia(new Date());

        const recorrentes = await this.db.despesaRecorrente.findMany({
            where: { idUsuario, ativa: true, dataInicio: { lte: hoje } },
        });

        for (const recorrente of recorrentes) {
            await this.gerarPendentesParaRecorrencia(recorrente);
        }
    }
}

export const despesaRecorrenteService = new DespesaRecorrenteService();
