export class AccountEntity {
    constructor(type = 'organization') {
        this.id = null;
        this.type = type; // 'organization' ou 'event'
        this.name = '';
        this.description = '';
        this.adminId = ''; // ID do usuário que é administrador do conta
        this.members = []; // Array de IDs de membros do conta
        this.creationDate = new Date();
        this.lastUpdateDate = new Date();
        this.isSelected = false;
    }

    static fromFirebase(data) {
        const account = new AccountEntity(data.type);
        account.id = data.id;
        account.name = data.name;
        account.description = data.description;
        account.adminId = data.adminId;
        account.members = data.members || [];
        account.creationDate = data.creationDate?.toDate();
        account.lastUpdateDate = data.lastUpdateDate?.toDate();
        account.isSelected = data.isSelected;
        return account;
    }

    toFirestore() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            adminId: this.adminId,
            members: this.members,
            creationDate: this.creationDate,
            lastUpdateDate: this.lastUpdateDate,
            isSelected: this.isSelected,
        };
    }
}
