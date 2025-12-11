// this hook lets us add, update and delete documents

import { useReducer, useEffect, useRef } from "react";
import { db } from "../firebase/config";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";

const initialState = {
  isPending: false,
  error: null,
  success: false,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, error: null, success: false };

    case "SUCCESS":
      return { isPending: false, error: null, success: true };

    case "ERROR":
      return { isPending: false, error: action.payload, success: false };

    default:
      return state;
  }
};

export const useFirestore = (colName) => {
  const { user } = useAuthContext();
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const isCancelled = useRef(false);

  // collection ref
  const ref = collection(db, colName);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled.current) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (docData) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const updatedAt = serverTimestamp();
      const updatedBy = user.displayName;
      const userId = user.uid;
      const addedDocRef = await addDoc(ref, {
        ...docData,
        updatedAt,
        updatedBy,
        userId,
      });

      dispatchIfNotCancelled({ type: "SUCCESS" });

      // falls die ID gebraucht wird (z.B. zum Navigieren)
      return addedDocRef;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return null;
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await deleteDoc(doc(ref, id));
      dispatchIfNotCancelled({ type: "SUCCESS" });
      return true;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
      return false;
    }
  };

  // update documents
  const updateDocument = async (id, updates, leave = false) => {
    dispatch({ type: "IS_PENDING" });

    if (leave) {
      try {
        await updateDoc(doc(ref, id), {
          ...updates,
        });

        dispatchIfNotCancelled({ type: "SUCCESS" });
        return true;
      } catch (error) {
        console.log(error);
        dispatchIfNotCancelled({
          type: "ERROR",
          payload: error.message,
        });
        return false;
      }
    }

    try {
      const updatedAt = serverTimestamp();
      const updatedBy = user.displayName;
      const userId = user.uid;
      await updateDoc(doc(ref, id), {
        ...updates,
        updatedAt,
        updatedBy,
        userId,
      });

      dispatchIfNotCancelled({ type: "SUCCESS" });
      return true;
    } catch (error) {
      console.log(error);
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
      return false;
    }
  };

  useEffect(() => {
    isCancelled.current = false; // important in StrictMode because React mounts component, runs effects, then immediately runs the cleanup function to simulate unmounts, and then runs the effect again, which causes the isCancelled.current to be true without this line!

    return () => {
      isCancelled.current = true;
    };
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
