import React, { useState } from "react";
import Select from "react-select";
import styles from "./Dashboard.module.css";

const filters = [
  { value: "all", label: "All" },
  { value: "owned by me", label: "Owned by me" },
  { value: "shopping", label: "Shopping" },
  { value: "packing", label: "Packing" },
  { value: "todos", label: "Todos" },
  { value: "other", label: "Other" },
];


const ListFilter = ({ changeCurrentFilter }) => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const handleChange = (option) => {
    filterValue = option;
    setCurrentFilter(option.value);
    changeCurrentFilter(option.value);
  };
  let filterValue = filters.find((filter) => filter.value === currentFilter)

  return (
    <div className={styles["list-filter"]}>
      <h4>Filter</h4>
      <Select
        value={filterValue}
        options={filters}
        onChange={(option) => handleChange(option)}></Select>
    </div>
  );
};

export default ListFilter;
