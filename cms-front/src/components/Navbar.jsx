import React from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaReceipt,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";

const NavItem = ({ icon, children, to }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
      })}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NavLink>
  );
};

const Navbar = () => {
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("gray.600", "gray.200");

  return (
    <Box
      bg={bg}
      color={color}
      w="64"
      h="full"
      pt="5"
      px="3"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
    >
      <VStack align="stretch" spacing="1">
        <Box p="5">
          <Text fontSize="2xl" fontWeight="bold" color="cyan.500">
            Gathering Church
          </Text>
        </Box>
        <NavItem icon={FaTachometerAlt} to="/admin">
          Dashboard
        </NavItem>
        <NavItem icon={FaUsers} to="/admin/members">
          Church Members
        </NavItem>
        <NavItem icon={FaMoneyBillWave} to="/admin/offerings">
          Offerings
        </NavItem>
        <NavItem icon={FaReceipt} to="/admin/expenses">
          Expenses
        </NavItem>
        <NavItem icon={FaBook} to="/admin/sermons">
          Sermons
        </NavItem>
        <NavItem icon={FaCalendarAlt} to="/admin/events">
          Events
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Navbar;
