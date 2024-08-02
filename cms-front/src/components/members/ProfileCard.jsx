import React from "react";
import { Box, Image, VStack, Heading, Text, Flex, Icon } from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from "react-icons/fa";

const ProfileCard = ({ member }) => {
  return (
    <Box
      p={6}
      w="full"
      maxW="sm"
      bg="white"
      rounded="xl"
      boxShadow="2xl"
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-20px"
        left="-20px"
        right="-20px"
        height="150px"
        bg="blue.500"
        transform="skew(0deg, -5deg)"
      />
      <Image
        src={`http://localhost:5009/${member.image}`}
        alt={member.name}
        boxSize="150px"
        objectFit="cover"
        borderRadius="full"
        mx="auto"
        mb={4}
        border="4px solid white"
        position="relative"
        zIndex="1"
      />
      <VStack spacing={3} align="stretch">
        <Heading fontSize="2xl" fontWeight="bold" color="gray.800">
          {member.name}
        </Heading>
        <InfoItem icon={FaEnvelope} text={member.email} />
        <InfoItem icon={FaPhone} text={member.phone} />
        <InfoItem icon={FaMapMarkerAlt} text={member.address} />
        <InfoItem
          icon={FaBirthdayCake}
          text={new Date(member.dateOfBirth).toLocaleDateString()}
        />
      </VStack>
    </Box>
  );
};

const InfoItem = ({ icon, text }) => (
  <Flex align="center" color="gray.600">
    <Icon as={icon} mr={2} color="blue.500" />
    <Text fontSize="sm">{text}</Text>
  </Flex>
);

export default ProfileCard;