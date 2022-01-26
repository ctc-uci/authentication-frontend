import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// Other useful imports from 'firebase/auth':
// - GoogleAuthProvider
// - signInWithPopup
// - createUserWithEmailAndPassword
// - sendPasswordResetEmail

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

// Adapted from: https://blog.logrocket.com/user-authentication-firebase-react-apps/
// Using Firebase Web version 9

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signInWithGoogle = async () => {
  // TODO
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Sign in success');
  } catch (err) {
    alert(err.message);
  }
};

const createUserInFirebase = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (err) {
    alert(err.message);
    return err;
  }
};

const createUserInDB = async userObject => {
  try {
    // Replace line below with call to NPO DB
    // const res = await WMKBackend.post('/register/create', userObject);
    // return res;
  } catch (err) {
    const { email, password } = userObject;

    // since this route is called after user is created in firebase, if this
    // route errors out, that means we have to discard the created firebase object
    await signInWithEmailAndPassword(auth, email, password);
    const userToBeTerminated = await auth.currentUser;
    userToBeTerminated.delete();

    throw new Error(err);
  }
};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    createUserInFirebase(email, password);
    createUserInDB({ email, password });
  } catch (err) {
    alert(err.message);
  }
};

const sendPasswordReset = async () => {
  // TODO
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
