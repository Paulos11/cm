import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/eventsSlice";
import EventForm from "../components/Events/EventForm";
import Modal from "../components/ui/Modal";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent(null);
    onOpen();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <Box>
      <Button onClick={() => { setSelectedEvent(null); onOpen(); }} colorScheme="blue" mb={4}>
        Add New Event
      </Button>
      <Box height="500px">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
        />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <EventForm event={selectedEvent} onClose={onClose} />
      </Modal>
    </Box>
  );
};

export default Events;