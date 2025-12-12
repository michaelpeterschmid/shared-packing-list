/* This hook encapsulates logout logic: it returns an object with a logout method and some state */
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
  const isCancelled = useRef(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    //: guard if somehow called without user
    if (!user) return;

    setError(null);
    setIsPending(true);

    try {
      

      await updateDoc(doc(db, "users", user.uid), {
        online: false,
      });

      await dispatch({ type: "LOGOUT" });

      await signOut(auth);

      if (!isCancelled.current) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled.current) {
        console.error("Logout error:", err);
        setError(err.code || err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    isCancelled.current = false;
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return { logout, error, isPending };
};
