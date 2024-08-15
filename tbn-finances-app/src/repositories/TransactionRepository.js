import { collection, query, writeBatch, onSnapshot, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { expenseRepository } from './ExpenseRepository';
import { incomeRepository } from './IncomeRepository';
import { TransactionEntity } from '../entity/TransactionEntity';
import { AmountByMonth } from '../entity/AmountByMonth';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';
import { combineLatest, Observable } from 'rxjs';
import { FiltersEntity } from '../providers/FiltersEntity';

class TransactionRepository {
    constructor(account) {
        this.account = account;
        this.expense = expenseRepository(account);
        this.income = incomeRepository(account);
        this.collectionRef = collection(firestore, `accounts/${this.account}/transactions`);
        this.docRef = (id) => doc(firestore, `accounts/${this.account}/transactions`, id);
    }

    fromCollectionRef(collectionRef) {
        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(collectionRef, snapshot => {
                subscriber.next(snapshot);
            });
            return () => unsubscribe();
        });
    }

    observeTransactionList(setTransaction, setLoading, filters = new FiltersEntity()) {
        if (filters.status === 'atrasada') {
            return this.observerTransactionLate(setTransaction, setLoading, filters);
        } else {
            return this.observeTransactionByMonth(setTransaction, setLoading, filters);
        }
    }
    observerTransactionLate(setTransaction, setLoading, filters = new FiltersEntity()) {
        const unpaidTransactionsQuery = query(this.collectionRef,
            where("typeTransaction", "==", 'expense'),
            where("status", "==", filters.status),
            orderBy(filters.sortBy || "lastUpdateDate", filters.sortOrder || "desc"));
        const transactionObservable = this.fromCollectionRef(unpaidTransactionsQuery);

        const transactionSubscription = transactionObservable.subscribe((transactionSnapshot) => {
            const transactions = transactionSnapshot.docs.map(doc => TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id }));
            console.log('observerTransactionLate', transactions.length);
            setLoading(false);
            setTransaction(transactions);
        });

        return transactionSubscription
    }

    observeTransactionByMonth(setValue, setLoading, type = 'select', { month, year, sortOrder, sortBy, text: searchText } = new FiltersEntity()) {
        const startDate = new Date(year, month, 1, 0, 0, 0);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        let transactionQuery = this.queryTransactionDateByMonth(startDate, endDate, sortBy, sortOrder);
        let unpaidTransactionsQuery = this.queryDueDateByMonth(startDate, endDate, sortBy, sortOrder);

        if (searchText) {
            transactionQuery = this.querySeachDescription(transactionQuery, searchText);
            unpaidTransactionsQuery = this.querySeachDescription(transactionQuery, searchText);
        }

        const transactionObservable = this.fromCollectionRef(transactionQuery);
        const unpaidObservable = this.fromCollectionRef(unpaidTransactionsQuery);

        const combinedObservable = combineLatest([transactionObservable, unpaidObservable]);

        const combinedSubscription = combinedObservable.subscribe(([transactionSnapshot, unpaidSnapshot]) => {
            const transactions = [...transactionSnapshot.docs, ...unpaidSnapshot.docs].map(doc => TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id }));
            console.log(this.account, transactions.length);

            if (type === 'amount') {
                const amountByMonth = new AmountByMonth();
                amountByMonth.received = this.filterTransactionList(transactions, 'income', 'recebido',).reduce((acc, d) => acc + d.amount || 0, 0)
                amountByMonth.notReceived = this.filterTransactionList(transactions, 'income', 'recebido', false)?.reduce((acc, d) => acc + d.amount || 0, 0)
                amountByMonth.pay = this.filterTransactionList(transactions, 'expense', 'pago')?.reduce((acc, d) => acc + d.amount || 0, 0)
                amountByMonth.notPay = this.filterTransactionList(transactions, 'expense', 'pago', false)?.reduce((acc, d) => acc + d.amount || 0, 0)
                amountByMonth.total = amountByMonth.received - (amountByMonth.pay + amountByMonth.notPay);
                setValue(amountByMonth);
            } else {
                setLoading(false);
                setValue(transactions);
            }

        });

        return combinedSubscription;
    }

    observeTransactionAmountByMonth(seExpenseMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("lastUpdateDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenseMonths = {};
            const incomeMonths = {};
            const month = {};
            const year = {};
            console.log(snapshot.docs.length)
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
                const date = data?.transactionDate || data.dueDate;
                if (date) {
                    const monthYearKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (!expenseMonths[monthYearKey]) expenseMonths[monthYearKey] = 0;
                    if (!incomeMonths[monthYearKey]) incomeMonths[monthYearKey] = 0;

                    if (data.typeTransaction === 'income') {
                        incomeMonths[monthYearKey] += Number(data.amount);
                    } else {
                        expenseMonths[monthYearKey] += Number(data.amount);
                    }
                    month[monthYearKey] = date.getMonth();
                    year[monthYearKey] = date.getFullYear();
                }
            });

            const sortedMonths = Object.keys(expenseMonths).sort((a, b) => year[a] > year[b] ? - 1 : (year[a] === year[b] && month[a] > month[b] ? -1 : 1)).map(key => ({
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

    filterTransactionList = (transactions, typeTransaction, status, statusEq = true) => {
        return transactions
            .filter(t => t.typeTransaction === typeTransaction && (statusEq ? t.status === status : t.status !== status)) ?? []
    }

    querySeachDescription(transactionQuery, searchText) {
        return query(transactionQuery, where('description', '>=', searchText), where('description', '<=', searchText + '\uf8ff'));
    }

    queryDueDateByMonth(startDate, endDate, sortBy, sortOrder) {
        return query(this.collectionRef,
            where("dueDate", ">=", startDate),
            where("dueDate", "<=", endDate),
            where("transactionDate", "==", null),
            orderBy(sortBy || "dueDate", sortOrder || "desc"));
    }

    queryTransactionDateByMonth(startDate, endDate, sortBy, sortOrder) {
        return query(this.collectionRef,
            where("transactionDate", ">=", startDate),
            where("transactionDate", "<=", endDate),
            orderBy(sortBy || "transactionDate", sortOrder || "desc"));
    }

}
// Exporta uma instância do repositório para ser utilizada no aplicativo

export const transactionRepository = (account) => {
    if (!account) {
        throw new Error('TransactionRepository - account must be provided');
    }
    return new TransactionRepository(account);
}
