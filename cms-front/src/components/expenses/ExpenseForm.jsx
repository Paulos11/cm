import React, { useState, useEffect } from "react";

const ExpenseForm = ({ expense, setExpense, handleSubmit, isEditMode }) => {
  const [defaultDate, setDefaultDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDefaultDate(formattedDate);
    if (!expense.date) {
      setExpense((prevExpense) => ({ ...prevExpense, date: formattedDate }));
    }
  }, [expense.date, setExpense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      // Remove commas for validation and conversion
      const numericValue = value.replace(/,/g, "");
      if (/[^0-9.]/.test(numericValue)) {
        setErrorMessage("Amount should only contain numbers.");
      } else {
        setErrorMessage("");
        setExpense((prevExpense) => ({ ...prevExpense, [name]: numericValue }));
      }
    } else {
      setExpense((prevExpense) => ({ ...prevExpense, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      ...expense,
      amount: parseFloat(expense.amount.replace(/,/g, "")), // Ensure amount is a number
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-6 shadow rounded-md max-w-md mx-auto"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={expense.date || defaultDate}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Details
        </label>
        <textarea
          name="details"
          placeholder="Details"
          value={expense.details}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200"
      >
        {isEditMode ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;
