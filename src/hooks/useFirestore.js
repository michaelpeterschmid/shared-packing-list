// this hook lets us add, update and delete documents

import { useReducer, useEffect, useRef } from "react";
import { db, timestamp } from "../firebase/config";
import { doc, addDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";

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
      const createdAt = timestamp.fromDate(new Date());
      const addedDocRef = await addDoc(ref, { ...docData, createdAt });

      dispatchIfNotCancelled({ type: "SUCCESS" });

      // falls du die ID brauchst (z.B. zum Navigieren)
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
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await updateDoc(doc(ref, id), updates);

      dispatchIfNotCancelled({ type: "SUCCESS" });
      return true;
    } catch (error) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
      return false;
    }
  };

  useEffect(() => {
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
