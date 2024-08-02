import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

const OfferingForm = ({ members, offering, handleSubmit, isEditMode }) => {
  const [formData, setFormData] = React.useState(offering || {
    amount: "",
    member: "",
    date: new Date().toISOString().split('T')[0],
    details: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Member</FormLabel>
          <Select
            name="member"
            value={formData.member}
            onChange={handleInputChange}
          >
            <option value="">Select a member</option>
            {members.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Details</FormLabel>
          <Textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          {isEditMode ? "Update Offering" : "Add Offering"}
        </Button>
      </VStack>
    </form>
  );
};

export default OfferingForm;