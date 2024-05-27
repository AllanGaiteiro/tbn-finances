import { TransactionEntity } from "./TransactionEntity";

export class Income extends TransactionEntity {
    constructor() {
        super('income');
        this.categoryIncome = 'oferta_alcada'; // // Tipo de renda: oferta_alcada e oferta_voluntaria
        this.status = 'recebido';
    }
}
