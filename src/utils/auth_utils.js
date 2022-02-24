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
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { cookieKeys, cookieConfig, clearCookies, setCookie } from './cookie_utils';

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

const addRoleToCookies = async () => {
  const user = await NPOBackend.get(`/users/${auth.currentUser.uid}`);
  setCookie(cookieKeys.ROLE, user.data.user.role, cookieConfig);
};

const createUserInDB = async (email, userId, role, signUpWithGoogle, password = null) => {
  try {
    if (signUpWithGoogle) {
      await NPOBackend.post('/users/create', { email, userId, role, registered: false });
    } else {
      await NPOBackend.post('/users/create', { email, userId, role, registered: true });
    }
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
const signInWithGoogle = async (newUserRedirectPath, defaultRedirectPath, navigate) => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const newUser = getAdditionalUserInfo(userCredential).isNewUser;
  setCookie(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
  if (newUser) {
    await createUserInDB(auth.currentUser.email, userCredential.user.uid, 'General', true);
    await addRoleToCookies();
    navigate(newUserRedirectPath);
  } else {
    await addRoleToCookies();
    const user = await NPOBackend.get(`/users/${auth.currentUser.uid}`);
    if (!user.data.user.registered) {
      navigate(newUserRedirectPath);
    } else {
      navigate(defaultRedirectPath);
    }
  }
};

const finishGoogleLoginRegistration = async (redirectPath, navigate) => {
  await NPOBackend.put(`/users/update/${auth.currentUser.uid}`);
  navigate(redirectPath);
};

/**
 * Logs a user in with email and password
 * @param {string} email The email to log in with
 * @param {string} password The password to log in with
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @returns A boolean indicating whether or not the log in was successful
 */
const logInWithEmailAndPassword = async (email, password, redirectPath, navigate) => {
  await signInWithEmailAndPassword(auth, email, password);

  // Check if the user has verified their email.
  if (!auth.currentUser.emailVerified) {
    throw new Error('Please verify your email before logging in.');
  }

  setCookie(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
  await addRoleToCookies();
  navigate(redirectPath);
};

const createUserInFirebase = async (email, password) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  return user.user;
};

const createUser = async (email, role, password) => {
  const user = await createUserInFirebase(email, password);
  await createUserInDB(email, user.uid, role, false, password);
  sendEmailVerification(user);
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

/**
 * Sends a password reset email given an email
 * @param {string} email The email to resend password to
 */
const sendPasswordReset = async email => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Sends password reset to new account created with stated email
 * @param {string} email The email to create an account with
 */
const sendInviteLink = async (email, role) => {
  // generate a random password (not going to be used as new account will reset password)
  const randomPassword = Math.random().toString(36).slice(-8);
  const user = await createUserInFirebase(email, randomPassword);
  createUserInDB(email, user.uid, role, false, randomPassword);
  sendPasswordReset(email);
};

/**
 * Completes the password reset process, given a confirmation code and new password
 * @param {string} code The confirmation code sent via email to the user
 * @param {string} newPassowrd The new password
 * @param {string} checkPassword The re-entered password
 */
const confirmNewPassword = async (code, newPassword, checkPassword) => {
  if (newPassword !== checkPassword) {
    throw new Error("Passwords don't match");
  }
  await confirmPasswordReset(auth, code, newPassword);
};

/**
 * Applies a verification code sent to the user by email or other out-of-band mechanism.
 * @param {string} code The confirmation code sent via email to the user
 */
const confirmVerifyEmail = async code => {
  await applyActionCode(auth, code);
};

/**
 * Logs a user out
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 */
const logout = async (redirectPath, navigate) => {
  await signOut(auth);
  clearCookies();
  navigate(redirectPath);
};

/**
 * Returns the current user synchronously
 * @param {Auth} authInstance
 * @returns The current user (or undefined)
 */
const getCurrentUser = authInstance =>
  new Promise((resolve, reject) => {
    const unsubscribe = authInstance.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });

export {
  auth,
  useNavigate,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getCurrentUser,
  sendInviteLink,
  confirmNewPassword,
  confirmVerifyEmail,
  finishGoogleLoginRegistration,
};
