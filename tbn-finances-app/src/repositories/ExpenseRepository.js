// Importe os módulos necessários do Firebase
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';
import { TypeOptionEntity } from '../entity/TypeOptionEntity';

export class ExpenseRepository {
    constructor(account) {
        this.account = account;
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
    }

    async addExpense(expense) {
        try {
            const expenseData = { ...expense, transactionDate: expense.transactionDate || new Date(), type: TypeOptionEntity.fromFirebase(expense.type).toFirestore() }
            const docRef = await addDoc(this.collectionRef, expenseData);
            console.log("Expense successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding expense: " + expense.id + " - ");
        }
    }

    async addExpense(expense) {
        try {
            const expenseData = { ...expense, transactionDate: expense.transactionDate || new Date(), type: TypeOptionEntity.fromFirebase(expense.type).toFirestore() }
            const docRef = await addDoc(this.collectionRef, expenseData);
            console.log("Expense successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding expense: " + expense.id + " - ");
        }
    }

    async updateExpense(expense) {
        try {
            const expenseData = { ...expense, type: TypeOptionEntity.fromFirebase(expense.type).toFirestore() }

            const expenseRef = doc(this.collectionRef, expense.id);
            await updateDoc(expenseRef, expenseData);
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

