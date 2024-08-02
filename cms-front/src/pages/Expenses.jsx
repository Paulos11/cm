import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  InputGroup,
  Input,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExpenseForm from "../components/expenses/ExpenseForm";
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

const Expenses = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const expenses = useSelector((state) => state.expenses.expenses) || [];
  const totalExpenses = useSelector((state) => state.expenses.totalExpenses) || 0;
  const totalOffering = useSelector((state) => state.offerings.totalOffering) || 0;
  const status = useSelector((state) => state.expenses.status);
  const error = useSelector((state) => state.expenses.error);
  const page = useSelector((state) => state.expenses.page);
  const limit = 10;

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    dispatch(fetchExpenses({ page, limit }));
    dispatch(fetchTotalExpenses());
    dispatch(fetchTotalOffering());
  }, [dispatch, page, limit]);

  const handleAddExpense = async (expense) => {
    try {
      await dispatch(addExpense(expense)).unwrap();
      onClose();
      toast.success("Expense added successfully");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleUpdateExpense = async (expense) => {
    try {
      await dispatch(updateExpense({ id: selectedExpense._id, ...expense })).unwrap();
      onClose();
      toast.success("Expense updated successfully");
    } catch (error) {
      toast.error("Failed to update expense");
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    onOpen();
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await dispatch(deleteExpense(id)).unwrap();
        toast.success("Expense deleted successfully");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
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

  const filteredExpenses = expenses.filter(
    (expense) =>
      (expense.category && expense.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.amount && expense.amount.toString().includes(searchTerm))
  );

  const totalPages = Math.ceil(totalExpenses / limit);
  const remainingFunds = totalOffering - totalExpenses;

  if (status === "loading") {
    return <Box>Loading...</Box>;
  }

  if (status === "failed") {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" shadow="md">
      <ToastContainer />
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg" color={textColor}>
            Expenses
          </Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={() => {
              setSelectedExpense(null);
              onOpen();
            }}
          >
            Add New Expense
          </Button>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={handleDateFilter} colorScheme="blue">
              Filter
            </Button>
          </HStack>
          <Text fontSize="xl" fontWeight="bold">
            Total Expenses: Rs {totalExpenses.toFixed(2)}
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            Remaining Fund: Rs {remainingFunds.toFixed(2)}
          </Text>
        </Flex>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

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
            {filteredExpenses.map((expense) => (
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

        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalExpenses)} of {totalExpenses} expenses
          </Text>
          <HStack>
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              size="sm"
            >
              Previous
            </Button>
            <Text>{page} of {totalPages}</Text>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              size="sm"
            >
              Next
            </Button>
          </HStack>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />}>
              Export
            </MenuButton>
            <MenuList>
              <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
              <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ExpenseForm
          expense={selectedExpense}
          handleSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
          isEditMode={!!selectedExpense}
        />
      </Modal>
    </Box>
  );
};

export default Expenses;
