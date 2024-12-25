import {
  CardBody,
  Heading,
  Image,
  Text,
  Card,
  Stack,
  Button,
  Box,
  Flex,
  Tag,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
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
  //Using useBreakpointValue outside of the loop
  const imageHeight = useBreakpointValue({ base: "200px", md: "300px" });
  const imageWidth = useBreakpointValue({ base: "100%", md: "300px" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });
  return (
    <>
      <Box
        py={8}
        bgGradient="linear(to-l,  #FAF5FF,#FFFAF0)"
        borderRadius="lg"
        overflow="hidden"
      >
        <Stack alignItems="center">
          <Flex
            maxH="max-content"
            maxWidth="max-content"
            justifyContent="center"
            gap="8"
            wrap="wrap"
          >
            <Card
              boxShadow="2xl"
              bgGradient="linear(to-l,#E9D8FD,#B794F4)"
              w="100%"
              key={event.title}
            >
              <CardBody m={16}>
                <Flex
                  flexDirection={{ base: "column", md: "row" }}
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
                          From: {format(parseISO(event.startTime), "PPPpp")}
                        </Text>
                        <Text>
                          To: {format(parseISO(event.endTime), "PPPpp")}
                        </Text>
                      </>
                    ) : (
                      <Text>Loading...</Text>
                    )}
                    {categories.length > 0 && (
                      <>
                        <Text>Categories: </Text>
                        <Flex flexDirection="row" wrap="wrap" gap={2}>
                          {categories.map((category) => (
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
                    )}
                    <Flex gap={4}>
                      <Link to={`/edit/${event.id}`}>
                        <Button>Edit Event</Button>
                      </Link>
                      <DeleteRequest eventId={event.id} />
                    </Flex>
                  </Stack>
                </Flex>
                {user && (
                  <Flex
                    mt={8}
                    alignItems="center"
                    justifyContent={{ base: "center", md: "space-between" }}
                    p={4}
                    borderTop="1px solid rgba(0, 0, 0, 0.1)"
                  >
                    <Flex alignItems="center" gap={4}>
                      <Image
                        borderRadius="full"
                        boxSize="50px"
                        objectFit="cover"
                        src={user.image}
                        alt={`Profile picture of the user: ${user.name}`}
                      />
                      <Text fontSize="lg" fontWeight="bold">
                        {user.name}
                      </Text>
                    </Flex>
                  </Flex>
                )}
              </CardBody>
            </Card>
          </Flex>
        </Stack>
      </Box>
    </>
  );
};
