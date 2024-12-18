import {
  CardBody,
  Heading,
  Image,
  Card,
  Box,
  Stack,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData, Link } from "react-router-dom";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  return { events: await events.json() };
};

export const EventsPage = () => {
  const { events } = useLoaderData();
  const [searchField, setSearchField] = useState("");

  //filter events to match the title with the input field
  const matchedEvent = events.filter((event) => {
    return event.title.toLowerCase().includes(searchField.toLowerCase());
  });

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  return (
    <Box w="30vw">
      <Stack>
        <Text fontWeight="bolder">Search events by name:</Text>
        <Text fontWeight="light">{searchField}</Text>
        <Input onChange={handleChange} />
      </Stack>
      <div className="events-list">
        <Heading>List of events</Heading>
        {matchedEvent.map((event) => (
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
    </Box>
  );
};
