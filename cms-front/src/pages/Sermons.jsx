// src/pages/Sermons.jsx
import React, { useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure, VStack } from "@chakra-ui/react";
import SermonList from "../components/sermons/SermonsList";
import SermonForm from "../components/sermons/SermonForm";
import Modal from "../components/ui/Modal";

const Sermons = () => {
  const [editMode, setEditMode] = useState(false);
  const [currentSermon, setCurrentSermon] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (sermon) => {
    setCurrentSermon(sermon);
    setEditMode(true);
    onOpen();
  };

  const openForm = () => {
    setEditMode(false);
    setCurrentSermon(null);
    onOpen();
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">Sermons</Heading>
          <Button onClick={openForm} colorScheme="blue">
            Add Sermon
          </Button>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <SermonForm
            currentSermon={currentSermon}
            setEditMode={setEditMode}
            closeForm={onClose}
          />
        </Modal>
        <SermonList onEdit={handleEdit} />
      </VStack>
    </Box>
  );
};

export default Sermons;
