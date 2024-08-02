import React from "react";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
const MemberSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Search members..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
    </InputGroup>
  );
};

export default MemberSearch;
