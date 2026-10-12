import { Ofx } from 'ofx-data-extractor';

export interface DespesaExtraida {
    valor: number;
    data: Date;
    id: string | undefined;
    extra: string | undefined;
}

class AnaliseExtratoService {
    processarOFX(raw: string): DespesaExtraida[] {
        const dados = new Ofx(raw);

        const arr: DespesaExtraida[] = [];

        const transfers = dados.toNormalized({
            dateMode: 'date',
        }).transactions;

        for (const transfer of transfers) {
            // ignorar receitas por enquanto
            if (transfer.direction !== 'debit') continue;
            arr.push({
                valor: transfer.amountAbs as number,
                data: transfer.postedAt as Date,
                id: transfer.fitId,
                extra: transfer.description.trim(),
            });
        }

        return arr;
    }
}

export const analiseExtratoService = new AnaliseExtratoService();
