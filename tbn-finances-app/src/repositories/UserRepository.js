import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig'; // Importe sua configuração do Firebase aqui
import { FirebaseErrorInterceptor, FirebaseErrorUtil } from '../utils/FirebaseErrorUtil';

export class UserRepository {
    constructor() {
        this.collectionRef = collection(firestore, 'users');
    }

    async addUser(user) {
        try {
            const docRef = await addDoc(this.collectionRef, user);
            console.log("Usuário adicionado com sucesso com ID: ", docRef.id);
            return docRef.id;
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao adicionar usuário: ");
        }
    }

    async updateUser(user) {
        try {
            const userRef = doc(this.collectionRef, user.uid);
            await updateDoc(userRef, user);
            console.log("Usuário atualizado com sucesso - ", user.uid);
        } catch (error) {
            console.error("Erro ao atualizar usuário: ", user.uid, " - ", error);
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar usuário: " + user.uid + " - ");
        }
    }

    async updateUserEmail(userId, newEmail) {
        try {
            const userRef = doc(this.collectionRef, userId);
            await updateDoc(userRef, { email: newEmail });
            console.log("Email do usuário atualizado com sucesso - ", userId);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar o email do usuário: " + userId + " - ");
        }
    }
    async updateDisplayName(userId, displayName) {
        try {
            const userRef = doc(this.collectionRef, userId);
            await updateDoc(userRef, { displayName: displayName });
            console.log("Nome do usuário atualizado com sucesso - ", userId);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar o email do usuário: " + userId + " - ");
        }
    }
    async updateAccountSelected(userId, accountSelected) {
        try {
            const userRef = doc(this.collectionRef, userId);
            await updateDoc(userRef, { accountSelected: accountSelected });
            console.log("Conta selecionado atualizado com sucesso - ", userId);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar o conta selectiondo do usuário: " + userId + " - ");
        }
    }

    async deleteUser(userId) {
        try {
            await deleteDoc(doc(this.collectionRef, userId));
            console.log("Usuário excluído com sucesso");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao excluir usuário:");
        }
    }

    async getUserById(userId) {
        try {
            const userDoc = await getDoc(doc(this.collectionRef, userId));
            if (userDoc.exists()) {
                return { uid: userDoc.id, ...userDoc.data() };
            } else {
                console.log("Não existe usuário com o ID fornecido");
                return null;
            }
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao obter usuário por ID:");
        }
    }

    async getUsersByUids(uids) {
        try {
            const userDocs = await Promise.all(uids.map(uid => getDoc(doc(this.collectionRef, uid))));
            return userDocs.filter(doc => doc.exists()).map(doc => ({ uid: doc.id, ...doc.data() }));
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao obter usuários por IDs:");
        }
    }

    observeUserByUid(uid, callback) {
        try {
            const userRef = doc(this.collectionRef, uid);
            const unsubscribe = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    const userData = { uid: doc.id, ...doc.data() };
                    callback(userData);
                } else {
                    console.log("Não existe usuário com o UID fornecido");
                    callback(null);
                }
            });
            return unsubscribe;
        } catch (error) {
            console.error("Erro ao observar usuário por UID:", uid, "-", error);
            throw FirebaseErrorInterceptor.handle(error, "Erro ao observar usuário por UID: " + uid + " - ");
        }
    }
}

export const userRepository = new UserRepository();
