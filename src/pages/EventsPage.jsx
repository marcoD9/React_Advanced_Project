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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  return { events: await events.json() };
};

export const EventsPage = () => {
  const { events } = useLoaderData();
  const [searchField, setSearchField] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]); // Combined filtered events

  // Filter based on search field
  useEffect(() => {
    const filteredByName = events.filter((event) =>
      event.title.toLowerCase().includes(searchField.toLowerCase())
    );
    setFilteredEvents(filteredByName);
  }, [searchField, events]); //executed on search field change

  // Filter based on category
  useEffect(() => {
    const filteredByCategory = events.filter((event) => {
      if (selectedCategory == "") {
        return true; // No category filter applied
      }
      return event.categoryIds.includes(parseInt(selectedCategory));
    });
    setFilteredEvents(filteredByCategory);
  }, [selectedCategory, events]); //executed on category change

  // Handle change in the text input
  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  // Handle change in the category select
  const handleCategoryChange = (event) => {
    setSelectedCategory(Number(event.target.value));
  };

  return (
    <>
      <Stack alignItems="center" textAlign="center">
        <Flex flexDirection="column">
          <Text fontWeight="bolder">Search events by name:</Text>
          <Text fontWeight="light">{searchField}</Text>
          <Input w="40vw" onChange={handleChange} />
        </Flex>
        <Flex flexDirection="column">
          <Text>Category:</Text>
          <Select
            placeholder="Choose a category"
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            <option value="1">Sports</option>
            <option value="2">Games</option>
            <option value="3">Relaxation</option>
          </Select>
        </Flex>
      </Stack>
      <Stack alignItems="center">
        <Flex
          maxH="max-content"
          maxWidth="max-content"
          justifyContent="center"
          gap="8"
          wrap="wrap"
        >
          <div className="events-list">
            <Heading>List of events</Heading>
            {filteredEvents.map((event) => (
              <Card key={event.id}>
                <CardBody m={16}>
                  <div className="event">
                    <Link to={`event/${event.id}`}>
                      <Image src={event.image} alt={event.title} />
                      <Heading>{event.title}</Heading>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Flex>
      </Stack>
    </>
  );
};
