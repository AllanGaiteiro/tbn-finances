// Importe os módulos necessários do Firebase
import { collection, query, onSnapshot, orderBy, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import {Expense} from '../entity/Expense';

export class ExpenseRepository {
    constructor() {
        this.collectionRef = collection(firestore, 'finances/igreja/transactions');
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

    observeExpenses(setExpenses) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => Expense.fromFirebase({ ...doc.data(), id: doc.id }));
            setExpenses(expenses);
        }, (error) => {
            console.error('Error observing expenses:', error);
        });
        return unsubscribe;
    }
}

export const expenseRepository = new ExpenseRepository();

