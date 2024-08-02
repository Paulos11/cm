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
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchOfferings,
  fetchTotalOffering,
  addOffering,
  updateOffering,
  deleteOffering,
  setPage,
} from "../store/offeringsSlice";
import { fetchAllMembers } from "../store/membersSlice";
import OfferingForm from "../components/offerings/OfferingForm";
import Modal from "../components/offerings/Modal";

const Offerings = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const offerings = useSelector((state) => state.offerings.offerings) || [];
  const totalOffering = useSelector((state) => state.offerings.totalOffering) || 0;
  const members = useSelector((state) => state.members.allMembers);
  const status = useSelector((state) => state.offerings.status);
  const error = useSelector((state) => state.offerings.error);
  const page = useSelector((state) => state.offerings.page);
  const limit = 10;

  const [selectedOffering, setSelectedOffering] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    dispatch(fetchOfferings({ page, limit }));
    dispatch(fetchTotalOffering());
    dispatch(fetchAllMembers());
  }, [dispatch, page, limit]);

  const handleAddOffering = async (offering) => {
    try {
      await dispatch(addOffering(offering)).unwrap();
      onClose();
      toast.success("Offering added successfully");
    } catch (error) {
      toast.error("Failed to add offering");
    }
  };

  const handleUpdateOffering = async (offering) => {
    try {
      await dispatch(updateOffering({ id: selectedOffering._id, ...offering })).unwrap();
      onClose();
      toast.success("Offering updated successfully");
    } catch (error) {
      toast.error("Failed to update offering");
    }
  };

  const handleEditClick = (offering) => {
    setSelectedOffering(offering);
    onOpen();
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this offering?")) {
      try {
        await dispatch(deleteOffering(id)).unwrap();
        toast.success("Offering deleted successfully");
      } catch (error) {
        toast.error("Failed to delete offering");
      }
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleDateFilter = () => {
    dispatch(fetchOfferings({ page, limit, startDate, endDate }));
  };

  const exportToPDF = () => {
    // Implement PDF export logic
  };

  const exportToExcel = () => {
    // Implement Excel export logic
  };

  const filteredOfferings = offerings.filter(offering => 
    (offering.member && offering.member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    offering.amount.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(totalOffering / limit);

  if (status === 'loading') {
    return <Box>Loading...</Box>;
  }

  if (status === 'failed') {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg" color={textColor}>Offerings</Heading>
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => { setSelectedOffering(null); onOpen(); }}>
            Add New Offering
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
            Total Offering: ${totalOffering.toFixed(2)}
          </Text>
        </Flex>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search offerings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Member</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Details</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOfferings.map((offering) => (
              <Tr key={offering._id}>
                <Td>{offering.member ? offering.member.name : 'Unknown'}</Td>
                <Td>${offering.amount.toFixed(2)}</Td>
                <Td>{new Date(offering.date).toLocaleDateString()}</Td>
                <Td>{offering.details}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit"
                      size="sm"
                      onClick={() => handleEditClick(offering)}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(offering._id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalOffering)} of {totalOffering} offerings
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
        <OfferingForm
          members={members}
          offering={selectedOffering}
          handleSubmit={selectedOffering ? handleUpdateOffering : handleAddOffering}
          isEditMode={!!selectedOffering}
        />
      </Modal>
    </Box>
  );
};

export default Offerings;
