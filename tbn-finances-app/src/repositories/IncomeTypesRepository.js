import { collection, doc, addDoc, updateDoc, onSnapshot, where, query } from "firebase/firestore";
import { firestore } from "../settings/firebaseConfig";
import { FirebaseErrorInterceptor } from "../utils/FirebaseErrorUtil";
import { TypeOptionEntity } from "../entity/TypeOptionEntity";

class IncomeTypesRepository {
    constructor() {
        this.collectionRef = collection(firestore, `incomeTypes`);
        this.docRef = (id) => doc(firestore, `incomeTypes`, id);
    }

    getIncomeTypesByIds(ids, setIncomeType) {
        console.log('get income types by id- ', ids)
        const q = query(this.collectionRef, where('id', 'in', ids))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const types = querySnapshot.docs.map((doc) => TypeOptionEntity.fromFirebase({ ...doc.data(), id: doc.id }))
            setIncomeType(types)
        });
        return unsubscribe;
    }


    // Adicionar um novo income
    async addIncomeType(incomeType) {
        try {
            const docRef = await addDoc(this.collectionRef, incomeType);
            console.log("Income Type successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding income Type: ");
        }
    }

    // Atualizar um income existente
    async updateIncomeType(incomeType) {
        try {
            const incomeTypeRef = doc(this.collectionRef, incomeType.id);
            await updateDoc(incomeTypeRef, incomeType);
            console.log("Income Type successfully updated - ", incomeType.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating income Type: " + incomeType.id + " - ");
        }
    }

}

export const incomeTypeRepository = new IncomeTypesRepository();