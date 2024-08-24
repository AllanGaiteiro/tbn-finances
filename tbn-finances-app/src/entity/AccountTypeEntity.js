export class AccountTypeEntity {
    constructor(value = 'organization', type = { incomeTypes: [], expenseTypes: [] }) {
        this.incomeTypes = type.incomeTypes;
        this.expenseTypes = type.expenseTypes;
        this.value = value; // 'organization' ou 'event'
        this.active = false;
    }

    static fromFirebase(data) {
        const account = new AccountTypeEntity();
        account.incomeTypes = data.incomeTypes;
        account.expenseTypes = data.expenseTypes;
        account.label = data.label;
        account.value = data.value;
        account.active = false;
        account.id = data.id;
        return account;
    }
}
