// src/pages/Members.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchMembers,
  fetchTotalMembers,
  fetchBirthdaysThisMonth,
  fetchNewlyJoinedThisMonth,
  addMember,
  updateMember,
  deleteMember,
  setPage,
  fetchAllMembers,
} from "../store/membersSlice";
import MembersTable from "../components/members/MembersTable";
import MemberForm from "../components/members/MemberForm";
import Modal from "../components/members/Modal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SearchIcon, ChevronDownIcon } from "../components/ui/icons";

const Members = () => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.members);
  const totalMembers = useSelector((state) => state.members.total);
  const allMembers = useSelector((state) => state.members.allMembers);
  const birthdaysThisMonth = useSelector(
    (state) => state.members.birthdaysThisMonth
  );
  const newlyJoinedThisMonth = useSelector(
    (state) => state.members.newlyJoinedThisMonth
  );
  const memberStatus = useSelector((state) => state.members.status);
  const error = useSelector((state) => state.members.error);
  const page = useSelector((state) => state.members.page);
  const limit = 20; // Set the limit to 20 items per page

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    image: "", // Add image field
  });
  const [editMemberId, setEditMemberId] = useState(null);
  const [editMember, setEditMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    image: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBirthdays, setShowBirthdays] = useState(false);
  const [showNewlyJoined, setShowNewlyJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(fetchAllMembers());
    } else {
      dispatch(fetchMembers({ page, limit }));
    }
    dispatch(fetchTotalMembers());
    dispatch(fetchBirthdaysThisMonth());
    dispatch(fetchNewlyJoinedThisMonth());
  }, [dispatch, page, limit, searchQuery]);

  const handleAddMember = async () => {
    try {
      await dispatch(addMember(newMember)).unwrap();
      setNewMember({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        image: "", // Reset image field
      });
      setIsModalOpen(false);
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    }
  };

  const handleUpdateMember = async () => {
    try {
      await dispatch(
        updateMember({ id: editMemberId, ...editMember })
      ).unwrap();
      setEditMemberId(null);
      setEditMember({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        image: "",
      });
      setIsModalOpen(false);
      toast.success("Member updated successfully");
    } catch (error) {
      console.error("Failed to update member:", error);
      toast.error("Failed to update member");
    }
  };

  const handleEditClick = (member) => {
    setEditMemberId(member._id);
    setEditMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteMember(id)).unwrap();
      toast.success("Member deleted successfully");
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast.error("Failed to delete member");
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchMembers({ page: newPage, limit }));
  };

  const totalPages = Math.ceil(totalMembers / limit);

  const exportToPDF = async () => {
    try {
      await dispatch(fetchAllMembers()).unwrap();
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Image", "Name", "Email", "Phone", "Address", "Date of Birth"]],
        body: allMembers.map((member) => [
          { image: member.image, fit: [30, 30] },
          member.name,
          member.email,
          member.phone,
          member.address,
          new Date(member.dateOfBirth).toLocaleDateString(),
        ]),
      });
      doc.save("members.pdf");
    } catch (error) {
      console.error("Failed to export to PDF:", error);
      toast.error("Failed to export to PDF");
    }
  };

  const exportToExcel = async () => {
    try {
      await dispatch(fetchAllMembers()).unwrap();
      const worksheet = XLSX.utils.json_to_sheet(allMembers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, "members.xlsx");
    } catch (error) {
      console.error("Failed to export to Excel:", error);
      toast.error("Failed to export to Excel");
    }
  };

  const filteredMembers = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      return allMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(trimmedQuery) ||
          member.email.toLowerCase().includes(trimmedQuery) ||
          member.phone.toLowerCase().includes(trimmedQuery)
      );
    }
    return members;
  }, [searchQuery, members, allMembers]);

  const indexOfLastRow = page * limit;
  const indexOfFirstRow = indexOfLastRow - limit;
  const currentRows = filteredMembers.slice(indexOfFirstRow, indexOfLastRow);

  let content;

  if (memberStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (memberStatus === "succeeded") {
    content = (
      <div className="overflow-x-auto">
        <MembersTable
          members={currentRows}
          editMemberId={editMemberId}
          editMember={editMember}
          setEditMember={setEditMember}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleUpdateMember={handleUpdateMember}
        />
      </div>
    );
  } else if (memberStatus === "failed") {
    content = <div>{error}</div>;
  }

  const currentMemberStart = indexOfFirstRow + 1;
  const currentMemberEnd =
    indexOfLastRow > totalMembers ? totalMembers : indexOfLastRow;

  return (
    <div className="bg-gray-200 p-5 text-blue-950 w-full">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setEditMemberId(null); // Reset edit mode when toggling the form
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-2 md:mb-0"
        >
          {isModalOpen ? "Close Form" : "Add New Member +"}
        </button>
        <div className="flex items-center mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-l"
          />
          <button className="p-2 bg-gray-200 border border-gray-300 rounded-r">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {showBirthdays && (
        <div className="mb-4">
          <h3 className="text-lg mb-2">People with Birthdays This Month</h3>
          <ul className="list-disc list-inside">
            {birthdaysThisMonth.map((member) => (
              <li key={member._id}>
                {member.name} -{" "}
                {new Date(member.dateOfBirth).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showNewlyJoined && (
        <div className="mb-4">
          <h3 className="text-lg mb-2">Newly Joined Members This Month</h3>
          <ul className="list-disc list-inside">
            {newlyJoinedThisMonth.map((member) => (
              <li key={member._id}>
                {member.name} - Joined on{" "}
                {new Date(member.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MemberForm
          member={editMemberId ? editMember : newMember}
          setMember={editMemberId ? setEditMember : setNewMember}
          handleAddMember={handleAddMember}
          handleUpdateMember={handleUpdateMember}
          isEditMode={!!editMemberId}
        />
      </Modal>
      {content}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Showing {currentMemberStart} to {currentMemberEnd} of {totalMembers}{" "}
          results
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 mx-1 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-lg mx-2">
            {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-500 text-white px-4 py-2 mx-1 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div className="relative inline-block text-left group">
          <button className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center">
            Export <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
          <div className="hidden absolute right-0 w-48 origin-top-right bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-lg outline-none group-hover:block">
            <div className="py-1">
              <button
                onClick={exportToPDF}
                className="w-full px-4 py-2 text-sm leading-5 text-left hover:bg-blue-500 hover:text-white"
              >
                Export to PDF
              </button>
              <button
                onClick={exportToExcel}
                className="w-full px-4 py-2 text-sm leading-5 text-left hover:bg-blue-500 hover:text-white"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
