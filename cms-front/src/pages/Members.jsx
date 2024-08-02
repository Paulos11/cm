import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  VStack,
  HStack,
  Text,
  Spinner,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserPlus } from 'react-icons/fa';
import { fetchMembers, fetchAllMembers, deleteMember, addMember } from "../store/membersSlice";
import MemberForm from "../components/members/MemberForm";
import MemberSearch from "../components/members/MemberSearch";
import MembersTable from "../components/members/MembersTable";
import Modal from "../components/members/Modal";
import ProfileCard from "../components/members/ProfileCard";

const Members = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { members, total, status, error } = useSelector((state) => state.members);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [allMembers, setAllMembers] = useState({ members: [] });
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [viewMember, setViewMember] = useState(null);

  const membersPerPage = 8;

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    dispatch(fetchMembers({ page: currentPage, limit: membersPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchAllMembers())
      .unwrap()
      .then(result => {
        console.log('Fetched all members:', result);
        setAllMembers(result);
      })
      .catch(error => {
        console.error('Failed to fetch all members:', error);
        toast({
          title: "Error fetching members",
          description: error.message || "An unknown error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [dispatch, toast]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (member) => {
    setSelectedMember(member);
    onOpen();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(id))
        .unwrap()
        .then(() => {
          toast({
            title: "Member deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          dispatch(fetchMembers({ page: currentPage, limit: membersPerPage }));
        })
        .catch((err) => {
          toast({
            title: "Error deleting member",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const handleAddNew = () => {
    setSelectedMember(null);
    onOpen();
  };

  const handleAddMember = (memberData) => {
    dispatch(addMember(memberData))
      .unwrap()
      .then(() => {
        toast({
          title: "Member added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        dispatch(fetchMembers({ page: currentPage, limit: membersPerPage }));
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
  };

  const handleView = (member) => {
    setViewMember(member);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsSearching(true);
    
    console.log('Search term:', term);
    console.log('allMembers:', allMembers);

    if (term && allMembers && Array.isArray(allMembers.members)) {
      const filtered = allMembers.members.filter(member =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term) ||
        (member.dateOfBirth && new Date(member.dateOfBirth).toLocaleDateString().toLowerCase().includes(term))
      );
      console.log('Filtered members:', filtered);
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers([]);
    }
  };

  const displayedMembers = searchTerm 
    ? filteredMembers.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage)
    : members;
  const totalMembers = searchTerm ? filteredMembers.length : total;
  const totalPages = Math.ceil(totalMembers / membersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (!searchTerm) {
      dispatch(fetchMembers({ page: pageNumber, limit: membersPerPage }));
    }
  };

  if (status === 'loading' && !isSearching) {
    return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
  }

  if (status === 'failed' && !isSearching) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>Members</Text>
          <Button leftIcon={<FaUserPlus />} colorScheme="blue" onClick={handleAddNew}>
            Add New Member
          </Button>
        </Flex>

        <MemberSearch searchTerm={searchTerm} setSearchTerm={handleSearchChange} />

        <MembersTable
          members={displayedMembers}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
        />

        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            Showing {displayedMembers.length} of {totalMembers} members
          </Text>
          <HStack>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                size="sm"
              >
                {i + 1}
              </Button>
            ))}
          </HStack>
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} title={selectedMember ? "Edit Member" : "Add Member"}>
        <MemberForm member={selectedMember} onClose={onClose} onSave={handleAddMember} />
      </Modal>

      {viewMember && (
        <Modal isOpen={!!viewMember} onClose={() => setViewMember(null)} title="View Member">
          <ProfileCard member={viewMember} />
        </Modal>
      )}
    </Box>
  );
};

export default Members;