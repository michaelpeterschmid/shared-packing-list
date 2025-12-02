import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      //update the online status
      const { uid } = user;
      await updateDoc(doc(db, "users", uid), {
        online: false,
      });

      // sign the user out
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: "LOGOUT" });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
