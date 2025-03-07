import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";

export const DeleteRequest = ({ eventId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteEvent = async () => {
    try {
      const promise = fetch(
        `https://events-api-hqpz.onrender.com/events/${eventId}`,
        {
          method: "DELETE",
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      });

      toast.promise(promise, {
        loading: {
          title: "Deleting event...",
          description: "Please wait while we delete the event",
        },
        success: {
          title: "Event deleted",
          description: "The event has been successfully deleted",
        },
        error: {
          title: "Error deleting event",
          description: (error) => {
            if (error instanceof Error) {
              return error.message; // Use the error message from the fetch
            }
            return "Something went wrong, please try again";
          },
        },
      });

      await promise; // just wait the promise resolution

      onClose();
      navigate("/");
    } catch (error) {
      // No need to show another toast here, toast.promise already handles errors.
      console.error("Unexpected error:", error);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteEvent();
  };

  return (
    <>
      <Flex gap={4}>
        <Button colorScheme="red" onClick={onOpen}>
          Delete
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button mx={12} colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
