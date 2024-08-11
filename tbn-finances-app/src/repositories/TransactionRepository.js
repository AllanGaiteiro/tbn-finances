import { collection, query, writeBatch, onSnapshot, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { expenseRepository } from './ExpenseRepository';
import { incomeRepository } from './IncomeRepository';
import { TransactionEntity } from '../entity/TransactionEntity';
import { AmountByMonth } from '../entity/AmountByMonth';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';

class TransactionRepository {
    constructor(account) {
        this.account = account;
        this.expense = expenseRepository(account);
        this.income = incomeRepository(account);
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
        this.docRef = (id) => doc(firestore, `accounts/${this.account}/transactions`, id);
    }

    observeTransactionForSelectedMonth(setTransaction, setLoading, { selectedMonth, selectedYear, sortOrder, sortBy }) {
        const startDate = new Date(selectedYear, selectedMonth, 1, 0, 0, 0); // 0 horas, 0 minutos, 0 segundos
        const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59); // 23 horas, 59 minutos, 59 segundos

        const q = query(this.collectionRef,
            where("transactionDate", ">=", startDate),
            where("transactionDate", "<=", endDate),
            orderBy(sortBy || "transactionDate", sortOrder || "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const transactions = snapshot.docs.map(doc => TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id }));
            console.log(this.account, transactions.length)
            setLoading(false);
            setTransaction(transactions);
        });

        return unsubscribe;
    }

    observeTransactionAmountByMonth(seExpenseMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("transactionDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenseMonths = {};
            const incomeMonths = {};
            const month = {};
            const year = {};
            console.log(snapshot.docs.length)
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
                const transactionDate = data?.transactionDate;
                if (transactionDate) {
                    const monthYearKey = transactionDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!expenseMonths[monthYearKey]) {
                        expenseMonths[monthYearKey] = 0;
                    }
                    if (!incomeMonths[monthYearKey]) {
                        incomeMonths[monthYearKey] = 0;
                    }

                    if (data.typeTransaction === 'income') {
                        incomeMonths[monthYearKey] += Number(data.amount);
                    } else {
                        expenseMonths[monthYearKey] += Number(data.amount);
                    }
                    month[monthYearKey] = transactionDate.getMonth();
                    year[monthYearKey] = transactionDate.getFullYear();
                }
            });

            console.log(month)

            const sortedMonths = Object.keys(expenseMonths).sort((a, b) => new Date(b) - new Date(a)).map(key => ({
                monthId: key,
                month: month[key],
                year: year[key],
                expenseMonth: expenseMonths[key] ?? 0,
                incomeMonth: incomeMonths[key] ?? 0,
                totalMonth: incomeMonths[key] - expenseMonths[key],
            }));

            seExpenseMonths(sortedMonths);
            setLoading(false);
        }, (error) => {
            setLoading(false);
            throw FirebaseErrorInterceptor.handle(error, "Error observing expense by month:");
        });

        return unsubscribe;
    }

    observeAmountByMonth(setTransaction) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("transactionDate", ">=", startDate),
            where("transactionDate", "<=", endDate),
            orderBy("transactionDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const amountByMonth = new AmountByMonth();
            const transactionList = snapshot.docs.map(d => TransactionEntity.fromFirebase(d.data()));
            const filterTransactionList = (typeTransaction) => transactionList?.filter(t => t.typeTransaction === typeTransaction) ?? [];
            amountByMonth.income = filterTransactionList('income')?.reduce((acc, d) => acc + d.amount || 0, 0)
            amountByMonth.expense = filterTransactionList('expense')?.reduce((acc, d) => acc + d.amount || 0, 0)
            amountByMonth.total = amountByMonth.income - amountByMonth.expense
            setTransaction(amountByMonth);
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
            throw FirebaseErrorInterceptor.handle(error, "Error adding recurring expense: ");

        }
    }

    // Método para atualizar o status de uma despesa
    async updateExpenseStatus(expenseId, newStatus) {
        try {
            const expenseRef = doc(this.collectionRef, expenseId);
            await updateDoc(expenseRef, { status: newStatus });
            console.log("Expense status successfully updated to: ", newStatus);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating expense status: ");

        }
    }

}
// Exporta uma instância do repositório para ser utilizada no aplicativo

export const transactionRepository = (account) => {
    if (!account) {
        throw new Error('TransactionRepository - account must be provided');
    }
    return new TransactionRepository(account);
}
