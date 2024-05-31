// Importe os módulos necessários do Firebase
import { collection, query, writeBatch, onSnapshot, where, orderBy, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';

class IncomeRepository {
    constructor(account) {
        this.account = account;
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
        this.docRef = (id) => doc(firestore, `accounts/${this.accountId}/transactions`, id);
    }

    // Adicionar um novo income
    async addIncome(income) {
        try {
            const docRef = await addDoc(this.collectionRef, income);
            console.log("Income successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding income: ");            
        }
    }

    // Atualizar um income existente
    async updateIncome(income) {
        try {
            const incomeRef = doc(this.collectionRef, income.id);
            await updateDoc(incomeRef, income);
            console.log("Income successfully updated - ", income.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating income: " + income.id + " - ");            
        }
    }

    async handleRecurrenceUpdate(income) {
        const batch = writeBatch(firestore);

        try {
            // Atualiza a income original se o status é alterado para 'recebido'
            if (income.isRecurrence) {
                const originalIncomeRef = this.docRef(income.id);
                batch.update(originalIncomeRef, {
                    lastRecurrenceDate: new Date(), // Define a data da última recorrência
                    // Mantém o status atual, ou pode definir outro status conforme a necessidade
                });

                // Cria uma nova income baseada na recorrente, com referência à original
                const newIncomeData = {
                    ...income.toFirestore(),
                    recurrenceId: income.id, // Referência à renda recorrente original
                    isRecurrence: false, // A nova renda não é mais uma recorrência
                    dueDate: new Date(),
                    status: 'recebido',
                    category: 'oferta_voluntaria',
                };
                delete newIncomeData.id; // Remove o id para garantir a criação de um novo documento
                batch.set(doc(this.collectionRef), newIncomeData);
            }

            await batch.commit();
            console.log("Recurrence update and new income creation successful.");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error handling recurrence update: ");            
        }
    }
    async cancelIncome(income) {
        try {
            income.status = 'cancelado';
            // income.recurrenceDay = null;
            income.dueDate = null;
            const cancelIncome = income.toFirestore();
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
