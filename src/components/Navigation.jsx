import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Button, Stack } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box as="nav" bg="#E9D8FD" py={4} px={6} borderRadius="lg" boxShadow="sm">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        maxW="1200px"
        mx="auto"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          mt={{ base: 4, md: 0 }}
          alignItems="center"
        >
          <Button as={Link} to="/" variant="solid" bg="#B794F4" size="sm">
            Events
          </Button>
          <Button
            as={Link}
            to="/events/new"
            variant="solid"
            bg="#B794F4"
            size="sm"
          >
            Create New Event
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};
