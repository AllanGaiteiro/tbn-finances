export class Income {
    constructor() {
        this.id = null;
        this.type = 'oferta_alcada'; // Tipo de renda: oferta_alcada e oferta_voluntaria
        this.amount = 0; // Quantia da renda
        this.donorName = ''; // Nome de quem deu a renda
        this.receivedDate = new Date(); // Data que o valor foi recebido
        this.creationDate = new Date(); // Data de criação do income (não editável)
        this.status = 'recebido'; //'recebido' ,'em_progresso' ,'cancelado' ,'retornado' 
        // this.accountDestination = ''; // Para que conta foi enviado
        this.isRecurrence = false;
        // this.recurrenceDay = 28;
        this.lastRecurrenceDate = null;
    }

    static fromFirebase(data) {
        const income = new Income();
        income.id = data.id;
        income.type = data.type;
        income.amount = data.amount;
        income.donorName = data.donorName || 'Igreja'; // Se não fornecido, assume 'Igreja'
        income.receivedDate = data.receivedDate?.toDate() || null;
        income.creationDate = data.creationDate?.toDate() || new Date();
        income.status = data?.status || 'em_progresso';
        // income.accountDestination = data.accountDestination;
        income.isRecurrence = data.isRecurrence || false;
        // income.recurrenceDay = data.recurrenceDay || null;
        income.lastRecurrenceDate = data.lastRecurrenceDate || null;

        return income;
    }

    toFirestore() {
        return {
            id: this.id,
            type: this.type,
            amount: this.amount,
            donorName: this.donorName || null,
            receivedDate: this.receivedDate || null,
            creationDate: this.creationDate,
            status: this.status,
            // accountDestination: this.accountDestination,
            isRecurrence: this.isRecurrence || false,
            // recurrenceDay: this.isRecurrence ? this.recurrenceDay : null,
            lastRecurrenceDate: this.isRecurrence ? this.lastRecurrenceDate : null,
        };
    }

    static fronFirebase(data) {
        const returnDate = data;

        if (data.receivedDate) {
            returnDate.receivedDate = data.receivedDate?.toDate();
        }
        if (data.creationDate) {
            returnDate.creationDate = data.creationDate?.toDate();
        }
        if (data.lastRecurrenceDate) {
            returnDate.lastRecurrenceDate = data.lastRecurrenceDate?.toDate();
        }
        return returnDate;
    }
    // Métodos adicionais conforme necessário, como validação ou ajustes específicos
    validate() {
        // Método para validar o objeto Income antes de salvá-lo, por exemplo
    }
}