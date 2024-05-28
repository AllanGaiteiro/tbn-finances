import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


export const firebaseConfig = {
    apiKey: "AIzaSyB2g5KViGb0jMSkM4LXBQBVymEd-t6EJEM",
    authDomain: "tbn-staging.firebaseapp.com",
    projectId: "tbn-staging",
    storageBucket: "tbn-staging.appspot.com",
    messagingSenderId: "688629891266",
    appId: "1:688629891266:web:29c02f4cc8957189aebb5b",
    measurementId: "G-KYQP346S3Q"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
