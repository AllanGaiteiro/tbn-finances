import { userRepository } from '../repositories/UserRepository';

export class UserService {
    repository = userRepository;
     addUser(user) {
        try {
            return this.repository.addUser(user);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao adicionar usuário: ' + error);
            throw error;
        }
    }

    updateUser(user) {
        try {
            return this.repository.updateUser(user);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao atualizar usuário: ' + error);
            throw error;
        }
    }

    updateUserEmail(userId, newEmail) {
        try {
            return this.repository.updateUserEmail(userId, newEmail);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao atualizar o email do usuário: ' + error);
            throw error;
        }
    }
    updateDisplayName(userId, newDisplayName) {
        try {
            return this.repository.updateDisplayName(userId, newDisplayName);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao atualizar o email do usuário: ' + error);
            throw error;
        }
    }
    updateDisplayName(userId, newDisplayName) {
        try {
            return this.repository.updateDisplayName(userId, newDisplayName);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao atualizar o email do usuário: ' + error);
            throw error;
        }
    }

    updateAccountSelected(userId, newAccountSelected) {
        try {
            return this.repository.updateAccountSelected(userId, newAccountSelected);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao atualizar o conta selecionado do usuário: ' + error);
            throw error;
        }
    }

    deleteUser(userId) {
        try {
            return this.repository.deleteUser(userId);
        } catch (error) {
            // Exibir alerta para o usuário
            alert('Erro ao excluir usuário: ' + error);
            throw error;
        }
    }

}

export const userService = new UserService();
