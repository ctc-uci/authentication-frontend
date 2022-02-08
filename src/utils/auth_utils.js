import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { cookieKeys, cookieConfig, clearCookies } from './cookie_utils';

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

/**
 * Signs a user in with Google using Firebase
 * @returns A boolean indicating whether or not the user is new
 */
const signInWithGoogle = async (newUserRedirectPath, defaultRedirectPath, navigate, cookies) => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const newUser = getAdditionalUserInfo(userCredential).isNewUser;
  if (newUser) {
    navigate(newUserRedirectPath);
  } else {
    navigate(defaultRedirectPath);
  }
  cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
};

/**
 * Logs a user in with email and password
 * @param {string} email The email to log in with
 * @param {string} password The password to log in with
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @param {Cookies} cookies The user's cookies to populate
 * @returns A boolean indicating whether or not the log in was successful
 */
const logInWithEmailAndPassword = async (email, password, redirectPath, navigate, cookies) => {
  await signInWithEmailAndPassword(auth, email, password);
  navigate(redirectPath);
  cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
};

const createUserInFirebase = async (email, password) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  sendEmailVerification(user.user);
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
  await createUserInFirebase(email, password);
  createUserInDB({ email, password });
};

const registerWithEmailAndPassword = async (
  email,
  password,
  checkPassword,
  navigate,
  redirectPath,
) => {
  if (password !== checkPassword) {
    throw new Error("Passwords don't match");
  }
  await createUser(email, password);
  navigate(redirectPath);
};

/**
 * Sends a password reset email given an email
 * @param {string} email The email to resend password to
 */
const sendPasswordReset = async email => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Logs a user out
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 */
const logout = async (redirectPath, navigate, cookies) => {
  await signOut(auth);
  clearCookies(cookies);
  navigate(redirectPath);
};

export {
  auth,
  useNavigate,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
