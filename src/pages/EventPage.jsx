import {
  CardBody,
  Heading,
  Image,
  Text,
  Card,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

async function fetchCategories(ids) {
  const promises = ids.map(async (id) => {
    const response = await fetch(`http://localhost:3000/categories/${id}`);
    return await response.json();
  });

  return await Promise.all(promises);
}

export const loader = async ({ params }) => {
  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId}`
    );
    if (!response.ok) {
      throw new Error("Event not found");
    }
    const event = await response.json();

    const categories = await fetchCategories(event.categoryIds); // Call the new function

    return { event, categories };
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

export const EventPage = () => {
  const { event, categories } = useLoaderData();
  console.log(categories);
  return (
    <>
      <Heading>Event</Heading>
      <Card key={event.title}>
        <CardBody m={16}>
          <div className="event">
            <Image src={event.image} alt={event.title} />
            <Heading>{event.title}</Heading>
            <Text>{event.description}</Text>
            <Text>Location: {event.location}</Text>
            <Text>
              From: {event.startTime} To: {event.endTime}
            </Text>
            {categories.length > 0 && (
              <>
                <Text>Categories: </Text>
                <List key={event.id}>
                  {categories.map((category) => (
                    <ListItem key={category.id}>{category.name}</ListItem>
                  ))}
                </List>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};
