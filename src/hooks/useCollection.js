import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config.js";
import {
  collection,
  query as fsQuery,
  onSnapshot,
  where,
  orderBy as fsOrderBy,
} from "firebase/firestore";

export const useCollection = (colName, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // werden beim ersten Render "eingefroren"
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(db, colName);

    if (query) {
      ref = fsQuery(ref, where(...query));
    }

    if (orderBy) {
      ref = fsQuery(ref, fsOrderBy(...orderBy));
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setDocuments(results);
        setError(null);
      },
      (err) => {
        console.log(err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [colName, query, orderBy]);
  return { documents, error };
};
