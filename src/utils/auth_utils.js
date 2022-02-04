import axios from 'axios';
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

const NPOBackend = axios.create({
  baseURL: 'http://localhost:3001', // Replace baseURL with NPO-specific URL
  withCredentials: true,
});

const addRoleToCookies = async cookies => {
  const user = await NPOBackend.get(`/users/${auth.currentUser.email}`);
  cookies.set(cookieKeys.ROLE, user.data.user.role, cookieConfig);
};

const createUserInDB = async (email, userId, role, signUpWithGoogle, password = null) => {
  try {
    await NPOBackend.post('/users/create', { email, userId, role });
  } catch (err) {
    // Since this route is called after user is created in firebase, if this
    // route errors out, that means we have to discard the created firebase object
    if (!signUpWithGoogle) {
      await signInWithEmailAndPassword(auth, email, password);
    }
    const userToBeTerminated = await auth.currentUser;
    userToBeTerminated.delete();

    throw new Error(err.message);
  }
};

/**
 * Signs a user in with Google using Firebase
 * @returns A boolean indicating whether or not the user is new
 */
const signInWithGoogle = async (newUserRedirectPath, defaultRedirectPath, navigate, cookies) => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const newUser = getAdditionalUserInfo(userCredential).isNewUser;
  if (newUser) {
    createUserInDB(auth.currentUser.email, userCredential.user.uid, 'General', true);
    navigate(newUserRedirectPath);
  } else {
    navigate(defaultRedirectPath);
  }
  cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
  addRoleToCookies(cookies);
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
  addRoleToCookies(cookies);
};

const createUserInFirebase = async (email, password) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  sendEmailVerification(user.user);
  return user.user.uid;
};

const createUser = async (email, role, password) => {
  const userId = await createUserInFirebase(email, password);
  createUserInDB(email, userId, role, password);
};

const registerWithEmailAndPassword = async (
  email,
  role,
  password,
  checkPassword,
  navigate,
  redirectPath,
) => {
  if (password !== checkPassword) {
    throw new Error("Passwords don't match");
  }
  await createUser(email, role, password);
  navigate(redirectPath);
};

const sendPasswordReset = async () => {
  // TODO
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
