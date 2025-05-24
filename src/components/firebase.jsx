// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOl9n9BkDu6iAYHkPmcvordQh5vqzl24c",
  authDomain: "filmes-58dd8.firebaseapp.com",
  projectId: "filmes-58dd8",
  storageBucket: "filmes-58dd8.firebasestorage.app",
  messagingSenderId: "553337590540",
  appId: "1:553337590540:web:151246ff77af77b51eaf29"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };