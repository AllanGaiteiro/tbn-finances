import { TransactionEntity } from "./TransactionEntity";

export class Expense extends TransactionEntity {
    constructor() {
        super('expense');
        this.type = 'unica'; // "Mensal", "Parcela", "Única"
        this.status = 'pendente';
        this.totalInstallments = 1; // Total de parcelas (para "Parcela")
        this.currentInstallment = 0; // Número da parcela atual (para "Parcela")
    }
}
