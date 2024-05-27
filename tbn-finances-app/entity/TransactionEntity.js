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
        this.totalInstallments = 1; // Total de parcelas (para "Parcela")
        this.currentInstallment = 0; // Número da parcela atual (para "Parcela")
        this.creationDate = new Date(); // Data de criação do registro da despesa
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
            lastRecurrenceDate: this.lastRecurrenceDate,
            isRecurrence: this.isRecurrence
        };
    }

    // Métodos adicionais conforme necessário, como validação ou ajustes específicos
}


