export class TransactionEntity {
    constructor(typeTransaction = null) {
        this.id = null;
        this.typeTransaction = typeTransaction;
        this.categoryExpense = null; // "Mensal", "Parcela", "Única"
        this.categoryIncome = null;// Tipo de renda: oferta_alcada e oferta_voluntaria
        this.status = 'pendente';
        this.amount = 0; // Quantia da despesa
        this.transactionDate = null; // Data que a despesa foi paga (null se não foi paga)
        this.dueDate = new Date(); // Data de vencimento da despesa
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
        expense.categoryExpense = data.typeTransaction === 'expense' ? data.categoryExpense : null;
        expense.categoryIncome = data.typeTransaction === 'income' ? data.categoryIncome : null;
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
            categoryExpense: this.typeTransaction === 'expense' ? this.categoryExpense : null,
            categoryIncome: this.typeTransaction === 'income' ? this.categoryIncome : null,
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


