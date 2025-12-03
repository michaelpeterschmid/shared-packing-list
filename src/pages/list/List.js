import React from "react";
import { useParams } from "react-router-dom";

//custom hook to read a document in realtime
import { useDocument } from "../../hooks/useDocument.js";

const List = () => {
  const { id } = useParams();
  const { document, error } = useDocument("lists", id);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div>
      <h4>{document.title}</h4>
    </div>
  );
};

export default List;
