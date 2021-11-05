import React, { useContext, useState } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/react";

import AuthContext from "contexts/auth-context";
import NotifyContext from "contexts/notify-context";

import { ApiRequest } from "util/request";
import { useForm } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
  pid: string | string[] | undefined;
}

interface FormProps {
  bid: number;
}

const NewBedTicketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  refresh,
  pid,
}) => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const [loading, setloading] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<FormProps>();

  const OnSubmit = async (value: FormProps) => {
    setloading(true);

    const { success, err } = await ApiRequest({
      path: `bedtickets/new/${pid}`,
      method: "POST",
      token: auth.token,
      obj: { bid: value.bid },
    });

    console.log(err);

    if (!success || err) {
      notify.NewAlert({
        msg: "Creating new bed ticket failed",
        description: typeof err === "string" ? err : "",
        status: "error",
      });

      return;
    }

    notify.NewAlert({
      msg: "Bed ticket successfully created",
      status: "success",
    });

    // re-fetch patient details
    await refresh();

    setloading(false);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <ModalHeader>New Bed Ticket</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Enter bed number</FormLabel>
              <Input
                {...register("bid", { required: true, maxLength: 2 })}
                type="number"
              />
              {errors.bid && <FormHelperText>Invalid Bed ID</FormHelperText>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="facebook" type="submit">
              Create bed ticket
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewBedTicketModal;
