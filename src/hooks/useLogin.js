/*This hook encapsulates login logic it return an object with a login method and some state*/

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./useAuthContext";

// import initialized services from config
import { auth, db } from "../firebase/config";

// firebase auth functions
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";

// firestore functions
import { doc, updateDoc, Timestamp } from "firebase/firestore";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const isCancelled = useRef(false);
  const { dispatch } = useAuthContext();

  useEffect(() => {
    // mark as mounted
    isCancelled.current = false; //When we do isCancelled.current = true in the cleanup, we mutate the same object the async function is holding.
    return () => {
      // mark as unmounted
      isCancelled.current = true;
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // update auth context
      dispatch({ type: "LOGIN", payload: res.user });

      // update firestore user doc
      await updateDoc(doc(db, "users", res.user.uid), {
        online: true,
        lastLogin: Timestamp.fromDate(new Date()),
      });

      if (!isCancelled.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled.current) {
        setError(err.code || err.message);
        setIsPending(false);
      }
    } finally {
      console.log("login finished");
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      const info = getAdditionalUserInfo(res);

      //block new google accounts since we assumen here that there is already a firestore document for the user ready
      if (info?.isNewUser) {
        // Immediately sign them out
        await auth.signOut();
        throw new Error(
          "This Google account is not registered. Go to signup first."
        );
      }

      // update auth context
      dispatch({ type: "LOGIN", payload: res.user });

      // update firestore user doc
      await updateDoc(doc(db, "users", res.user.uid), {
        online: true,
        lastLogin: Timestamp.fromDate(new Date()),
      });

      if (!isCancelled.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled.current) {
        setError(err.code || err.message);
        setIsPending(false);
      }
    } finally {
      console.log("login finished");
    }
  };

  return { login, loginWithGoogle, error, isPending };
};
