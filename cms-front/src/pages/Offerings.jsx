import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OfferingForm from "../components/offerings/OfferingForm";
import OfferingsTable from "../components/offerings/OfferingsTable";
import Modal from "../components/offerings/Modal";
import {
  fetchOfferings,
  fetchTotalOffering,
  addOffering,
  updateOffering,
  deleteOffering,
  setPage,
} from "../store/offeringsSlice";
import { fetchAllMembers } from "../store/membersSlice";
import { ChevronDownIcon } from "../components/ui/icons";

const Offerings = () => {
  const dispatch = useDispatch();
  const offerings = useSelector((state) => state.offerings.offerings) || [];
  const totalOffering =
    useSelector((state) => state.offerings.totalOffering) || 0;
  const members = useSelector((state) => state.members.allMembers);
  const offeringStatus = useSelector((state) => state.offerings.status);
  const error = useSelector((state) => state.offerings.error);
  const page = useSelector((state) => state.offerings.page);
  const limit = 10; // Set the limit to 10 items per page

  const [newOffering, setNewOffering] = useState({
    amount: "",
    member: "",
    date: "",
    details: "",
  });
  const [editOfferingId, setEditOfferingId] = useState(null);
  const [editOffering, setEditOffering] = useState({
    amount: "",
    member: "",
    date: "",
    details: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchOfferings({ page, limit }));
    dispatch(fetchTotalOffering());
    dispatch(fetchAllMembers());
  }, [dispatch, page, limit]);

  const handleAddOffering = async (offering) => {
    try {
      await dispatch(addOffering(offering)).unwrap();
      setNewOffering({
        amount: "",
        member: "",
        date: "",
        details: "",
      });
      setIsModalOpen(false);
      toast.success("Offering added successfully");
    } catch (error) {
      console.error("Failed to add offering:", error);
      toast.error("Failed to add offering");
    }
  };

  const handleUpdateOffering = async (offering) => {
    try {
      await dispatch(
        updateOffering({ id: editOfferingId, ...offering })
      ).unwrap();
      setEditOfferingId(null);
      setEditOffering({
        amount: "",
        member: "",
        date: "",
        details: "",
      });
      setIsModalOpen(false);
      toast.success("Offering updated successfully");
    } catch (error) {
      console.error("Failed to update offering:", error);
      toast.error("Failed to update offering");
    }
  };

  const handleEditClick = (offering) => {
    setEditOfferingId(offering._id);
    setEditOffering(offering);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteOffering(id)).unwrap();
      toast.success("Offering deleted successfully");
    } catch (error) {
      console.error("Failed to delete offering:", error);
      toast.error("Failed to delete offering");
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchOfferings({ page: newPage, limit }));
  };

  const handleDateFilter = () => {
    dispatch(fetchOfferings({ page, limit, startDate, endDate }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Member", "Amount", "Date", "Details"]],
      body: offerings.map((offering) => [
        offering.member ? offering.member.name : "Unknown Member",
        `$${offering.amount.toFixed(2)}`,
        new Date(offering.date).toLocaleDateString(),
        offering.details,
      ]),
    });
    doc.save("offerings.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      offerings.map((offering) => ({
        Member: offering.member ? offering.member.name : "Unknown Member",
        Amount: `$${offering.amount.toFixed(2)}`,
        Date: new Date(offering.date).toLocaleDateString(),
        Details: offering.details,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offerings");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "offerings.xlsx");
  };

  const totalPages = Math.ceil(totalOffering / limit);
  const currentOfferingStart = (page - 1) * limit + 1;
  const currentOfferingEnd =
    page * limit > totalOffering ? totalOffering : page * limit;

  let content;

  if (offeringStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (offeringStatus === "succeeded") {
    content = (
      <div className="overflow-x-auto">
        <OfferingsTable
          offerings={offerings}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      </div>
    );
  } else if (offeringStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div className="bg-gray-200 p-5 text-blue-950 w-full">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setEditOfferingId(null); // Reset edit mode when toggling the form
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-2 md:mb-0"
        >
          {isModalOpen ? "Close Form" : "Add New Offering +"}
        </button>
        <div className="flex items-center mb-2 md:mb-0">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="ml-4 mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleDateFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
          >
            Filter
          </button>
        </div>
        <h2 className="text-xl mb-4">
          Total Offering: Rs {totalOffering ? totalOffering.toFixed(2) : "0.00"}
        </h2>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <OfferingForm
          members={members}
          offering={editOfferingId ? editOffering : newOffering}
          setOffering={editOfferingId ? setEditOffering : setNewOffering}
          handleSubmit={
            editOfferingId ? handleUpdateOffering : handleAddOffering
          }
          isEditMode={!!editOfferingId}
        />
      </Modal>
      {content}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Showing {currentOfferingStart} to {currentOfferingEnd} of{" "}
          {totalOffering} results
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

export default Offerings;
