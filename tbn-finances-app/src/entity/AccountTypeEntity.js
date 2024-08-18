export class AccountTypeEntity {
    constructor(value = 'organization', incomeTypes = []) {
        this.incomeTypes = incomeTypes;
        this.value = value; // 'organization' ou 'event'
        this.active = false;
    }

    static fromFirebase(data) {
        const account = new AccountTypeEntity();
        account.incomeTypes = data.incomeTypes;
        account.label = data.label;
        account.value = data.value;
        account.active = false;
        account.id = data.id;
        return account;
    }
}
