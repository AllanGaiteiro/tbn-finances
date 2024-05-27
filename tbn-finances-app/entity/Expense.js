import { TransactionEntity } from "./TransactionEntity";

export class Expense extends TransactionEntity {
    constructor() {
        super('expense');
        this.categoryExpense = 'unica'; // "Mensal", "Parcela", "Única"
        this.status = 'pendente';
    }
}
