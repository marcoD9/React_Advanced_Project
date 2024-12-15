import {
  Card,
  CardBody,
  Text,
  Image,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

export const EventDetails = ({ event }) => {
  const [eventCategoryIds, setEventCategoryIds] = useState([]); // Store categoryIds of the Event
  const [categories, setCategories] = useState([]); // Store categories data
  const [matchingCategories, setMatchingCategories] = useState([]); //Store the matching categories
  const eventId = Number(event.id);

  // Fetch event's categories IDs
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      const eventData = await response.json();
      setEventCategoryIds(eventData.categoryIds);
    }
    fetchData();
  }, [eventId]);

  // Fetch all categories
  useEffect(() => {
    async function fetchAllCategories() {
      const response = await fetch(`http://localhost:3000/categories`);
      const allCategories = await response.json();
      setCategories(allCategories);
    }
    fetchAllCategories();
  }, []);

  // Find matching category names based on event's category IDs
  useEffect(() => {
    const matchingCategories = eventCategoryIds.map((id) => {
      const matchingCategory = categories.find(
        (category) => category.id === id
      );
      return matchingCategory;
    });

    // Filter out any undefined values (categories not found)
    const filteredMatchingCategories = matchingCategories.filter(Boolean);

    setMatchingCategories(filteredMatchingCategories);
  }, [eventCategoryIds, categories]);

  return (
    <>
      <Card>
        <CardBody>
          <Image src={event.image} />
          <Heading>{event.title}</Heading>
          <Text>{event.description}</Text>
          <Text>Location: {event.location}</Text>
          <Text>
            From: {event.startTime} To: {event.endTime}
          </Text>
          <Text> Categories:</Text>
          <List>
            {matchingCategories.map((category) => (
              <ListItem key={category.id}>{category.name}</ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </>
  );
};
