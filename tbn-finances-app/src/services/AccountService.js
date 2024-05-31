
import { Alert } from 'react-native';
import { accountRepository } from '../repositories/AccountRepository';
class AccountService {
    constructor() {
        this.repository = accountRepository;
    }
    async addAccount(account) {
        try {
            await this.repository.addAccount(account);
            // Exibir mensagem de sucesso para o usuário
            Alert.alert('Conta adicionado com sucesso!');
        } catch (error) {
            // Exibir alerta para o usuário em caso de erro
            Alert.alert('Erro ao adicionar conta: ' + error);
        }
    }

    async updateAccount(account) {
        try {
            await this.repository.updateAccount(account);
            // Exibir mensagem de sucesso para o usuário
            Alert.alert('Conta atualizado com sucesso!');
        } catch (error) {
            // Exibir alerta para o usuário em caso de erro
            Alert.alert('Erro ao atualizar conta: ' + error);
        }
    }

    async deleteAccount(accountId) {
        try {
            await this.repository.deleteAccount(accountId);
            // Exibir mensagem de sucesso para o usuário
            Alert.alert('Conta excluído com sucesso!');
        } catch (error) {
            // Exibir alerta para o usuário em caso de erro
            Alert.alert('Erro ao excluir conta: ' + error);
        }
    }

    getAccountsByUserId(user, setAccount, setLoading) {
        return this.repository.getAccountsByUserId(user, setAccount, setLoading)
    }
    observeAccountsByUserIdAndSelected(user, setAccount, setLoading) {
        return this.repository.observeAccountsByUserIdAndSelected(user, setAccount, setLoading)
    }
}

export const accountService = new AccountService();
