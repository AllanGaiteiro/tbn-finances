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
        if (filters?.status === 'atrasada') {
            return this.observerTransactionLate(setTransaction, setLoading, filters);
        } else {
            return this.observeTransactionByMonth(setTransaction, setLoading, 'select', filters);
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

    observeTransactionByMonth(setValue, setLoading, type = 'select', filter = new FiltersEntity()) {
        const { month, year, sortOrder, sortBy, text: searchText } = filter
        const startDate = new Date(year, month, 1, 0, 0, 0);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        let transactionDateQuery = this.queryTransactionDateByMonth(startDate, endDate, sortBy, sortOrder);
        let dueDateQuery = this.queryDueDateByMonth(startDate, endDate, sortBy, sortOrder);
        let lastRecurrenceDateQuery = this.queryLastRecurrenceDateByMonth(startDate, sortBy, sortOrder);

        if (searchText) {
            transactionDateQuery = this.querySeachDescription(transactionDateQuery, searchText);
            dueDateQuery = this.querySeachDescription(dueDateQuery, searchText);
            lastRecurrenceDateQuery = this.querySeachDescription(lastRecurrenceDateQuery, searchText);
        }

        const transactionDateObservable = this.fromCollectionRef(transactionDateQuery);
        const dueDateObservable = this.fromCollectionRef(dueDateQuery);
        const lastRecurrenceDateObservable = this.fromCollectionRef(lastRecurrenceDateQuery);

        const combinedObservable = combineLatest([transactionDateObservable, dueDateObservable, lastRecurrenceDateObservable]);

        const combinedSubscription = combinedObservable.subscribe(([transactionDateSnapshot, dueDateSnapshot, lastRecurrenceDateSnapshot]) => {
            const transactions = [...transactionDateSnapshot.docs, ...dueDateSnapshot.docs, ...lastRecurrenceDateSnapshot.docs].map(doc => TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id }));
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

    observeTransactionAmountByMonth(setTransactionMonths, setLoading, monthsToLoad = { after: 3, before: 3 }) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const startDate = new Date(currentYear, currentMonth - monthsToLoad.before, 1);
        const endDate = new Date(currentYear, currentMonth + monthsToLoad.after + 1, 0);
        const expenseMonths = {};
        const incomeMonths = {};
        const month = {};
        const year = {};

        let tempDate = new Date(startDate);
        while (tempDate <= endDate) {
            const monthYearKey = tempDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            expenseMonths[monthYearKey] = 0;
            incomeMonths[monthYearKey] = 0;
            month[monthYearKey] = tempDate.getMonth();
            year[monthYearKey] = tempDate.getFullYear();
            tempDate.setMonth(tempDate.getMonth() + 1);  // Avança para o próximo mês
        }
        const q = this.queryLastUpdateDateByMonth(startDate,endDate);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach(doc => {
                const data = TransactionEntity.fromFirebase({ ...doc.data(), id: doc.id });
                const date = data?.transactionDate || data.dueDate;
                const lastRecurrenceDate = data?.lastRecurrenceDate;
                const amount = data.amount;

                if (date && amount) {
                    const monthYearKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                    if (data.typeTransaction === 'income') {
                        incomeMonths[monthYearKey] += amount;
                    } else {
                        expenseMonths[monthYearKey] += amount;
                    }
                }

                // Distribui transações recorrentes nos meses subsequentes
                if (data.isRecurrence && lastRecurrenceDate) {
                    let recurrenceDate = new Date(lastRecurrenceDate);
                    while (recurrenceDate <= endDate) {
                        const recurrenceMonthYearKey = recurrenceDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                        if (data.typeTransaction === 'income') {
                            incomeMonths[recurrenceMonthYearKey] += Number(data.amount);
                        } else {
                            expenseMonths[recurrenceMonthYearKey] += Number(data.amount);
                        }
                        recurrenceDate.setMonth(recurrenceDate.getMonth() + 1);
                    }
                }
            });

            // Verifica os meses que têm valores e filtra os que não têm
            const sortedMonths = Object.keys(expenseMonths)
                .filter(key => expenseMonths[key] > 0 || incomeMonths[key] > 0)
                .sort((a, b) => year[a] > year[b] ? -1 : (year[a] === year[b] && month[a] > month[b] ? -1 : 1))
                .map(key => ({
                    monthId: key,
                    month: month[key],
                    year: year[key],
                    expenseMonth: expenseMonths[key]?.toFixed(2) ?? 0,
                    incomeMonth: incomeMonths[key]?.toFixed(2) ?? 0,
                    totalMonth: incomeMonths[key] - expenseMonths[key],
                }));

            setTransactionMonths(sortedMonths);
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

    async handleRecurrenceUpdate(transaction) {
        const promises = []
        try {
            if (transaction.isRecurrence) {

                promises.push(this.updateIncome({
                    id: transaction.id,
                    lastRecurrenceDate: new Date(),
                    dueDate: null,
                    transactionDate: null
                }));

                const newtransactionData = { ...transaction };
                newtransactionData.isRecurrence = false;
                newtransactionData.type = TypeOptionEntity.fromFirebase(newtransactionData.type).toFirestore();
                newtransactionData.recurrenceId = transaction.id;
                newtransactionData.status = 'recebido';
                delete newtransactionData.id;
                promises.push(this.addIncome(newtransactionData));

                await Promise.all(promises)
            }

            console.log("Recurrence update and new transaction creation successful.");
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error handling recurrence update: ");
        }
    }


    filterTransactionList = (transactions, typeTransaction, status, statusEq = true) => {
        return transactions
            .filter(t => t.typeTransaction === typeTransaction && (statusEq ? t.status === status : t.status !== status)) ?? []
    }

    querySeachDescription(transactionQuery, searchText) {
        return query(transactionQuery, where('description', '>=', searchText), where('description', '<=', searchText + '\uf8ff'));
    }

    queryLastUpdateDateByMonth(startDate, endDate) {
        return query(
            this.collectionRef,
            where("lastUpdateDate", ">=", startDate),
            where("lastUpdateDate", "<=", endDate),
            where('status', '!=', 'cancelado'),
            orderBy("lastUpdateDate", "desc")
        );
    }

    queryLastRecurrenceDateByMonth(startDate, sortBy, sortOrder) {
        return query(this.collectionRef,
            where("lastRecurrenceDate", "<=", startDate),
            where("isRecurrence", "==", true),
            orderBy(sortBy || "dueDate", sortOrder || "desc"));
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
