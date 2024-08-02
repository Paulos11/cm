import React, { useEffect } from 'react';
import { Box, Heading, SimpleGrid, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaMoneyBillWave, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fetchTotalMembers } from '../store/membersSlice';
import { fetchTotalOffering } from '../store/offeringsSlice';
import { fetchTotalExpenses } from '../store/expensesSlice';
import { fetchEvents } from '../store/eventsSlice';

const MotionBox = motion(Box);

const StatCard = ({ icon, title, value, color }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      bg={bgColor}
      p={6}
      rounded="lg"
      shadow="md"
      borderLeft="4px solid"
      borderColor={color}
    >
      <Flex align="center">
        <Box as={icon} size="3em" color={color} />
        <Box ml={4}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={color}>
            {value}
          </Text>
        </Box>
      </Flex>
    </MotionBox>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const totalMembers = useSelector((state) => state.members.total);
  const totalOffering = useSelector((state) => state.offerings.totalOffering);
  const totalExpenses = useSelector((state) => state.expenses.totalExpenses);
  const events = useSelector((state) => state.events.events);

  useEffect(() => {
    dispatch(fetchTotalMembers());
    dispatch(fetchTotalOffering());
    dispatch(fetchTotalExpenses());
    dispatch(fetchEvents());
  }, [dispatch]);

  const data = [
    { name: 'Members', value: totalMembers || 0 },
    { name: 'Offerings', value: totalOffering || 0 },
    { name: 'Expenses', value: totalExpenses || 0 },
  ];

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard 
          icon={FaUsers} 
          title="Total Members" 
          value={totalMembers || 0} 
          color="#4299E1" 
        />
        <StatCard 
          icon={FaMoneyBillWave} 
          title="Total Offerings" 
          value={totalOffering ? `$${totalOffering.toFixed(2)}` : '$0.00'} 
          color="#48BB78" 
        />
        <StatCard 
          icon={FaChartLine} 
          title="Total Expenses" 
          value={totalExpenses ? `$${totalExpenses.toFixed(2)}` : '$0.00'} 
          color="#ED8936" 
        />
        <StatCard 
          icon={FaCalendarAlt} 
          title="Upcoming Events" 
          value={events ? events.length : 0} 
          color="#9F7AEA" 
        />
      </SimpleGrid>
      <Box mt={8} bg={useColorModeValue('white', 'gray.700')} p={6} rounded="lg" shadow="md">
        <Heading size="md" mb={4}>Financial Overview</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4299E1" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;