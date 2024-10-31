import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC0SOsIK8MUHazRDGRS7BBtzHdI2ZRkXWg",
    authDomain: "messenger-1a31f.firebaseapp.com",
    projectId: "messenger-1a31f",
    storageBucket: "messenger-1a31f.appspot.com",
    messagingSenderId: "430082213959",
    appId: "1:430082213959:web:54709879af57416689c962",
    databaseURL: "https://messenger-1a31f-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);
