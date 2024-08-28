import { collection, doc, addDoc, updateDoc, onSnapshot, where, query } from "firebase/firestore";
import { firestore } from "../settings/firebaseConfig";
import { FirebaseErrorInterceptor } from "../utils/FirebaseErrorUtil";
import { TypeOptionEntity } from "../entity/TypeOptionEntity";

class TransactionTypesRepository {
    constructor(collectionName = 'incomeTypes') {
        this.collectionRef = collection(firestore, collectionName);
        this.docRef = (id) => doc(firestore, collectionName, id);
    }

    getTransctionTypesByIds(ids, setTransctionType) {
        const q = query(this.collectionRef, where('id', 'in', ids))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const types = querySnapshot.docs.map((doc) => TypeOptionEntity.fromFirebase({ ...doc.data(), id: doc.id }))
            setTransctionType(types)
        });
        return unsubscribe;
    }


    // Adicionar um novo income
    async addTransctionType(incomeType) {
        try {
            const docRef = await addDoc(this.collectionRef, incomeType);
            console.log("Transction Type successfully added with ID: ", docRef.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error adding Transction Type: ");
        }
    }

    // Atualizar um Transction existente
    async updateTransctionType(incomeType) {
        try {
            const incomeTypeRef = doc(this.collectionRef, incomeType.id);
            await updateDoc(incomeTypeRef, incomeType);
            console.log("Transction Type successfully updated - ", incomeType.id);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Error updating Transction Type: " + incomeType.id + " - ");
        }
    }

}

export const transactionTypeRepository = (collectionName = 'incomeTypes') => new TransactionTypesRepository(collectionName);