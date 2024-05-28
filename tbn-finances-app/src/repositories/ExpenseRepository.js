// Importe os módulos necessários do Firebase
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';

export class ExpenseRepository {
    constructor(userId) {
        this.userId = userId;
        this.collectionRef = collection(firestore, `users/${this.userId}/transactions`);
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
            console.error("Error adding expense: ", error);
        }
    }

    async updateExpense(expense) {
        try {
            const expenseRef = doc(this.collectionRef, expense.id);
            await updateDoc(expenseRef, expense);
            console.log("Expense successfully updated - ", expense.id);
        } catch (error) {
            console.error("Error updating expense: ", expense.id, " - ", error);
        }
    }

    async deleteExpense(expenseId) {
        try {
            await deleteDoc(doc(this.collectionRef, expenseId));
            console.log("Expense successfully deleted");
        } catch (error) {
            console.error("Error deleting expense: ", error);
        }
    }
}

export const expenseRepository = (userId) => {
    if (!userId) {
        throw new Error('ExpenseRepository - UserId must be provided');
    }
    return new ExpenseRepository(userId);
};

