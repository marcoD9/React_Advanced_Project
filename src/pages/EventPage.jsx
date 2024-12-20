import {
  CardBody,
  Heading,
  Image,
  Text,
  Card,
  Stack,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
  //-------------------------------------------------------------------------------//
  //Fetch categories datas based on the event's categoryIds
  async function fetchCategories(ids) {
    const promises = ids.map(async (id) => {
      const response = await fetch(`http://localhost:3000/categories/${id}`);
      return await response.json();
    });
    return await Promise.all(promises);
  }
  //-------------------------------------------------------------------------------//
  //Fetch users datas based on the event's createdBy property
  async function fetchUsersId(id) {
    const response = await fetch(`http://localhost:3000/users/${id}`);
    return await response.json();
  }
  //-------------------------------------------------------------------------------//

  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId}`
    );
    if (!response.ok) {
      throw new Error("Event not found");
    }

    const event = await response.json();
    const categories = await fetchCategories(event.categoryIds);
    const user = await fetchUsersId(event.createdBy);

    return { event, user, categories };
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

export const EventPage = () => {
  const { event, user, categories } = useLoaderData();
  console.log(categories);
  return (
    <>
      <Heading>Event</Heading>
      <Card key={event.title}>
        <CardBody m={16}>
          <Stack>
            <Image
              boxSize="400px"
              objectFit="cover"
              src={event.image}
              alt={event.title}
            />
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
          </Stack>
          <Stack>
            <Text>Created by: </Text>
            <Image
              borderRadius="100"
              w="10%"
              h="10%"
              src={user.image}
              alt={`Profile picture of the user: ${user.name}`}
            />
            <Text>{user.name}</Text>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
};
