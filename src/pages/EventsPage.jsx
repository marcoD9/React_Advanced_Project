import {
  CardBody,
  Heading,
  Image,
  Card,
  Box,
  Select,
  Stack,
  Text,
  Flex,
  Input,
  Tag,
  Alert,
  AlertIcon,
  AlertTitle,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

export const loader = async () => {
  try {
    const responseCategories = await fetch(
      `https://events-api-hqpz.onrender.com/categories`
    );
    const responseEvents = await fetch(
      "https://events-api-hqpz.onrender.com/events"
    );

    if (!responseCategories.ok) {
      throw new Error(
        `Failed to fetch categories: ${responseCategories.statusText}`
      );
    }
    if (!responseEvents.ok) {
      throw new Error(`Failed to fetch events: ${responseEvents.statusText}`);
    }

    const categories = await responseCategories.json();
    const events = await responseEvents.json();

    return { events, categories, error: null }; // Set error to null on success
  } catch (error) {
    console.error("Error fetching data:", error);
    return { events: [], categories: [], error };
  }
};

export const EventsPage = () => {
  const { events, categories, error } = useLoaderData();
  const [searchField, setSearchField] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Using useBreakpointValue outside of the loop
  const imageHeight = useBreakpointValue({ base: "200px", md: "300px" });
  const imageWidth = useBreakpointValue({ base: "100%", md: "300px" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  // Combined filter for search field and category
  useEffect(() => {
    let filtered = events;

    // Filter by search field
    if (searchField) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchField.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((event) =>
        event.categories.some(
          (category) =>
            category.name.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    setFilteredEvents(filtered);
  }, [searchField, selectedCategory, events]);

  // Handle change in the text input
  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  // Handle change in the category select
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      ) : (
        <Box
          py={8}
          bgGradient="linear(to-l,  #FAF5FF,#FFFAF0)"
          borderRadius="lg"
          overflow="hidden"
          overflowX="hidden"
          minHeight="100vh"
          width="100vw"
        >
          <Stack alignItems="center" textAlign="center" spacing={8}>
            <Flex flexDirection="column" alignItems="center">
              <Text fontWeight="bolder">Search events by name:</Text>
              <Text fontWeight="light" mb={2}>
                {searchField}
              </Text>
              <Input
                w={{ base: "80vw", md: "40vw" }}
                onChange={handleChange}
                placeholder="Type event name..."
              />
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontWeight="bolder" mb={2}>
                Category:
              </Text>
              <Select
                placeholder="Choose a category"
                onChange={handleCategoryChange}
                w={{ base: "80vw", md: "40vw" }}
              >
                <option value="All">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </option>
                ))}
              </Select>
            </Flex>
          </Stack>
          <Stack alignItems="center" mt={12}>
            <Heading textAlign="center" mb={6}>
              List of events
            </Heading>
            <Flex
              flexDirection="row"
              justifyContent="center"
              gap={8}
              wrap="wrap"
              maxW="100%"
            >
              {filteredEvents.map((event) => (
                <Card
                  boxShadow="2xl"
                  bgGradient="linear(to-l,#E9D8FD,#B794F4)"
                  w={{ base: "90vw", md: "60vw" }}
                  key={event.title}
                  cursor="pointer"
                  _hover={{ transform: "scale(1.09)" }}
                >
                  <Link to={`/event/${event.id}`}>
                    <CardBody>
                      <Flex
                        flexDirection={{ base: "column", lg: "row" }}
                        gap={6}
                        alignItems="center"
                      >
                        <Image
                          borderRadius="lg"
                          h={imageHeight}
                          w={imageWidth}
                          objectFit="cover"
                          src={event.image}
                          alt={event.title}
                        />

                        <Stack spacing={4} flex="1">
                          <Heading size={headingSize}>{event.title}</Heading>
                          <Text fontSize={textSize}>{event.description}</Text>
                          <Text>Location: {event.location}</Text>
                          {event.startTime && event.endTime ? (
                            <>
                              <Text>
                                From:{" "}
                                {format(parseISO(event.startTime), "PPPpp")}
                              </Text>
                              <Text>
                                To: {format(parseISO(event.endTime), "PPPpp")}
                              </Text>
                            </>
                          ) : (
                            <Text>Loading...</Text>
                          )}
                          {categories.length > 0 ? (
                            <>
                              <Text>Categories:</Text>
                              <Flex flexDirection="row" wrap="wrap" gap={2}>
                                {event.categories.map((category) => (
                                  <Tag
                                    fontSize="l"
                                    p={2}
                                    size="sm"
                                    variant="solid"
                                    bgColor="yellow.300"
                                    color="black"
                                    key={category.id}
                                  >
                                    {category.name[0].toUpperCase() +
                                      category.name.slice(1).toLowerCase()}
                                  </Tag>
                                ))}
                              </Flex>
                            </>
                          ) : (
                            <Text>Loading...</Text>
                          )}
                        </Stack>
                      </Flex>
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </Flex>
          </Stack>
        </Box>
      )}
    </>
  );
};
