import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  VStack,
  Text,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format, parseISO } from "date-fns";

export const loader = async ({ params }) => {
  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId}`
    );

    const event = await response.json();

    return { event };
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};
export const EditEvent = () => {
  const { event } = useLoaderData();
  const [eventData, setEventData] = useState({ event });
  const toast = useToast();
  const navigate = useNavigate();

  //-------------------------------------------//
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryIds") {
      setEventData((prevData) => ({
        ...prevData,
        [name]: [Number(value)],
      }));
    } else {
      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  //-------------------------------------------//

  const editEvent = async () => {
    const promise = fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PATCH",
      body: JSON.stringify(eventData),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    toast.promise(promise, {
      loading: {
        title: "Saving changes...",
        description: "Please wait while we update the event",
      },
      success: {
        title: "Event updated",
        description: "The event has been successfully updated",
      },
      error: {
        title: "Error updating event",
        description: "Something went wrong, please try again",
      },
    });

    const response = await promise;

    if (response.ok) {
      navigate(`/event/${event.id}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editEvent();
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel htmlFor="title">
              Title:{" "}
              <Text as="span" fontWeight="thin" fontSize="md">
                {event.title}
              </Text>
            </FormLabel>
            <Input
              placeholder="Edit title"
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="description">
              Description:{" "}
              <Text as="span" fontWeight="thin" fontSize="md">
                {" "}
                {event.description}
              </Text>
            </FormLabel>
            <Textarea
              placeholder="Edit description"
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
            />
          </FormControl>

          <SimpleGrid columns={[1, null, 2]} spacing={4}>
            <FormControl>
              <FormLabel htmlFor="startTime">
                Start Time:{" "}
                <Text as="span" fontWeight="thin" fontSize="md">
                  {format(parseISO(event.startTime), "PPPpp")}
                </Text>
              </FormLabel>
              <Input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="endTime">
                End Time:
                <Text as="span" fontWeight="thin" fontSize="md">
                  {" "}
                  {format(parseISO(event.endTime), "PPPpp")}
                </Text>
              </FormLabel>
              <Input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel htmlFor="location">
              Location:
              <Text as="span" fontWeight="thin" fontSize="md">
                {" "}
                {event.location}
              </Text>
            </FormLabel>
            <Input
              placeholder="Edit location"
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="categoryIds">
              Type:
              <VStack align="start" spacing={1}>
                {event.categoryIds.map((id) => (
                  <Text as="span" key={id} fontWeight="thin" fontSize="md">
                    {id === 1 && "Sports"}
                    {id === 2 && "Games"}
                    {id === 3 && "Relaxation"}
                  </Text>
                ))}
              </VStack>
            </FormLabel>
            <Select
              id="categoryIds"
              name="categoryIds"
              value={eventData.categoryIds}
              onChange={handleChange}
              placeholder="Select Category"
            >
              <option value="1">Sports</option>
              <option value="2">Games</option>
              <option value="3">Relaxation</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="image">Image</FormLabel>
            <Input
              type="text"
              id="image"
              name="image"
              value={eventData.image}
              onChange={handleChange}
              placeholder="Enter the URL of your event image"
            />
            {(event.image || eventData.image) && (
              <Box
                mt={4}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                width="150px"
              >
                <Image
                  src={eventData.image || event.image}
                  alt="Event Preview"
                  objectFit="cover"
                  width="150px"
                  height="100px"
                />
              </Box>
            )}
          </FormControl>
          <Button colorScheme="blue" type="submit" w="full">
            Edit Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
