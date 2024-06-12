// src/components/MemberForm.jsx
import React from "react";

const MemberForm = ({
  member,
  setMember,
  handleAddMember,
  handleUpdateMember,
  isEditMode,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setMember((prevMember) => ({ ...prevMember, [name]: files[0] }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        isEditMode ? handleUpdateMember() : handleAddMember();
      }}
      className="bg-white p-4 shadow rounded-md"
    >
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={member.name}
        onChange={handleInputChange}
        className="mr-2 p-2 border w-full border-gray-300 mb-2"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={member.email}
        onChange={handleInputChange}
        className="mr-2 p-2 border w-full border-gray-300 mb-2"
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={member.phone}
        onChange={handleInputChange}
        className="mr-2 p-2 border w-full border-gray-300 mb-2"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={member.address}
        onChange={handleInputChange}
        className="mr-2 p-2 border w-full border-gray-300 mb-2"
        required
      />
      <label className="block mb-2">
        Birth Date
        <input
          type="date"
          name="dateOfBirth"
          value={member.dateOfBirth}
          onChange={handleInputChange}
          className="mr-2 p-2 border w-full border-gray-300 mb-2"
          required
        />
      </label>
      <label className="block mb-2">
        Profile Photo
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="mr-2 p-2 border w-full border-gray-300 mb-2"
        />
      </label>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {isEditMode ? "Update Member" : "Add Member"}
      </button>
    </form>
  );
};

export default MemberForm;
