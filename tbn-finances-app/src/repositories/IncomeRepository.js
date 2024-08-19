// Importe os módulos necessários do Firebase
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';
import { TypeOptionEntity } from '../entity/TypeOptionEntity';

class IncomeRepository {
    constructor(account) {
        this.account = account;
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
        this.docRef = (id) => doc(firestore, `accounts/${this.account}/transactions`, id);
    }

    // Adicionar um novo income
    async addIncome(income) {
        try {
            const incomeData = { ...income, type: TypeOptionEntity.fromFirebase(income.type).toFirestore() }
            const docRef = await addDoc(this.collectionRef, incomeData);
            console.log("Income successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding income: ");
        }
    }

    // Atualizar um income existente
    async updateIncome(income) {
        try {
            await updateDoc(this.docRef(income.id), income);
            console.log("Income successfully updated - ", income.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating income: " + income.id + " - ");
        }
    }

    async cancelIncome(income) {
        try {
            const cancelIncome = {...income}
            cancelIncome.status = 'cancelado';
            cancelIncome.TransactionDate = null;
            cancelIncome.dueDate = null;
            cancelIncome.type = TypeOptionEntity.fromFirebase(income.type).toFirestore()
            console.log(cancelIncome)
            const incomeRef = doc(this.collectionRef, cancelIncome.id);
            await updateDoc(incomeRef, cancelIncome);
            console.log("Income successfully canceled - ", cancelIncome.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error canceled income: " + income.id + " - ");

        }
    }

    // Deletar um income
    async deleteIncome(incomeId) {
        try {
            await deleteDoc(doc(this.collectionRef, incomeId));
            console.log("Income successfully deleted");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error deleting income: ");
        }
    }

}

// Exporta uma instância do repositório para ser utilizada no aplicativo
export const incomeRepository = (account) => {
    if (!account) {
        throw new Error('IncomeRepository - account must be provided');
    }
    return new IncomeRepository(account);
};
