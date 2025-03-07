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
  FormHelperText,
  FormErrorMessage,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

export const loader = async () => {
  try {
    const responseCategories = await fetch(
      "https://events-api-hqpz.onrender.com/categories"
    );
    if (!responseCategories.ok) {
      throw new Error(
        `Failed to fetch categories: ${responseCategories.statusText}`
      );
    }
    const categories = await responseCategories.json();
    console.log("Categories from loader:", categories);
    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
};

export const CreateEvent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const data = useLoaderData();
  const categories = data?.categories || [];

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    category: null,
    image: "",
  });

  const titleError = !eventData.title;
  const descriptionError = !eventData.description;
  const locationError = !eventData.location;
  const startTimeError = !eventData.startTime;
  const endTimeError = !eventData.endTime;
  const imageError = !eventData.image;
  const categoryError = !eventData.category;

  useEffect(() => {
    setEventData((prevData) => ({
      ...prevData,
      category: null,
    }));
  }, []);

  const handleCategoryChange = (category) => {
    setEventData((prevData) => ({
      ...prevData,
      category: category,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createEvent = async () => {
    try {
      const response = await fetch(
        "https://events-api-hqpz.onrender.com/events",
        {
          method: "POST",
          body: JSON.stringify(eventData),
          headers: { "Content-Type": "application/json;charset=utf-8" },
        }
      );

      if (!response.ok) {
        toast({
          title: "Failed to create event",
          description: "The event could not be created. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast.promise(Promise.resolve(response), {
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

      const newEvent = await response.json();
      navigate(`/event/${newEvent.id}`);
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
    if (
      titleError ||
      descriptionError ||
      locationError ||
      startTimeError ||
      endTimeError ||
      imageError ||
      categoryError
    ) {
      return;
    }
    await createEvent();
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={titleError}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
            />
            {!titleError ? (
              <FormHelperText>Enter the title</FormHelperText>
            ) : (
              <FormErrorMessage>Title is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={descriptionError}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              minH={8}
            />
            {!descriptionError ? (
              <FormHelperText>Enter a description</FormHelperText>
            ) : (
              <FormErrorMessage>Description is required.</FormErrorMessage>
            )}
          </FormControl>
          <SimpleGrid columns={[1, null, 2]} spacing={4}>
            <FormControl isInvalid={startTimeError}>
              <FormLabel htmlFor="startTime">Start Time</FormLabel>
              <Input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
              />{" "}
              {!startTimeError ? (
                <FormHelperText>Enter the start time</FormHelperText>
              ) : (
                <FormErrorMessage>Date is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={endTimeError}>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
              <Input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
              />
              {!endTimeError ? (
                <FormHelperText>Enter the end time</FormHelperText>
              ) : (
                <FormErrorMessage>Date is required.</FormErrorMessage>
              )}
            </FormControl>
          </SimpleGrid>
          <FormControl isInvalid={locationError}>
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
            />
            {!locationError ? (
              <FormHelperText>Enter the location</FormHelperText>
            ) : (
              <FormErrorMessage>Location is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={categoryError}>
            <FormLabel>Categories</FormLabel>
            <VStack align="start">
              {categories.map((category) => {
                const capitalizedName =
                  category.name.charAt(0).toUpperCase() +
                  category.name.slice(1);
                return (
                  <Checkbox
                    key={category.id}
                    isChecked={
                      eventData.categories &&
                      eventData.categories.some((c) => c.name === category.name)
                    }
                    onChange={() => handleCategoryChange(category)}
                  >
                    {capitalizedName}
                  </Checkbox>
                );
              })}
            </VStack>
            {categoryError && (
              <FormErrorMessage>Choose one or more categories</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={imageError}>
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
            {!imageError ? (
              <FormHelperText>Enter an image</FormHelperText>
            ) : (
              <FormErrorMessage>Image is required.</FormErrorMessage>
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
