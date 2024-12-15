import { Card, CardBody, Text, Image, Heading } from "@chakra-ui/react";
import React from "react";

export const EventDetails = ({ event }) => {
  return (
    <>
      <Card>
        <CardBody>
          <Image src={event.image} />
          <Heading>{event.title}</Heading>
          <Text>{event.description}</Text>
        </CardBody>
      </Card>
    </>
  );
};
