import {
  CardBody,
  Heading,
  Image,
  Text,
  Card,
  Stack,
  List,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { format } from "date-fns";
import { DeleteRequest } from "../components/DeleteRequest";

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

    const [categories] = await Promise.all([
      fetchCategories(event.categoryIds),
    ]);
    const user = event.createdBy ? await fetchUsersId(event.createdBy) : null; //Check if user exists before fetching

    return { event, user, categories };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const EventPage = () => {
  const { event, user, categories } = useLoaderData();
  console.log(user);
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
              From: {format(new Date(event.startTime), "PPPpp")} To:{" "}
              {format(new Date(event.endTime), "PPPpp")}
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
          {user && (
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
          )}
        </CardBody>
      </Card>
      <Stack m={8}>
        <Link to={`/edit/${event.id}`}>
          <Button> Edit Event</Button>
        </Link>
        <DeleteRequest eventId={event.id} />
      </Stack>
    </>
  );
};
