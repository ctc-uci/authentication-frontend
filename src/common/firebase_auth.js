import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAdgf6L3qcJ7M1k4pGqDEwj755wGNuhRi4',
  authDomain: 'auth-dev-90d20.firebaseapp.com',
  projectId: 'auth-dev-90d20',
  storageBucket: 'auth-dev-90d20.appspot.com',
  messagingSenderId: '568087711382',
  appId: '1:568087711382:web:efda8f295499cdad0c3cb7',
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

const firebaseAuth = firebase;
export default firebaseAuth;
