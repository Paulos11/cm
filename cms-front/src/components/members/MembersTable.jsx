import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  HStack,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const MembersTable = ({
  members,
  handleEdit,
  handleDelete,
  handleView,
}) => {
  console.log('MembersTable received members:', members);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Member</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Date of Birth</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {members.map((member) => (
          <Tr key={member._id}>
            <Td>
              <Flex align="center">
                <Avatar src={`http://localhost:5009/${member.image}`} name={member.name} size="sm" mr={2} />
                <Text fontWeight="medium">{member.name}</Text>
              </Flex>
            </Td>
            <Td>{member.email}</Td>
            <Td>{member.phone}</Td>
            <Td>{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'N/A'}</Td>
            <Td>
              <HStack spacing={2}>
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit"
                  size="sm"
                  onClick={() => handleEdit(member)}
                />
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Delete"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(member._id)}
                />
                <IconButton
                  icon={<FaEye />}
                  aria-label="View"
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleView(member)}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default MembersTable;
