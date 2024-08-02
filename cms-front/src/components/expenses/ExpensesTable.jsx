import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, HStack } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpensesTable = ({ expenses, handleEditClick, handleDeleteClick }) => {
  if (!expenses.length) {
    return <div>No expenses found.</div>;
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Category</Th>
          <Th>Amount</Th>
          <Th>Date</Th>
          <Th>Details</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {expenses.map((expense) => (
          <Tr key={expense._id}>
            <Td>{expense.category}</Td>
            <Td>Rs {expense.amount.toFixed(2)}</Td>
            <Td>{new Date(expense.date).toLocaleDateString()}</Td>
            <Td>{expense.details}</Td>
            <Td>
              <HStack spacing={2}>
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit"
                  size="sm"
                  onClick={() => handleEditClick(expense)}
                />
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Delete"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteClick(expense._id)}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ExpensesTable;
