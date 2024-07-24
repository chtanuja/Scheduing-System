import React from "react";
import { Box, Flex, Link, Text, Image } from "@chakra-ui/react";
import scheduleLogo from "../schedule-logo.jpg";

const Header = () => {
  return (
    <>
      <Box py={8} ml={5} display="flex" alignItems="center">
        <Image src={scheduleLogo} alt="Logo" boxSize="50px" mr={2} />
        <Text fontSize="2xl" fontWeight="bold">
          Scheduling System
        </Text>
      </Box>
      <Box bg="blue.700" color="white" px={4} fontSize="xl">
        <Flex h={20} alignItems="center">
          <Link px={8} href="#" style={{ textDecoration: "none" }}>
            Home
          </Link>
          <Link px={8} href="#" style={{ textDecoration: "none" }}>
            About
          </Link>
          <Link px={8} href="#" style={{ textDecoration: "none" }}>
            Resources
          </Link>
          <Link px={8} href="#" style={{ textDecoration: "none" }}>
            Contact
          </Link>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
