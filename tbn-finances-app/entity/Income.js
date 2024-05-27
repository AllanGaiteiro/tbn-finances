import { TransactionEntity } from "./TransactionEntity";

export class Income extends TransactionEntity {
    constructor() {
        super('income');
        this.type = 'oferta_alcada'; // // Tipo de renda: oferta_alcada e oferta_voluntaria
        this.status = 'recebido';
        this.transactionDate = new Date();
    }
}
