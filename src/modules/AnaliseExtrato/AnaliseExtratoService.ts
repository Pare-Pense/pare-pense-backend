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

        for (const transfer of dados.getBankTransferList() ?? []) {
            const valor = Number(transfer.TRNAMT);
            // ignorar receitas por enquanto
            if (valor >= 0) continue;
            arr.push({
                valor: -valor,
                // data vem no formato yyyy-mm-dd
                data: new Date(transfer.DTPOSTED),
                id: transfer.FITID,
                extra: `${transfer.MEMO ?? ''} ${transfer.NAME ?? ''}`.trim(),
            });
        }

        return arr;
    }
}

export const analiseExtratoService = new AnaliseExtratoService();
