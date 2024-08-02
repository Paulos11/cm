import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { addMember, updateMember } from "../../store/membersSlice";

const MemberForm = ({ member, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { status, error } = useSelector((state) => state.members);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    image: null,
  });

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : "",
        image: null,
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (key === "image" && formData[key] instanceof File) {
        form.append(key, formData[key]);
      } else {
        form.append(key, formData[key] || "");
      }
    }
    if (member) {
      dispatch(updateMember({ id: member._id, data: form }))
        .unwrap()
        .then(() => {
          toast({
            title: "Member updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        })
        .catch((err) => {
          toast({
            title: "Error updating member",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      dispatch(addMember(form))
        .unwrap()
        .then(() => {
          toast({
            title: "Member added",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            dateOfBirth: "",
            image: null,
          });
        })
        .catch((err) => {
          toast({
            title: "Error adding member",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg={bgColor} p={6} borderRadius="md" shadow="md">
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel color={textColor}>Name</FormLabel>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </FormControl>
        <FormControl>
          <FormLabel color={textColor}>Email</FormLabel>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </FormControl>
        <FormControl>
          <FormLabel color={textColor}>Phone</FormLabel>
          <Input name="phone" value={formData.phone} onChange={handleChange} required />
        </FormControl>
        <FormControl>
          <FormLabel color={textColor}>Address</FormLabel>
          <Input name="address" value={formData.address} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel color={textColor}>Date of Birth</FormLabel>
          <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel color={textColor}>Profile Image</FormLabel>
          <Input name="image" type="file" onChange={handleChange} accept="image/*" />
        </FormControl>
        {status === "loading" ? (
          <Button type="submit" colorScheme="blue" width="full" isLoading>
            <Spinner size="sm" />
          </Button>
        ) : (
          <Button type="submit" colorScheme="blue" width="full">
            {member ? "Update Member" : "Add Member"}
          </Button>
        )}
        {error && (
          <Text color="red.500">
            {member ? "Failed to update member" : "Failed to add member"}: {error.message}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MemberForm;
