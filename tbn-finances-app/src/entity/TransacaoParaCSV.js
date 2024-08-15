

export class TransacaoParaCSV {
    constructor(tipoTransacao = null) {
        this['TRANSAÇÃO'] = tipoTransacao;
        this['VALOR'] = 0; // Quantia
        this['DATA'] = null; // Data de transação (null se não foi paga)
        this['DESCRICAO'] = ''; // Descrição ou nome do destinatário (pessoa ou empresa)
        this['TIPO'] = 'pendente';
        //this['STATUS'] = 'pendente';

    }
}
