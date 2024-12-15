import React, { useState } from "react";
import { Heading, List, ListItem } from "@chakra-ui/react";
import { useEffect } from "react";
import { EventDetails } from "./EventDetails";

export const EventsList = () => {
  const [eventsList, setEventsList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/events");
      const events = await response.json();
      setEventsList(events);
    }
    fetchData();
  }, []);
  return (
    <>
      <Heading>List of events</Heading>
      <List>
        {eventsList.map((event) => (
          <ListItem key={event.id}>
            {" "}
            <EventDetails event={event} />{" "}
          </ListItem>
        ))}
      </List>
    </>
  );
};
