import { TransacaoParaCSV } from "./TransacaoParaCSV";

export class TransactionEntity {
    constructor(typeTransaction = null) {
        this.id = null;
        this.typeTransaction = typeTransaction;
        this.type = null;
        this.status = 'pendente';
        this.amount = 0; // Quantia
        this.transactionDate = null; // Data de transação (null se não foi paga)
        this.dueDate = new Date(); // Data esperada de recebimento ou pagamento
        this.description = ''; // Descrição ou nome do destinatário (pessoa ou empresa)
        this.totalInstallments = null; // Total de parcelas (para "Parcela")
        this.currentInstallment = null; // Número da parcela atual (para "Parcela")
        this.creationDate = new Date();
        this.lastUpdateDate = new Date();
        this.isRecurrence = false;

        this.lastRecurrenceDate = null;
    }

    static fromFirebase(data) {
        const expense = new TransactionEntity(data.typeTransaction);
        // Atribuir valores a partir de `data`, incluindo a conversão de datas
        expense.id = data.id;
        expense.typeTransaction = data.typeTransaction;
        expense.type = data.type || null;
        expense.status = data.status;
        expense.amount = data.amount;
        expense.transactionDate = data.transactionDate?.toDate() || null;
        expense.dueDate = data.dueDate?.toDate();
        expense.description = data.description;
        expense.totalInstallments = data.totalInstallments || null;
        expense.currentInstallment = data.currentInstallment || null;
        expense.creationDate = data.creationDate?.toDate();
        expense.lastUpdateDate = data.lastUpdateDate?.toDate();
        expense.lastRecurrenceDate = data.lastRecurrenceDate;
        expense.isRecurrence = data.isRecurrence;
        return expense;
    }

    toFirestore() {
        return {
            typeTransaction: this.typeTransaction,
            type: this.type || null,
            status: this.status,
            amount: this.amount,
            transactionDate: this.transactionDate,
            dueDate: this.dueDate,
            description: this.description,
            isRecurrent: this.isRecurrent,
            totalInstallments: this.totalInstallments,
            currentInstallment: this.currentInstallment,
            creationDate: this.creationDate,
            lastUpdateDate: this.lastUpdateDate,
            lastRecurrenceDate: this.lastRecurrenceDate,
            isRecurrence: this.isRecurrence
        };
    }

    convertTransactionLanguageBR() {
        const transacaoConvertida = new TransacaoParaCSV(this.typeTransaction);
        transacaoConvertida['TRANSAÇÃO'] = this.typeTransaction === 'income' ? 'ENTRADA' : 'SAIDA';
        transacaoConvertida['DATA'] = this.formatDate(new Date(this.transactionDate)) || null;
        // transacaoConvertida['Vencimento em'] = this.status !== 'recebido' && this.status !== 'pago' ? this.formatDate(new Date(this.dueDate)) : null
        transacaoConvertida['VALOR'] = (Number(this.amount)?.toFixed(2) + '').replace('.', ',');
        //transacaoConvertida['STATUS'] = this.status;
        //transacaoConvertida['Parcelas'] = this.typeTransaction === 'expense' && this.type === 'parcela' ? `${this.currentInstallment}/${this.totalInstallments}` : null;
        transacaoConvertida['TIPO'] = this.convertToTitleCase(this.type)
        transacaoConvertida['DESCRICAO'] = this.description;

        if (!transacaoConvertida['DATA']) delete transacaoConvertida['Data'];
        //if (!transacaoConvertida['Vencimento em']) delete transacaoConvertida['Vencimento em'];
        //if (!transacaoConvertida['Parcelas']) delete transacaoConvertida['Parcelas'];
        return transacaoConvertida;
    }

    formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    convertToTitleCase(text) {
        return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
}


