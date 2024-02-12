// Importe os módulos necessários do Firebase
import { collection, query, writeBatch, onSnapshot, where, orderBy, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../settings/firebaseConfig';
import { Income } from '../entity/Income';
class IncomeRepository {
    constructor(firestore) {
        this.collectionRef = collection(firestore, 'finances/igreja/incomes');
        this.docRef = (id) => doc(firestore, 'finances/igreja/incomes', id);
    }

    async handleRecurrenceUpdate(income) {
        const batch = writeBatch(firestore);

        try {
            // Atualiza a income original se o status é alterado para 'recebido'
            if (income.status === 'recebido' && income.isRecurrence) {
                const originalIncomeRef = this.docRef(income.id);
                batch.update(originalIncomeRef, {
                    lastRecurrenceDate: new Date(), // Define a data da última recorrência
                    // Mantém o status atual, ou pode definir outro status conforme a necessidade
                });

                // Cria uma nova income baseada na recorrente, com referência à original
                const newIncomeData = {
                    ...income,
                    recurrenceId: income.id, // Referência à renda recorrente original
                    isRecurrence: false, // A nova renda não é mais uma recorrência
                    receivedDate: new Date(), // Define a data de recebimento para a nova renda
                };
                delete newIncomeData.id; // Remove o id para garantir a criação de um novo documento
                batch.set(doc(this.collectionRef), newIncomeData);
            }

            await batch.commit();
            console.log("Recurrence update and new income creation successful.");
        } catch (error) {
            console.error("Error handling recurrence update: ", error);
            throw error; // Relança o erro para tratamento externo, se necessário
        }
    }

    // Observar as mudanças em tempo real e retornar os incomes
    observeIncomes(setIncomes) {
        const q = query(this.collectionRef, orderBy("receivedDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const incomes = snapshot.docs.map(doc =>
                Income.fromFirebase({ ...doc.data(), id: doc.id })
            );
            setIncomes(incomes);
        }, (error) => {
            console.error('Error observing incomes:', error);
        });

        return unsubscribe;
    }

    observeIncomeByMonth(setIncomeMonths, setLoading) {
        const q = query(this.collectionRef, orderBy("receivedDate", "desc"), where("status", "in", ["recebido", "em_progresso"]));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newIncomeMonths = {};
            snapshot.docs.forEach(doc => {
                const data = Income.fromFirebase({ ...doc.data(), id: doc.id });
                const receivedDate = data?.receivedDate;
                if (receivedDate) {
                    const monthYearKey = receivedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

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

    observeTotalThisMonth(setTotalReceived) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("receivedDate", ">=", startOfMonth),
            where("receivedDate", "<=", endOfMonth),
            where("status", "in", ["recebido", "em_progresso"]));

        return onSnapshot(q, (snapshot) => {
            const totalReceived = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalReceived(totalReceived);
        });
    }

    observeRecurrence(setTotalRecurence) {
        const q = query(this.collectionRef,
            where("isRecurrence", "==", true),
            where("status", "in", ["em_progresso"]));

        return onSnapshot(q, (snapshot) => {
            const totalReceived = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalRecurence(totalReceived);
        });
    }

    observeTotalForCurrentMonthIncludingRecurrence(setTotalAmount) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const currentDay = new Date().getDate();

        // Query para buscar rendas não recorrentes do mês atual
        const qNonRecurrent = query(this.collectionRef,
            where("receivedDate", ">=", startOfMonth),
            where("receivedDate", "<=", endOfMonth),
            where("status", "in", ["recebido", "em_progresso"]));

        // Query para buscar todas as rendas recorrentes
        const qRecurrent = query(this.collectionRef,
            where("isRecurrence", "==", true));

        let totalNonRecurrent = 0;
        let totalRecurrent = 0;

        const unsubscribeNonRecurrent = onSnapshot(qNonRecurrent, (snapshot) => {
            totalNonRecurrent = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalAmount(totalNonRecurrent + totalRecurrent);
        });

        const unsubscribeRecurrent = onSnapshot(qRecurrent, (snapshot) => {
            snapshot.docs.filter(d => !d.data()?.lastRecurrenceDate || !(d.data().lastRecurrenceDate <= startOfMonth)).forEach(doc => {
                const data = doc.data();
                // Assuma que todos os recorrentes se aplicam ao mês atual, ou verifique o dia específico se necessário
                if (data.recurrenceDay && data.recurrenceDay >= currentDay) {
                    totalRecurrent += data.amount;
                }
            });
            setTotalAmount(totalNonRecurrent + totalRecurrent);
        });

        return () => {
            unsubscribeNonRecurrent();
            unsubscribeRecurrent();
        };
    }

    // Método modificado para escutar o valor total recebido do mês
    observeTotalReceivedThisMonth(setTotalReceived) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("receivedDate", ">=", startOfMonth),
            where("receivedDate", "<=", endOfMonth),
            where("status", "in", ["recebido"]));

        return onSnapshot(q, (snapshot) => {
            const totalReceived = snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalReceived(totalReceived);
        });
    }



    // Método modificado para escutar o maior valor do mês
    observeHighestIncomeThisMonth(setHighestIncome) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const q = query(this.collectionRef,
            where("receivedDate", ">=", startOfMonth),
            where("receivedDate", "<=", endOfMonth));

        return onSnapshot(q, (snapshot) => {
            const highestIncome = snapshot.docs.reduce((max, doc) => Math.max(max, doc.data().amount), 0);
            setHighestIncome(highestIncome);
        });
    }

    // Método modificado para escutar o valor total a receber
    observeTotalToReceive(setTotalToReceive) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const q = query(this.collectionRef, 
            where("status", "==", "em_progresso"));

        return onSnapshot(q, (snapshot) => {
            const totalToReceive = snapshot.docs.filter(d => !(d.data().lastRecurrenceDate <= startOfMonth)).reduce((acc, doc) => acc + doc.data().amount, 0);
            setTotalToReceive(totalToReceive);
        });
    }
    // Adicionar um novo income
    async addIncome(income) {
        try {
            const docRef = await addDoc(this.collectionRef, income);
            console.log("Income successfully added with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding income: ", error);
        }
    }

    // Atualizar um income existente
    async updateIncome(income) {
        try {
            console.log(income)
            const incomeRef = doc(this.collectionRef, income.id);
            await updateDoc(incomeRef, income);
            console.log("Income successfully updated - ", income.id);
        } catch (error) {
            console.error("Error updating income: ", income.id, " - ", error);
        }
    }

    // Deletar um income
    async deleteIncome(incomeId) {
        try {
            await deleteDoc(doc(this.collectionRef, incomeId));
            console.log("Income successfully deleted");
        } catch (error) {
            console.error("Error deleting income: ", error);
        }
    }

    // Buscar todos os incomes (exemplo sem observar mudanças em tempo real)
    async fetchIncomes() {
        try {
            const snapshot = await getDocs(query(this.collectionRef, orderBy("receivedDate", "desc")));
            const incomes = snapshot.docs.map(doc =>
                Income.fromFirebase({ id: doc.id, ...doc.data() })
            );
            return incomes;
        } catch (error) {
            console.error("Error fetching incomes: ", error);
            return [];
        }
    }

}

// Exporta uma instância do repositório para ser utilizada no aplicativo
export const incomeRepository = new IncomeRepository(firestore);
