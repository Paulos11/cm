import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpensesTable from "../components/expenses/ExpensesTable";
import Modal from "../components/ui/Modal";
import {
  fetchExpenses,
  fetchTotalExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setPage,
} from "../store/expensesSlice";
import { fetchTotalOffering } from "../store/offeringsSlice";
import { ChevronDownIcon } from "../components/ui/icons";

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses) || [];
  const totalExpenses =
    useSelector((state) => state.expenses.totalExpenses) || 0;
  const totalOffering =
    useSelector((state) => state.offerings.totalOffering) || 0;
  const expenseStatus = useSelector((state) => state.expenses.status);
  const error = useSelector((state) => state.expenses.error);
  const page = useSelector((state) => state.expenses.page);
  const limit = 10; // Set the limit to 10 items per page

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    details: "",
  });
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    amount: "",
    category: "",
    date: "",
    details: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchExpenses({ page, limit }));
    dispatch(fetchTotalExpenses());
    dispatch(fetchTotalOffering());
  }, [dispatch, page, limit]);

  const handleAddExpense = async (expense) => {
    try {
      await dispatch(addExpense(expense)).unwrap();
      setNewExpense({
        amount: "",
        category: "",
        date: "",
        details: "",
      });
      setIsModalOpen(false);
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const handleUpdateExpense = async (expense) => {
    try {
      await dispatch(updateExpense({ id: editExpenseId, ...expense })).unwrap();
      setEditExpenseId(null);
      setEditExpense({
        amount: "",
        category: "",
        date: "",
        details: "",
      });
      setIsModalOpen(false);
      toast.success("Expense updated successfully");
    } catch (error) {
      console.error("Failed to update expense:", error);
      toast.error("Failed to update expense");
    }
  };

  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id);
    setEditExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchExpenses({ page: newPage, limit }));
  };

  const handleDateFilter = () => {
    dispatch(fetchExpenses({ page, limit, startDate, endDate }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Category", "Amount", "Date", "Details"]],
      body: expenses.map((expense) => [
        expense.category,
        `Rs ${expense.amount.toFixed(2)}`,
        new Date(expense.date).toLocaleDateString(),
        expense.details,
      ]),
    });
    doc.save("expenses.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      expenses.map((expense) => ({
        Category: expense.category,
        Amount: `Rs ${expense.amount.toFixed(2)}`,
        Date: new Date(expense.date).toLocaleDateString(),
        Details: expense.details,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "expenses.xlsx");
  };

  const totalPages = Math.ceil(expenses.length / limit);
  const remainingFunds = totalOffering - totalExpenses;

  let content;

  if (expenseStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (expenseStatus === "succeeded") {
    content = (
      <div className="overflow-x-auto">
        <ExpensesTable
          expenses={expenses}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      </div>
    );
  } else if (expenseStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div className="bg-gray-200 p-5 text-blue-950 w-full">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setEditExpenseId(null); // Reset edit mode when toggling the form
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-2 md:mb-0"
        >
          {isModalOpen ? "Close Form" : "Add New Expense +"}
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
        <div>
          <h2 className="text-xl mb-2">
            Total Fund: Rs {totalOffering.toFixed(2)}
          </h2>
          <h2 className="text-xl mb-2">
            Total Expenses: Rs {totalExpenses.toFixed(2)}
          </h2>
          <h2 className="text-xl mb-4">
            Remaining Fund: Rs {remainingFunds.toFixed(2)}
          </h2>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ExpenseForm
          expense={editExpenseId ? editExpense : newExpense}
          setExpense={editExpenseId ? setEditExpense : setNewExpense}
          handleSubmit={editExpenseId ? handleUpdateExpense : handleAddExpense}
          isEditMode={!!editExpenseId}
        />
      </Modal>
      {content}
      <div className="flex justify-between mt-4">
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 mx-4 rounded"
          >
            Previous
          </button>
          <span className="text-lg">
            {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-500 text-white px-4 py-2 mx-4 rounded"
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

export default Expenses;
