import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  Text,
  Image,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

export const loader = async ({ params }) => {
  try {
    const responseEvent = await fetch(
      `https://events-api-hqpz.onrender.com/events/${params.eventId}`
    );
    const responseCategories = await fetch(
      `https://events-api-hqpz.onrender.com/categories`
    );

    const event = await responseEvent.json();
    const categories = await responseCategories.json();

    return { event, categories };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const EditEvent = () => {
  const { event, categories } = useLoaderData();
  const [eventData, setEventData] = useState({ ...event });
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setEventData({ ...event });
  }, [event]);

  // Handle checkboxes
  const handleCategoryChange = (category) => {
    setEventData((prevData) => {
      const { categories: currentCategories } = prevData;
      const categoryExists = currentCategories.some(
        (c) => c.name === category.name
      );
      const updatedCategories = categoryExists
        ? currentCategories.filter((c) => c.name !== category.name)
        : [...currentCategories, category];
      return { ...prevData, categories: updatedCategories };
    });
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editEvent = async () => {
    try {
      const response = await fetch(
        `https://events-api-hqpz.onrender.com/events/${event.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(eventData),
          headers: { "Content-Type": "application/json;charset=utf-8" },
        }
      );

      if (!response.ok) {
        toast({
          title: "Failed to update event",
          description: "The event could not be updated. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast.promise(Promise.resolve(response), {
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

      navigate(`/event/${event.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
                End Time:{" "}
                <Text as="span" fontWeight="thin" fontSize="md">
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
              Location:{" "}
              <Text as="span" fontWeight="thin" fontSize="md">
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
            <FormLabel>Categories</FormLabel>
            <VStack align="start" spacing={1}>
              {categories.map((category) => {
                const capitalizedName =
                  category.name.charAt(0).toUpperCase() +
                  category.name.slice(1);
                return (
                  <Checkbox
                    key={category.id}
                    isChecked={eventData.categories.some(
                      (c) => c.name === category.name
                    )}
                    onChange={() => handleCategoryChange(category)}
                  >
                    {capitalizedName}
                  </Checkbox>
                );
              })}
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
