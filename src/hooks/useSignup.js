/* This hook encapsulates signup logic; it returns an object with a signup method and some state */

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./useAuthContext";

// import initialized services from your config
import { auth, db } from "../firebase/config";

// firebase auth functions
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// firestore functions
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const useSignup = () => {
  const isCancelled = useRef(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (displayName, email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      await updateProfile(res.user, { displayName });

      await dispatch({ type: "LOGIN", payload: res.user });

      await setDoc(doc(db, "users", res.user.uid), {
        online: true,
        displayName,
        email: res.user.email,
        lastLogin: Timestamp.fromDate(new Date()),
      });

      if (!isCancelled.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled.current) {
        setIsPending(false);
        setError(error.code || error.message);
      }
    }
  };

  const signupWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());

      if (!res) {
        throw new Error("Could not complete signup");
      }
      await dispatch({ type: "LOGIN", payload: res.user });

      await setDoc(doc(db, "users", res.user.uid), {
        online: true,
        displayName: res.user.displayName,
        email: res.user.email,
        lastLogin: Timestamp.fromDate(new Date()),
      });

      if (!isCancelled.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled.current) {
        setIsPending(false);
        setError(error.code || error.message);
      }
    }
  };

  useEffect(() => {
    isCancelled.current = false;
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return { signup, signupWithGoogle, error, isPending };
};
