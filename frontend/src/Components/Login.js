import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/schedule");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={4}>
        <Heading as="h1" size="lg" color>
          Login
        </Heading>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button
          bg="blue.700"
          color="white"
          mt={1}
          width="full"
          onClick={handleLogin}
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
