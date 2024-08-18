export class AccountEntity {
    constructor(type = 'organization') {
        this.id = null;
        this.type = type; // 'organization' ou 'event'
        this.cnpj = '';
        this.name = '';
        this.description = '';
        this.adminId = ''; // ID do usuário que é administrador do conta
        this.members = []; // Array de IDs de membros do conta
        this.creationDate = new Date();
        this.lastUpdateDate = new Date();
        this.isSelected = false;
        this.incomesTypeIds = [];
    }

    static fromFirebase(data) {
        const account = new AccountEntity(data.type);
        account.id = data.id;
        account.cnpj = data.cnpj;
        account.name = data.name;
        account.description = data.description;
        account.adminId = data.adminId;
        account.members = data.members || [];
        account.creationDate = data.creationDate?.toDate();
        account.lastUpdateDate = data.lastUpdateDate?.toDate();
        account.isSelected = data.isSelected;
        account.incomesTypeIds = data.incomesTypeIds;
        return account;
    }

    toFirestore() {
        return {
            id: this.id,
            type: this.type,
            cnpj: this.cnpj,
            name: this.name,
            description: this.description,
            adminId: this.adminId,
            members: this.members,
            creationDate: this.creationDate,
            lastUpdateDate: this.lastUpdateDate,
            isSelected: this.isSelected,
            incomesTypeIds: this.incomesTypeIds,
        };
    }

    static publicCNPJWSForAccountEntity(accountData, res) {
        return {
            ...accountData,
            name: res['razao_social'],
            description: res['estabelecimento']['atividade_principal']['descricao'],
            adrees: {
                logradouro: res['estabelecimento']['logradouro'],
                numero: res['estabelecimento']['numero'],
                complemento: res['estabelecimento']['complemento'],
                bairro: res['estabelecimento']['bairro'],
                cep: res['estabelecimento']['cep'],
            }

        }
    }
}
