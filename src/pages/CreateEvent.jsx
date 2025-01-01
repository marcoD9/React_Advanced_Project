import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  Box,
  Image,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateEvent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    image: "",
  });

  // Function to handle checkboxes
  const handleCategoryChange = (categoryId) => {
    setEventData((prevData) => {
      const { categoryIds } = prevData;
      const updatedCategoryIds = categoryIds.includes(categoryId)
        ? categoryIds.filter((id) => id !== categoryId) // Remove category if it is already there
        : [...categoryIds, categoryId]; // Add category if it's not
      return { ...prevData, categoryIds: updatedCategoryIds };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createEvent = async () => {
    const promise = fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(eventData),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    toast.promise(promise, {
      loading: {
        title: "Saving changes...",
        description: "Please wait while we create the event",
      },
      success: {
        title: "Event created",
        description: "The event has been successfully created",
      },
      error: {
        title: "Error creating event",
        description: "Something went wrong, please try again",
      },
    });

    const response = await promise;

    if (response.ok) {
      const newEvent = await response.json();
      navigate(`/event/${newEvent.id}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent();
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              minH={8}
            />
          </FormControl>
          <SimpleGrid columns={[1, null, 2]} spacing={4}>
            <FormControl>
              <FormLabel htmlFor="startTime">Start Time</FormLabel>
              <Input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
              <Input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
              />
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Categories</FormLabel>
            <VStack align="start">
              <Checkbox
                isChecked={eventData.categoryIds.includes(1)}
                onChange={() => handleCategoryChange(1)}
              >
                Sports
              </Checkbox>
              <Checkbox
                isChecked={eventData.categoryIds.includes(2)}
                onChange={() => handleCategoryChange(2)}
              >
                Games
              </Checkbox>
              <Checkbox
                isChecked={eventData.categoryIds.includes(3)}
                onChange={() => handleCategoryChange(3)}
              >
                Relaxation
              </Checkbox>
            </VStack>
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
            {eventData.image && (
              <Box
                mt={4}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                width="150px"
              >
                <Image
                  src={eventData.image}
                  alt="Event Preview"
                  objectFit="cover"
                  width="150px"
                  height="100px"
                />
              </Box>
            )}
          </FormControl>
          <Button colorScheme="blue" type="submit" w="full">
            Create Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
