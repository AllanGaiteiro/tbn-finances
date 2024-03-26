// Importe os módulos necessários do Firebase
import { collection, query, writeBatch, onSnapshot, where, orderBy, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { Expense } from '../entity/Expense';

class ExpenseRepository {
    constructor() {
        this.collectionRef = collection(firestore, 'finances/igreja/expenses');
    }

    async addExpense(expense) {
        try {
            const docRef = await addDoc(this.collectionRef, {
                ...expense,
                paymentDate: expense.paymentDate || new Date(), // Garantindo que a data de pagamento seja definida
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

    async fetchExpenses() {
        try {
            const snapshot = await getDocs(query(this.collectionRef, orderBy("paymentDate", "desc")));
            const expenses = snapshot.docs.map(doc => Expense.fromFirebase({ id: doc.id, ...doc.data() }));
            return expenses;
        } catch (error) {
            console.error("Error fetching expenses: ", error);
            return [];
        }
    }

    observeExpensesForSelectedMonth(setExpense, month, year) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            orderBy("dueDate", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => Expense.fromFirebase({ id: doc.id, ...doc.data() }));
            setExpense(expenses);
        });

        return unsubscribe;
    }


    observeExpenseAmountByMonth(seExpenseMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newExpenseMonths = {};
            const newExpenseMonthsNotPay = {};
            const month = {}
            const year = {}
            snapshot.docs.forEach(doc => {
                const data = Expense.fromFirebase({ ...doc.data(), id: doc.id });
                const dueDate = data?.dueDate;
                if (dueDate) {
                    const monthYearKey = dueDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!newExpenseMonths[monthYearKey]) {
                        newExpenseMonths[monthYearKey] = 0;
                    }
                    if (!newExpenseMonthsNotPay[monthYearKey]) {
                        newExpenseMonthsNotPay[monthYearKey] = 0;
                    }

                    if (data.status === 'paga') {
                        newExpenseMonths[monthYearKey] += data.amount;
                    } else {
                        newExpenseMonthsNotPay[monthYearKey] += data.amount;
                    }
                    month[monthYearKey] = dueDate.getMonth()
                    year[monthYearKey] = dueDate.getFullYear()
                }
            });

            const sortedMonths = Object.keys(newExpenseMonths).sort((a, b) => new Date(b) - new Date(a)).map(key => ({
                monthId: key,
                month: month[key],
                year: year[key],
                total: newExpenseMonths[key],
                totalNotPay: newExpenseMonthsNotPay[key],
            }));

            seExpenseMonths(sortedMonths);
            setLoading(false);
        }, (error) => {
            console.error("Error observing expense by month:", error);
            setLoading(false);
        });

        return unsubscribe;
    }

    observeAmountByMonth(setExpenses) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const totalAmount = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setExpenses(totalAmount);
        });
        return unsubscribe;
    }

    observeAmountNotPaymentByMonth(setExpenses) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Filtrar no lado do cliente para excluir os documentos com status 'paga'
            const filteredDocs = snapshot.docs.filter(doc => doc.data().status !== 'paga');
            const totalAmount = filteredDocs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setExpenses(totalAmount);
        });
        return unsubscribe;
    }
    observeAmountPaymentByMonth(setExpenses) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            where("status", "==", 'paga'),
            orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const totalAmount = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setExpenses(totalAmount);
        });
        return unsubscribe;
    }

    // Método para adicionar uma despesa recorrente
    async addRecurringExpense(expense, recurrencePeriod) {
        try {
            const batch = writeBatch(firestore);
            const currentDate = new Date();
            for (let i = 0; i < recurrencePeriod; i++) {
                const recurringDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, expense.paymentDate.getDate());
                const newExpense = { ...expense, paymentDate: recurringDate };
                const newDocRef = doc(this.collectionRef);
                batch.set(newDocRef, newExpense);
            }
            await batch.commit();
            console.log(`${recurrencePeriod} recurring expenses successfully added.`);
        } catch (error) {
            console.error("Error adding recurring expense: ", error);
        }
    }

    // Método para atualizar o status de uma despesa
    async updateExpenseStatus(expenseId, newStatus) {
        try {
            const expenseRef = doc(this.collectionRef, expenseId);
            await updateDoc(expenseRef, { status: newStatus });
            console.log("Expense status successfully updated to: ", newStatus);
        } catch (error) {
            console.error("Error updating expense status: ", error);
        }
    }

    // Método para filtrar despesas por categoria
    observeExpensesByCategory(setExpenses, category) {
        const q = query(this.collectionRef,
            where("category", "==", category),
            orderBy("paymentDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => Expense.fromFirebase({ ...doc.data(), id: doc.id }));
            setExpenses(expenses);
        }, (error) => {
            console.error('Error observing expenses by category:', error);
        });

        return unsubscribe;
    }
}

// Exporta uma instância do repositório para ser utilizada no aplicativo
export const expenseRepository = new ExpenseRepository();
