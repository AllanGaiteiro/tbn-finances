

export class TransacaoParaCSV {
    constructor(tipoTransacao = null) {
        this['Entrada Ou Saida'] = tipoTransacao;
        this['Data'] = null; // Data de transação (null se não foi paga)
        this['Vencimento em'] = new Date(); // Data esperada de recebimento ou pagamento
        this['Valor'] = 0; // Quantia
        this['Parcelas'] = null; // 1/7
        this['Descricao'] = ''; // Descrição ou nome do destinatário (pessoa ou empresa)
        this['Status'] = 'pendente';
    }
}
