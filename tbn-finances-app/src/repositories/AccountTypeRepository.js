import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot, limit, getDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig'; // Importe sua configuração do Firebase aqui
import { AccountTypeEntity } from "../entity/AccountTypeEntity";
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';

export class AccountTypeRepository {
    constructor() {
        this.collectionRef = collection(firestore, 'accountsType');
        this.docRef = (id) => doc(firestore, `accountsType`, id);

    }

    observeAccountType(setAccountType, setLoading) {
        const unsubscribe = onSnapshot(this.collectionRef, (snapshot) => {
            const account = snapshot.docs.map(doc => AccountTypeEntity.fromFirebase({ ...doc.data(), id: doc.id })) || [];
            setAccountType(account);
            setLoading(false);
        });
        return unsubscribe;
    }

    async getAccountType() {
        const snapshot = await getDoc(this.collectionRef);
        const account = snapshot.docs.map(doc => AccountTypeEntity.fromFirebase({ ...doc.data(), id: doc.id })) || [];
        return account;
    }

    async addAccountType(accountType) {
        try {
            const docRef = await addDoc(this.collectionRef, accountType);
            console.log("tipo de Conta adicionado com sucesso com ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar tipo de conta: " + accountType.id + " - ");
        }
    }

    async updateAccountType(accountType) {
        try {
            const accountRef = doc(this.collectionRef, accountType.id);
            await updateDoc(accountRef, accountType);
            console.log("tipo de Conta atualizado com sucesso - ", accountType.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar tipo de conta: " + accountType.id + " - ");
        }
    }

    async deleteAccountType(accountTypeId) {
        try {
            await deleteDoc(doc(this.collectionRef, accountTypeId));
            console.log("tipo de Conta excluído com sucesso");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao excluir tipo de conta: ");
        }
    }
}

export const accountTypeRepository = new AccountTypeRepository();

