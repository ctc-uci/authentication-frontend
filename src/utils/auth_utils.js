import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
    sendEmailVerification(user.user);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createUserInDB = async userObject => {
  try {
    // Replace line below with call to NPO DB
    // const res = await WMKBackend.post('/register/create', userObject);
    // return res;
  } catch (err) {
    const { email, password } = userObject;

    // Since this route is called after user is created in firebase, if this
    // route errors out, that means we have to discard the created firebase object
    await signInWithEmailAndPassword(auth, email, password);
    const userToBeTerminated = await auth.currentUser;
    userToBeTerminated.delete();

    throw new Error(err.message);
  }
};

const createUser = async (email, password) => {
  try {
    await createUserInFirebase(email, password);
    createUserInDB({ email, password });
  } catch (err) {
    throw new Error(err.message);
  }
};

const signInWithGoogle = () => {};

const registerWithEmailAndPassword = async (
  email,
  password,
  checkPassword,
  navigate,
  redirectPath,
) => {
  try {
    if (password !== checkPassword) {
      throw new Error("Passwords don't match");
    }
    await createUser(email, password);
    navigate(redirectPath);
  } catch (error) {
    throw new Error(error);
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
