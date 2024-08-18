import { TransactionEntity } from "./TransactionEntity";
import { TypeOptionEntity } from "./TypeOptionEntity";


export class IncomeEntity extends TransactionEntity {
    constructor(name) {
        super('income');
        this.description = name;
        this.type = new TypeOptionEntity(); // // Tipo de renda: oferta_alcada e oferta_voluntaria
        this.status = 'recebido';
        this.transactionDate = new Date();
    }
}
