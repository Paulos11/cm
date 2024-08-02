import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";

const ExpenseForm = ({ expense, handleSubmit, isEditMode }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    details: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleFormSubmit} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={4}>
        <FormControl id="category" isRequired>
          <FormLabel>Category</FormLabel>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="amount" isRequired>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="date" isRequired>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="details">
          <FormLabel>Details</FormLabel>
          <Textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          {isEditMode ? "Update Expense" : "Add Expense"}
        </Button>
      </VStack>
    </Box>
  );
};

export default ExpenseForm;
