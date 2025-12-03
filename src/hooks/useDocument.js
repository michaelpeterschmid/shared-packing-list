/*This hook encapsulates logic for reading a document in realtime, it exports a method with parameters to read a document 
This method either returns the documents or an error */
/* 

doc() creates a reference to a Firestore document.
getDoc() reads a Firestore document one time and returns a snapshot. 
*/
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config.js";
import { doc, onSnapshot } from "firebase/firestore";

export const useDocument = (colName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ref = doc(db, colName, id);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("No such document exits!");
          return;
        }
        setDocument({ ...snapshot.data(), id: snapshot.id });
        setError(null);
      },
      (err) => {
        console.log(err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [colName, id]);
  return { document, error };
};
