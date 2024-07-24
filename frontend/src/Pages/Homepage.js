import React from "react";
import { Box, Container } from "@chakra-ui/react";
import Header from "../Components/Header";
import Login from "../Components/Login";

const Homepage = () => {
  return (
    <Box>
      <Header />
      <Container maxW="container.md" mt={8}>
        <Login />
      </Container>
    </Box>
  );
};

export default Homepage;
