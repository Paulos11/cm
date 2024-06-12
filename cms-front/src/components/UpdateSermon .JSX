import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSermon } from "./sermonsSlice";

const UpdateSermon = ({ id, existingTitle }) => {
  const [title, setTitle] = useState(existingTitle);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSermon({ id, sermon: { title } }));
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
      <button type="submit">Update Sermon</button>
    </form>
  );
};

export default UpdateSermon;
