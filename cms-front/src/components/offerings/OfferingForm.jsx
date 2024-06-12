import React, { useState, useEffect } from "react";

const OfferingForm = ({
  members,
  offering,
  setOffering,
  handleSubmit,
  isEditMode,
}) => {
  const [defaultDate, setDefaultDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDefaultDate(formattedDate);
    if (!offering.date) {
      setOffering((prevOffering) => ({ ...prevOffering, date: formattedDate }));
    }
  }, [offering.date, setOffering]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const numericValue = value.replace(/,/g, "");
      if (/[^0-9.]/.test(numericValue)) {
        setErrorMessage("Amount should only contain numbers.");
      } else {
        setErrorMessage("");
        setOffering((prevOffering) => ({
          ...prevOffering,
          [name]: numericValue,
        }));
      }
    } else {
      setOffering((prevOffering) => ({ ...prevOffering, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      ...offering,
      amount: parseFloat(offering.amount.replace(/,/g, "")),
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-6 shadow rounded-md"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={offering.amount}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Member
        </label>
        <select
          name="member"
          value={offering.member}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        >
          <option value="">Select Member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={offering.date || defaultDate}
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
          value={offering.details}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200"
      >
        {isEditMode ? "Update Offering" : "Add Offering"}
      </button>
    </form>
  );
};

export default OfferingForm;
