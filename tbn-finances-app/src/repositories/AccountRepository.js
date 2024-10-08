import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot, limit, getDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig'; // Importe sua configuração do Firebase aqui
import { AccountEntity } from '../entity/AccountEntity';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';

export class AccountRepository {
    constructor() {
        this.collectionRef = collection(firestore, 'accounts');
        this.docRef = (id) => doc(firestore, `accounts`, id);

    }

    observeAccountById(id, setAccount, setLoading) {
        const unsubscribe = onSnapshot(this.docRef(id), (snapshot) => {
            const account = AccountEntity.fromFirebase({ ...snapshot.data(), id: snapshot.id }) || [];
            setAccount(account);
            setLoading(false);
        });
        return unsubscribe;
    }

    async getAccountById(id) {
        const snapshot = await getDoc(this.docRef(id));
        const account = AccountEntity.fromFirebase({ ...snapshot.data(), id: snapshot.id }) || [];
        return account;
    }


    getAccountsByUserId(user, setAccounts, setLoading) {
        const q = query(this.collectionRef, where('members', 'array-contains', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const accounts = snapshot.docs.map(doc => AccountEntity.fromFirebase({ ...doc.data(), id: doc.id })) || [];
            setLoading(false);
            setAccounts(accounts);
        });

        return unsubscribe;
    }
    observeAccountsByUserIdAndSelected(user, setAccount, setLoading) {
        const q = query(this.collectionRef, where('members', 'array-contains', user.uid), where('isSelected', '==', true), limit(1));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.docs.length) {
                const [doc] = snapshot.docs;

                console.log('Conta Selected', doc.id)
                const account = AccountEntity.fromFirebase({ id: doc.id, ...doc.data() });
                setAccount(account);

            } else {
                setAccount(null);
            }

            setLoading(false);

        });

        return unsubscribe;
    }

    async addAccount(account) {
        try {
            const docRef = await addDoc(this.collectionRef, account);
            console.log("Conta adicionado com sucesso com ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar conta: " + account.id + " - ");
        }
    }

    async updateAccount(account) {
        try {
            const accountRef = doc(this.collectionRef, account.id);
            await updateDoc(accountRef, account);
            console.log("Conta atualizado com sucesso - ", account.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao atualizar conta: " + account.id + " - ");
        }
    }

    async deleteAccount(accountId) {
        try {
            await deleteDoc(doc(this.collectionRef, accountId));
            console.log("Conta excluído com sucesso");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao excluir conta: ");
        }
    }
}

export const accountRepository = new AccountRepository();

