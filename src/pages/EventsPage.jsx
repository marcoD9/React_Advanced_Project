import React, { useState } from "react";
import { Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { EventsList } from "../components/EventsList";

export const EventsPage = () => {
  return (
    <>
      <Heading>List of events</Heading>
      <EventsList />
    </>
  );
};
