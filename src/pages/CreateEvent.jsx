import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateEvent = () => {
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

  const handleChange = (e) => {
    setEventData(e.target);
  };

  const createEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(eventData),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.status}`);
      }

      const newEvent = await response.json();
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form onSubmit={createEvent}>
      <FormControl>
        <FormLabel htmlFor="title">Event Title</FormLabel>
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
        <FormLabel htmlFor="description">Event Description</FormLabel>
        <Textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          required
          minH={8}
        />
      </FormControl>
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
        <FormLabel htmlFor="categoryIds">Event Type</FormLabel>
        <Select
          id="categoryIds"
          name="categoryIds"
          value={eventData.categoryIds}
          onChange={handleChange}
        >
          <option value="1">Sports</option>
          <option value="2">Games</option>
          <option value="3">Relaxation</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="imageUrl">Event Image</FormLabel>
        <div>
          <Input
            type="text"
            id="image"
            name="image"
            value={eventData.image}
            onChange={handleChange}
            placeholder="Enter the URL of your event image or upload a file"
          />
        </div>
      </FormControl>
      <Button type="submit">Create Event</Button>
    </form>
  );
};