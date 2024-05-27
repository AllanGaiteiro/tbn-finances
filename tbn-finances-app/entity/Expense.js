import { TransactionEntity } from "./TransactionEntity";

export class Expense extends TransactionEntity {
    constructor() {
        super('expense');
        this.type = 'unica'; // "Mensal", "Parcela", "Única"
        this.status = 'pendente';
    }
}
