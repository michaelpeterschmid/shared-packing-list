/* This hook encapsulates singup logic it returns an object that has a signup method and some states*/

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./useAuthContext";

// import initialized services from your config
import { auth, db } from "../firebase/config";

// firebase auth functions
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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

      await updateProfile(res.user, {
        displayName,
      });
      //create or overwrite a doc
      await setDoc(doc(db, "users", res.user.uid), {
        online: true,
        displayName,
        lastLogin: Timestamp.fromDate(new Date()),
      });

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      setIsPending(false);
      setError(error.code);
    }
  };

  useEffect(() => {
    isCancelled.current = false;
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return { signup, error, isPending };
};
