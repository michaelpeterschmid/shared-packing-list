import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";

const categories = [
  { value: "packing", label: "Packing" },
  { value: "shopping", label: "Shopping" },
  { value: "todos", label: "Todos" },
  { value: "other", label: "Other" },
];

const ListForm = ({ initialValues, onSubmit }) => {
  //state
  const [category, setCategory] = useState(initialValues?.category || "");
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );

  const [assingedReadUsers, setAssignedReadUsers] = useState(
    (initialValues?.users || [])
      .filter((user) => user.accessRight === "r")
      .map((user) => ({ value: user, label: user.email }))
  );

  const { user } = useAuthContext();

  const owner = initialValues?.users.find((u) => u.accessRight === "o") || {
    displayName: user.displayName,
    userId: user.uid,
    email: user.email,
    accessRight: "o",
  };

  const [assingedModifyUsers, setAssignedModifyUsers] = useState(
    (initialValues?.users || [])
      .filter((user) => user.accessRight === "m")
      .map((user) => ({ value: user, label: user.email }))
  );

  const [formError, setFormError] = useState(null);

  const categoryValue = categories.find((c) => c.value === category) || null;

  const [unassignedUsers, setUnassignedUsers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //the category select is required
    if (category === "" || !category) {
      setFormError("A category is required.");
      return;
    }

    const assignedUserList = [
      ...assingedModifyUsers.map((user) => {
        return {
          displayName: user.value.displayName,
          userId: user.value.id,
          email: user.value.email,
          accessRight: "m",
        };
      }),
      ...assingedReadUsers.map((user) => {
        return {
          displayName: user.value.displayName,
          userId: user.value.id,
          email: user.value.email,
          accessRight: "r",
        };
      }),
      owner,
    ];

    onSubmit({ category, title, description, users: assignedUserList });
  };

  //Create readUserArray of objects
  //user collection
  const { documents: userDocs } = useCollection("users");

  useEffect(() => {
    if (!userDocs) return; //stop here if there are no documents

    const includedUserEmailArray = [
      ...assingedReadUsers?.map((user) => user.label),
      ...assingedModifyUsers?.map((user) => user.label),
      owner.email, //excluding the owner from selecting
    ];
    const unassignedUserObjectArray = userDocs
      .filter((user) => !includedUserEmailArray.includes(user.email))
      .map((user) => {
        return { value: user, label: user.email };
      });
    setUnassignedUsers(unassignedUserObjectArray);
  }, [userDocs, assingedModifyUsers, assingedReadUsers]);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          required
        />
      </label>
      <label>
        <span>Category</span>
        <Select
          options={categories}
          value={categoryValue} //react-select expects the value prop to be an option object (or array of them)
          onChange={(option) => setCategory(option.value)}
        />
      </label>
      <label>
        <span>Description</span>
        <textarea
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
      </label>
      <label>
        <span>Read Access Users</span>
        <Select
          value={assingedReadUsers}
          options={unassignedUsers}
          onChange={(option) => setAssignedReadUsers(option)}
          isMulti></Select>
      </label>
      <label>
        <span>Modify Access Users</span>
        <Select
          value={assingedModifyUsers}
          options={unassignedUsers}
          onChange={(option) => setAssignedModifyUsers(option)}
          isMulti></Select>
      </label>
      <button>{initialValues ? "Update List" : "Create List"}</button>
      {formError && <p className="error">{formError}</p>}
    </form>
  );
};

export default ListForm;
