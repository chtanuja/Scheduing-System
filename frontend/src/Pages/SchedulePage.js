// src/components/SchedulePage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/SchedulePage.css";

const SchedulePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((employeeId) => employeeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSchedule = async () => {
    console.log("entered handle schedule");
    if (!date || !time || !comment || selectedEmployees.length === 0) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const currentDateTime = new Date();
    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);

    if (selectedDateTime <= currentDateTime) {
      toast({
        title: "Invalid date/time",
        description: "Please select a future date and time.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const datetime = `${date.toISOString().split("T")[0]} ${time}`;
    console.log(`datetime : ${datetime}`);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/schedules",
        { employees: selectedEmployees, datetime, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Meeting scheduled successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setSelectedEmployees([]);
      setDate(new Date());
      setTime("");
      setComment("");
      setShowScheduleForm(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error scheduling meeting",
        description:
          "There was an error scheduling the meeting. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date instanceof Date && date.toDateString() === today.toDateString();
  };

  const getMinTime = () => {
    if (isToday(date)) {
      const now = new Date();
      return new Date(now.setMinutes(now.getMinutes() + 1));
    }
    return new Date(0, 0, 0, 0, 0);
  };

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>
        Admin Dashboard
      </Heading>
      <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4} mb={4}>
        <Heading
          as="h2"
          size="md"
          bg="blue.700"
          color="white"
          p={2}
          borderRadius="md"
        >
          Employee List
        </Heading>
        <VStack align="start" mt={4}>
          {employees.map((employee) => (
            <HStack key={employee.id} spacing={4}>
              <Checkbox
                isChecked={selectedEmployees.includes(employee.id)}
                onChange={() => handleCheckboxChange(employee.id)}
              />
              <Text>{employee.name}</Text>
            </HStack>
          ))}
        </VStack>
        <Button mt={4} onClick={() => setShowScheduleForm(true)}>
          Schedule a Meeting
        </Button>
      </Box>
      {showScheduleForm && (
        <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
          <Heading
            as="h2"
            size="md"
            bg="blue.700"
            color="white"
            p={2}
            borderRadius="md"
            mb={3}
          >
            Schedule a Meeting
          </Heading>
          <VStack spacing={4}>
            <FormControl id="date">
              <FormLabel>Date</FormLabel>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="chakra-input css-1c6nbh4"
                wrapperClassName="chakra-datepicker"
              />
            </FormControl>
            <FormControl id="time">
              <FormLabel>Time</FormLabel>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min={getMinTime().toISOString().substring(11, 16)}
                required
              />
            </FormControl>
            <FormControl id="comment">
              <FormLabel>Comment</FormLabel>
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={200}
                required
              />
            </FormControl>
            <Button
              bg="blue.700"
              color="white"
              width="full"
              onClick={handleSchedule}
            >
              Schedule
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SchedulePage;
