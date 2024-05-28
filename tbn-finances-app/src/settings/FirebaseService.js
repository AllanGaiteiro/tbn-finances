import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

class FirebaseService {
    constructor() {
        // Inicializa o Firebase
        this.app = initializeApp(firebaseConfig);

        // Instâncias do Firestore e Auth
        this.firestore = getFirestore(this.app);
        this.auth = initializeAuth(this.app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    }

    // Função para realizar cadastro e criar um documento no Firestore
    async signUp(email, password) {
        try {
            // Cria usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Cria um documento na coleção 'users' com o mesmo UID do usuário
            await setDoc(doc(this.firestore, "users", user.uid), {
                email: email,
                // Adicione aqui outros campos que você deseja salvar, como:
                // name: "",
                // createdAt: new Date(),
            });

            return user;
        } catch (error) {
            console.error("Erro ao criar usuário e documento no Firestore:", error);
            throw error;
        }
    }

    // Função para realizar login
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error; // Lança o erro para ser tratado por quem chama a função
        }
    }

    // Função para monitorar o estado de autenticação
    monitorAuthState(callback) {
        onAuthStateChanged(this.auth, callback);
    }
}

// Exporta uma instância da classe para ser reutilizada em todo o aplicativo
export const firebaseService = new FirebaseService();
