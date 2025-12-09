import React, { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useAuthContext } from "../hooks/useAuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

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

  const { user } = useAuthContext();

  const owner = initialValues?.users?.find((u) => u.accessRight === "o") || {
    displayName: user.displayName,
    userId: user.uid,
    email: user.email,
    accessRight: "o",
  };

  // assigned users as react-select options
  const [assingedReadUsers, setAssignedReadUsers] = useState(
    (initialValues?.users || [])
      .filter((user) => user.accessRight === "r")
      .map((user) => ({
        value: user,
        label: user.email,
      }))
  );

  const [assingedModifyUsers, setAssignedModifyUsers] = useState(
    (initialValues?.users || [])
      .filter((user) => user.accessRight === "m")
      .map((user) => ({
        value: user,
        label: user.email,
      }))
  );

  const [formError, setFormError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const categoryValue = categories.find((c) => c.value === category) || null;

  // ---- helper: lookup user by email in Firestore "users" collection ----
  const findUserByEmail = async (email) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return null;

    const q = query(collection(db, "users"), where("email", "==", trimmed));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const doc = snap.docs[0];
    const data = doc.data();

    return {
      userId: doc.id,
      displayName: data.displayName,
      email: data.email,
    };
  };

  const isAlreadyAssigned = (userId) => {
    return (
      assingedReadUsers.some((opt) => opt.value.userId === userId) ||
      assingedModifyUsers.some((opt) => opt.value.userId === userId) ||
      owner.userId === userId
    );
  };

  // ---- handlers for READ users ----
  const handleCreateReadUser = async (inputValue) => {
    setEmailError(null);
    const found = await findUserByEmail(inputValue);
    if (!found) {
      setEmailError("No user with this email exists.");
      return;
    }
    if (isAlreadyAssigned(found.userId)) {
      setEmailError("User is already part of this list.");
      return;
    }

    setAssignedReadUsers((prev) => [
      ...prev,
      {
        value: { ...found, accessRight: "r" },
        label: found.displayName || found.email,
      },
    ]);
  };

  const handleChangeReadUsers = (options) => {
    setAssignedReadUsers(options || []);
  };

  // ---- handlers for MODIFY users ----
  const handleCreateModifyUser = async (inputValue) => {
    setEmailError(null);
    const found = await findUserByEmail(inputValue);
    if (!found) {
      setEmailError("No user with this email exists.");
      return;
    }
    if (isAlreadyAssigned(found.userId)) {
      setEmailError("User is already part of this list.");
      return;
    }

    setAssignedModifyUsers((prev) => [
      ...prev,
      {
        value: { ...found, accessRight: "m" },
        label: found.displayName || found.email,
      },
    ]);
  };

  const handleChangeModifyUsers = (options) => {
    setAssignedModifyUsers(options || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    setEmailError(null);

    //the category select is required
    if (!category) {
      setFormError("A category is required.");
      return;
    }

    const assignedUserList = [
      ...assingedModifyUsers.map((user) => {
        return {
          displayName: user.value.displayName,
          userId: user.value.userId,
          email: user.value.email,
          accessRight: "m",
        };
      }),
      ...assingedReadUsers.map((user) => {
        return {
          displayName: user.value.displayName,
          userId: user.value.userId,
          email: user.value.email,
          accessRight: "r",
        };
      }),
      owner,
    ];

    const userIds = assignedUserList.map((user) => user.userId);

    onSubmit({
      category,
      title,
      description,
      users: assignedUserList,
      userIds,
    });
  };

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
        <span>Read Access Users (type email, press Enter)</span>
        <CreatableSelect
          isMulti
          value={assingedReadUsers}
          onChange={handleChangeReadUsers}
          onCreateOption={handleCreateReadUser}
          options={[]} // no global user list
          placeholder="Type email and press Enter"
        />
      </label>

      <label>
        <span>Modify Access Users (type email, press Enter)</span>
        <CreatableSelect
          isMulti
          value={assingedModifyUsers}
          onChange={handleChangeModifyUsers}
          onCreateOption={handleCreateModifyUser}
          options={[]} // no global user list
          placeholder="Type email and press Enter"
        />
      </label>

      {emailError && <p className="error">{emailError}</p>}
      {formError && <p className="error">{formError}</p>}

      <button>{initialValues ? "Update List" : "Create List"}</button>
    </form>
  );
};

export default ListForm;
