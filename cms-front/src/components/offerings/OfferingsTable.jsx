import React from "react";
import { FilePenIcon, TrashIcon } from "../ui/icons";

const OfferingsTable = ({ offerings, handleEditClick, handleDeleteClick }) => {
  if (!offerings.length) {
    return <div>No offerings found.</div>;
  }

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          <th className="py-2 px-4 text-left">Member</th>
          <th className="py-2 px-4 text-left">Amount</th>
          <th className="py-2 px-4 text-left">Date</th>
          <th className="py-2 px-4 text-left">Details</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {offerings.map((offering) => (
          <tr key={offering._id} className="border-t hover:bg-gray-50">
            <td className="py-2 px-4 text-left">
              {offering.member ? offering.member.name : "Unknown Member"}
            </td>
            <td className="py-2 px-4 text-left">
              ${offering.amount.toFixed(2)}
            </td>
            <td className="py-2 px-4 text-left">
              {new Date(offering.date).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 text-left">{offering.details}</td>
            <td className="py-2 px-4 text-left flex items-center gap-2">
              <button
                onClick={() => handleEditClick(offering)}
                className="text-gray-800 flex items-center"
              >
                <FilePenIcon className="ml-2 w-4 h-4 text-xs" />
              </button>
              <button
                onClick={() => handleDeleteClick(offering._id)}
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

export default OfferingsTable;
