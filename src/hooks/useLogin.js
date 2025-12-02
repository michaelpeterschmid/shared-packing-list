import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./useAuthContext";

// import initialized services from config
import { auth, db } from "../firebase/config";

// firebase auth functions
import { signInWithEmailAndPassword } from "firebase/auth";

// firestore functions
import { doc, setDoc, Timestamp } from "firebase/firestore";

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
      await setDoc(doc(db, "users", res.user.uid), {
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

  return { login, error, isPending };
};
