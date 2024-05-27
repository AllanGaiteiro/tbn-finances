import { collection, query, writeBatch, onSnapshot, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { expenseRepository } from './ExpenseRepository';
import { incomeRepository } from './IncomeRepository';
import { TransactionEntity } from '../entity/TransactionEntity';

class TransactionRepository {
    expense = expenseRepository;
    income = incomeRepository;
    constructor() {
        this.docRef = (id) => doc(firestore, 'finances/igreja/transactions', id);
        this.collectionRef = collection(firestore, 'finances/igreja/transactions');
    }



    observeTransactionForSelectedMonth(setTransaction, month, year) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            orderBy("dueDate", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => TransactionEntity.fromFirebase({ id: doc.id, ...doc.data() }));
            setTransaction(expenses);
        });

        return unsubscribe;
    }


    observeExpenseAmountByMonth(seExpenseMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newExpenseMonths = {};
            const newExpenseMonthsNotPay = {};
            const month = {};
            const year = {};
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
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
                    month[monthYearKey] = dueDate.getMonth();
                    year[monthYearKey] = dueDate.getFullYear();
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

    observeAmountByMonth(setTransaction) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const totalAmount = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTransaction(totalAmount);
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
                const recurringDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, expense.transactionDate.getDate());
                const newExpense = { ...expense, transactionDate: recurringDate };
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
            orderBy("transactionDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id }));
            setExpenses(expenses);
        }, (error) => {
            console.error('Error observing expenses by category:', error);
        });

        return unsubscribe;
    }


    // Observar as mudanças em tempo real e retornar os incomes
    observeIncomes(setIncomes) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const incomes = snapshot.docs.map(doc =>
                TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id })
            );
            setIncomes(incomes);
        }, (error) => {
            console.error('Error observing incomes:', error);
        });

        return unsubscribe;
    }

    observeIncomeByMonth(setIncomeMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"), where("status", "in", ["recebido", "em_progresso"]));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newIncomeMonths = {};
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
                const dueDate = data?.dueDate;
                if (dueDate) {
                    const monthYearKey = dueDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                    if (!newIncomeMonths[monthYearKey]) {
                        newIncomeMonths[monthYearKey] = 0;
                    }
                    newIncomeMonths[monthYearKey] += data.amount;
                }
            });

            const sortedMonths = Object.keys(newIncomeMonths).sort((a, b) => new Date(b) - new Date(a)).map(key => ({
                month: key,
                total: newIncomeMonths[key],
            }));

            setIncomeMonths(sortedMonths);
            setLoading(false);
        }, (error) => {
            console.error("Error observing incomes by month:", error);
            setLoading(false);
        });

        return unsubscribe;
    }

    observeIncomeAmountByMonth(setIncomesMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("dueDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newIncomeMonths = {};
            const month = {}
            const year = {}
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
                const dueDate = data?.dueDate;
                if (dueDate) {
                    const monthYearKey = dueDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!newIncomeMonths[monthYearKey]) {
                        newIncomeMonths[monthYearKey] = 0;
                    }
                    newIncomeMonths[monthYearKey] += data.amount;
                    month[monthYearKey] = dueDate.getMonth()
                    year[monthYearKey] = dueDate.getFullYear()
                }
            });

            const sortedMonths = Object.keys(newIncomeMonths).sort((a, b) => new Date(b) - new Date(a)).map(key => ({
                monthId: key,
                month: month[key],
                year: year[key],
                total: newIncomeMonths[key],
            }));

            setIncomesMonths(sortedMonths);
            setLoading(false);
        }, (error) => {
            console.error("Error observing expense by month:", error);
            setLoading(false);
        });

        return unsubscribe;
    }

    observeToReceivedAllThisMonth(setTotalAmount) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const currentDay = new Date().getDate();

        // Query para buscar rendas não recorrentes do mês atual
        const qNonRecurrent = query(this.collectionRef,
            where("dueDate", ">=", startOfMonth),
            where("dueDate", "<=", endOfMonth),
            where("status", "in", ["recebido"]));

        // Query para buscar todas as rendas recorrentes
        const qRecurrent = query(this.collectionRef,
            where("lastRecurrenceDate", "<=", startOfMonth),
            where("status", "==", "em_progresso"));

        let totalNonRecurrent = 0;
        let totalRecurrent = 0;

        const unsubscribeNonRecurrent = onSnapshot(qNonRecurrent, (snapshot) => {
            totalNonRecurrent = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalAmount(totalNonRecurrent + totalRecurrent);
        });

        const unsubscribeRecurrent = onSnapshot(qRecurrent, (snapshot) => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                totalRecurrent += data.amount;
            });
            setTotalAmount(totalNonRecurrent + totalRecurrent);
        });

        return () => {
            unsubscribeNonRecurrent();
            unsubscribeRecurrent();
        };
    }

    // Método modificado para escutar o valor total recebido do mês
    observeReceivedThisMonth(setTotalReceived) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("dueDate", ">=", startOfMonth),
            where("dueDate", "<=", endOfMonth),
            where("status", "in", ["recebido"]));

        return onSnapshot(q, (snapshot) => {
            const totalReceived = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalReceived(totalReceived);
        });
    }

    // Método modificado para escutar o valor total a receber
    observeToReceiveThisMonth(setTotalToReceive) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const q = query(this.collectionRef,
            where("lastRecurrenceDate", "<=", startOfMonth),
            where("status", "==", "em_progresso"));

        return onSnapshot(q, (snapshot) => {
            const totalToReceive = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalToReceive(totalToReceive);
        });
    }
}
// Exporta uma instância do repositório para ser utilizada no aplicativo

export const transactionRepository = new TransactionRepository();
