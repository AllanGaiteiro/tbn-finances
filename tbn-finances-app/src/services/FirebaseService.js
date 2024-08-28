import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { firebaseConfig } from "../settings/firebaseConfig";

export class FirebaseService {
    constructor() {
        // Inicializa o Firebase
        this.app = initializeApp(firebaseConfig);

        // Inicializa o Storage
        this.storage = getStorage(this.app);

        // Inicializa o Firestore se necessário
        this.firestore = getFirestore(this.app);
    }

    getStorageRef(filename) {
        return ref(this.storage, filename);
    }
}

export const firebaseService = new FirebaseService();
