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
} from "@chakra-ui/react";

export const DeleteRequest = ({ eventId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteEvent = async () => {
    const promise = fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
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
        description: "Something went wrong, please try again",
      },
    });

    const response = await promise;
    if (response.ok) {
      onClose(); // Close the modal after successful deletion
      navigate("/"); // Redirect to events list on success
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteEvent();
  };

  return (
    <>
      <Button w="10%" colorScheme="red" onClick={onOpen}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button mx={12} colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};