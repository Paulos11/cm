import React from "react";
import { FilePenIcon, TrashIcon } from "../ui/icons";

const ExpensesTable = ({ expenses, handleEditClick, handleDeleteClick }) => {
  if (!expenses.length) {
    return <div>No expenses found.</div>;
  }

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          <th className="py-2 px-4 text-left">Category</th>
          <th className="py-2 px-4 text-left">Amount</th>
          <th className="py-2 px-4 text-left">Date</th>
          <th className="py-2 px-4 text-left">Details</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense._id} className="border-t hover:bg-gray-50">
            <td className="py-2 px-4 text-left">{expense.category}</td>
            <td className="py-2 px-4 text-left">
              Rs {expense.amount.toFixed(2)}
            </td>
            <td className="py-2 px-4 text-left">
              {new Date(expense.date).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 text-left">{expense.details}</td>
            <td className="py-2 px-4 text-left flex items-center gap-2">
              <button
                onClick={() => handleEditClick(expense)}
                className="text-gray-800 flex items-center"
              >
                <FilePenIcon className="ml-2 w-4 h-4 text-xs" />
              </button>
              <button
                onClick={() => handleDeleteClick(expense._id)}
                className="text-red-600 flex items-center"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpensesTable;
