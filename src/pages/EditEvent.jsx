import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";

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
    <>
      <form onSubmit={handleSubmit}>
        <FormControl m={8}>
          <FormLabel htmlFor="title">Event Title: {event.title}</FormLabel>
          <Input
            w="30%"
            placeholder="Edit title"
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl m={8}>
          <FormLabel htmlFor="description">
            Event Description: {event.description}
          </FormLabel>
          <Textarea
            w="30%"
            placeholder="Edit description"
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            minH={8}
          />
        </FormControl>
        <FormControl m={8}>
          <FormLabel htmlFor="startTime">
            Start Time: {event.startTime}
          </FormLabel>
          <Input
            w="30%"
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl m={8}>
          <FormLabel htmlFor="endTime">End Time: {event.endTime}</FormLabel>
          <Input
            w="30%"
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl m={8}>
          <FormLabel htmlFor="location">Location: {event.location}</FormLabel>
          <Input
            w="30%"
            placeholder="Edit location"
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl m={8}>
          <FormLabel htmlFor="categoryIds">Event Type</FormLabel>
          <Select
            w="30%"
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
        <FormControl m={8}>
          <FormLabel htmlFor="image">Event Image</FormLabel>
          <div>
            <Input
              w="30%"
              type="text"
              id="image"
              name="image"
              value={eventData.image}
              onChange={handleChange}
              placeholder="Enter the URL of your event image"
            />
          </div>
        </FormControl>
        <Button type="submit">Edit Event</Button>
      </form>
    </>
  );
};
