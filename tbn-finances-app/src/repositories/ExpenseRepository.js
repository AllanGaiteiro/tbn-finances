// Importe os módulos necessários do Firebase
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';

export class ExpenseRepository {
    constructor(account) {
        this.account = account;
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
    }

    async addExpense(expense) {
        try {
            const docRef = await addDoc(this.collectionRef, {
                ...expense,
                transactionDate: expense.transactionDate || new Date(), // Garantindo que a data de pagamento seja definida
                creationDate: new Date() // Data de criação do registro
            });
            console.log("Expense successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding expense: " + expense.id + " - ");
        }
    }

    async updateExpense(expense) {
        try {
            const expenseRef = doc(this.collectionRef, expense.id);
            await updateDoc(expenseRef, expense);
            console.log("Expense successfully updated - ", expense.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating expense: " + expense.id + " - ");
        }
    }

    async deleteExpense(expenseId) {
        try {
            await deleteDoc(doc(this.collectionRef, expenseId));
            console.log("Expense successfully deleted");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error deleting expense: " + account.id + " - ");
        }
    }
}

export const expenseRepository = (account) => {
    if (!account) {
        throw new Error('ExpenseRepository - account must be provided');
    }
    return new ExpenseRepository(account);
};

