import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSermon } from "../store/sermonsSlice";

const AddSermon = () => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSermon({ title }));
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add Sermon</button>
    </form>
  );
};

export default AddSermon;
