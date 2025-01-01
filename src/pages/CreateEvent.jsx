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

  const titleError = !eventData.title;
  const descriptionError = !eventData.description;
  const locationError = !eventData.location;
  const startTimeError = !eventData.startTime;
  const endTimeError = !eventData.endTime;
  const imageError = !eventData.image;
  const categoryError = eventData.categoryIds.length === 0;

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
    if (eventData.categoryIds.length === 0) {
      // Mostra un messaggio di errore specifico per le categorie
      alert("Devi selezionare almeno una categoria");
      return;
    }
    // Check for errors using error variables
    if (
      titleError ||
      descriptionError ||
      locationError ||
      startTimeError ||
      endTimeError ||
      imageError ||
      categoryError
    ) {
      return; // Prevent form submission if there are errors
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
              <FormHelperText>Enter your event's title</FormHelperText>
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
              <FormHelperText>Enter your event's description</FormHelperText>
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
                <FormHelperText>Enter your event's start time</FormHelperText>
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
                <FormHelperText>Enter your event's end time</FormHelperText>
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
              <FormHelperText>Enter your event's location</FormHelperText>
            ) : (
              <FormErrorMessage>Location is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={categoryError}>
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
              <FormHelperText>Enter your event's image</FormHelperText>
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
