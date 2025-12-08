import React, { useState } from "react";
import Select from "react-select/base";

const ListForm = ({ initialValues, onSubmit }) => {
  //state
  const [category, setCategory] = useState(initialValues?.category || "");
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [assignedUsers, setAssignedUsers] = useState(
    initialValues?.assignedUsers || []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, title, description, assignedUsers });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
        />
      </label>
      <label>
        <span>Category</span>
        <input
          type="text"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
      </label>
      <label>
        <span>Description</span>
        <textarea
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </label>
      <label>
        <span>Read Access Users</span>
        <input type="text" />
      </label>
      <label>
        <span>Modify Access Users</span>
        <input type="text" />
      </label>
      <button>{initialValues ? "Update List" : "Create List"}</button>
    </form>
  );
};

export default ListForm;
