// src/components/MembersTable.jsx
import React from "react";
import { FilePenIcon, TrashIcon } from "../ui/icons";

const MembersTable = ({
  members,
  editMemberId,
  editMember,
  setEditMember,
  handleEditClick,
  handleDeleteClick,
  handleUpdateMember,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEditMember((prevMember) => ({ ...prevMember, [name]: files[0] }));
  };

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          <th className="py-2 px-4 text-left">Image</th>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Phone</th>
          <th className="py-2 px-4 text-left">Address</th>
          <th className="py-2 px-4 text-left">Date of Birth</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member._id} className="border-t hover:bg-gray-50">
            <td className="py-2 px-4 text-left">
              {member.image && (
                <img
                  src={`http://localhost:5009/${member.image.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path/to/default/image.jpg";
                  }}
                />
              )}
            </td>
            <td className="py-2 px-4 text-left">{member.name}</td>
            <td className="py-2 px-4 text-left">{member.email}</td>
            <td className="py-2 px-4 text-left">{member.phone}</td>
            <td className="py-2 px-4 text-left">{member.address}</td>
            <td className="py-2 px-4 text-left">
              {new Date(member.dateOfBirth).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 text-left flex items-center gap-2">
              <>
                <button
                  onClick={() => handleEditClick(member)}
                  className="text-gray-800 flex items-center"
                >
                  <FilePenIcon className="ml-2 w-4 h-4 text-xs" />
                </button>
                <button
                  onClick={() => handleDeleteClick(member._id)}
                  className="text-red-600 flex items-center"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersTable;
