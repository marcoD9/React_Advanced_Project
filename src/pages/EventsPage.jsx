import { CardBody, Heading, Image, Card } from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  return { events: await events.json() };
};

export const EventsPage = () => {
  const { events } = useLoaderData();

  return (
    <div className="events-list">
      <Heading>List of events</Heading>
      {events.map((event) => (
        <Card key={event.id}>
          <CardBody m={16}>
            <div className="event">
              <Link to={`event/${event.id}`}>
                <Image src={event.image} alt={event.title} />
                <Heading>{event.title}</Heading>
              </Link>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
