import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, EmailAuthProvider, updatePassword, reauthenticateWithCredential, updateEmail, updateCurrentUser, updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../settings/firebaseConfig';
import { FirebaseErrorInterceptor } from '../utils/FirebaseErrorUtil';
import { userService } from './UserService';

class UserAuthService {
    constructor() {
        // Inicializa o Firebase
        this.app = initializeApp(firebaseConfig);

        // Instância de autenticação
        this.auth = initializeAuth(this.app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    }

    async signUp({ name, email, password }) {
        try {
            // Cria usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                emailVerified: userCredential.user.emailVerified,
                displayName: name,
            };

            await Promise.all([
                updateCurrentUser(this.auth, user),
                userService.addUser(user)
            ]);

            return user;
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao criar usuário:");
        }
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential;
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao fazer login:");
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao fazer logout:");
        }
    }

    monitorAuthState(callback) {
        onAuthStateChanged(this.auth, callback);
    }

    async changeEmail(currentPassword, newEmail) {
        try {
            const user = this.auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            await Promise.all([
                userService.updateUserEmail(user.uid, newEmail),
                updateEmail(user, newEmail)]);
            return user;
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao alterar o email:");
        }
    }

    async changeDisplayName(newDisplayName) {
        try {
            const user = this.auth.currentUser;

            await Promise.all([
                updateProfile(user, { displayName: newDisplayName }),
                userService.updateDisplayName(user.uid, newDisplayName)
            ]);
            return user;
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao alterar o nome:");
        }
    }
    async changePassword(currentPassword, newPassword) {
        try {
            const user = this.auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
        } catch (error) {
            throw FirebaseErrorInterceptor.handle(error, "Erro ao alterar a senha:");
        }
    }
}

export const userAuthService = new UserAuthService();
