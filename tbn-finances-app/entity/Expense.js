export class Expense {
    constructor() {
        this.id = null;
        this.type = 'unica'; // "Mensal", "Parcela", "Única"
        this.status = 'pendente'; // "pendente", "paga", "atrasada"
        this.amount = 0; // Quantia da despesa
        this.paymentDate = null; // Data que a despesa foi paga (null se não foi paga)
        this.dueDate = new Date(); // Data de vencimento da despesa
        this.description = ''; // Descrição ou nome do destinatário (pessoa ou empresa)
        this.totalInstallments = 1; // Total de parcelas (para "Parcela")
        this.currentInstallment = 0; // Número da parcela atual (para "Parcela")
        this.creationDate = new Date(); // Data de criação do registro da despesa
    }

    static fromFirebase(data) {
        const expense = new Expense();
        // Atribuir valores a partir de `data`, incluindo a conversão de datas
        expense.id = data.id;
        expense.type = data.type;
        expense.status = data.status;
        expense.amount = data.amount;
        expense.paymentDate = data.paymentDate?.toDate() || null;
        expense.dueDate = data.dueDate?.toDate();
        expense.description = data.description;
        expense.totalInstallments = data.totalInstallments || null;
        expense.currentInstallment = data.currentInstallment || null;
        expense.creationDate = data.creationDate?.toDate();
        return expense;
    }

    toFirestore() {
        return {
            type: this.type,
            status: this.status,
            amount: this.amount,
            paymentDate: this.paymentDate,
            dueDate: this.dueDate,
            description: this.description,
            isRecurrent: this.isRecurrent,
            totalInstallments: this.totalInstallments,
            currentInstallment: this.currentInstallment,
            creationDate: this.creationDate,
        };
    }

    // Métodos adicionais conforme necessário, como validação ou ajustes específicos
}


