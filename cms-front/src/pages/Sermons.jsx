// src/pages/Sermons.jsx
import React, { useState } from "react";
import SermonList from "../components/sermons/SermonsList";
import SermonForm from "../components/sermons/SermonForm";
import Modal from "../components/ui/Modal";

const Sermons = () => {
  const [editMode, setEditMode] = useState(false);
  const [currentSermon, setCurrentSermon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (sermon) => {
    setCurrentSermon(sermon);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const openForm = () => {
    setEditMode(false);
    setCurrentSermon(null);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={openForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Add Sermon
      </button>
      <Modal isOpen={isModalOpen} onClose={closeForm}>
        <SermonForm
          currentSermon={currentSermon}
          setEditMode={setEditMode}
          closeForm={closeForm}
        />
      </Modal>
      <SermonList onEdit={handleEdit} />
    </div>
  );
};

export default Sermons;
