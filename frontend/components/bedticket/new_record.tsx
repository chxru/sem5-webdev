import React, { useContext, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

import AuthContext from "contexts/auth-context";
import NotifyContext from "contexts/notify-context";

import { ApiRequest } from "util/request";

import type { DB } from "@sem5-webdev/types";

interface newProps {
  isOpen: boolean;
  onClose: () => void;
  bid?: number;
  refresh: () => Promise<void>;
}

const NewRecord: React.FC<newProps> = ({ isOpen, onClose, bid, refresh }) => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<DB.Patient.BedTicketEntry, "created_at">>();

  const [acceptedFiles, setacceptedFiles] = useState<File[]>([]);
  const onDropAccepted = (file: File[]) => {
    // prevent duplications
    let duplicate = false;
    for (const f of acceptedFiles) {
      if (f.name == file[0].name && f.size == file[0].size) {
        duplicate = true;
        break;
      }
    }

    if (duplicate) {
      notify.NewAlert({
        status: "warning",
        msg: "Dupicate attachment",
      });
      return;
    }

    setacceptedFiles((f) => [...f, file[0]]);
  };

  const onDropRejected = () => {
    notify.NewAlert({ msg: "Only images are supported", status: "error" });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDropAccepted,
    onDropRejected,
  });

  const OnSubmit = async (value: DB.Patient.BedTicketEntry) => {
    const formData = new FormData();

    for (const file of acceptedFiles) {
      formData.append("files", file);
    }

    formData.append("category", value.category);
    formData.append("type", value.type);
    formData.append("note", value.note);

    const { success, err } = await ApiRequest({
      path: `bedtickets/${bid}`,
      method: "POST",
      obj: formData,
      token: auth.token,
    });

    if (!success) {
      notify.NewAlert({
        msg: "Invalid form data",
        description: err,
        status: "error",
      });
      return;
    }

    notify.NewAlert({
      msg: "New entry record saved",
      status: "success",
    });

    // refetch entries
    // TODO: combine with add new request
    await refresh();

    reset();

    setacceptedFiles([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Add New Entry</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(OnSubmit)}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select record type"
                {...register("category", { required: true })}
              >
                <option value="diagnosis">Diagnosis</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </Select>
              {errors.type && (
                <FormHelperText>This field is required</FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Entry Type</FormLabel>
              <Input {...register("type", { required: true })} />
            </FormControl>

            <FormControl>
              <FormLabel>Attachments</FormLabel>
              <Flex
                {...getRootProps()}
                marginY="4"
                paddingY="4"
                paddingX="6"
                bg="gray.100"
                rounded="md"
              >
                <input {...getInputProps()} />
                <p>Drag and drop attachments here, or click to select files</p>
              </Flex>

              {acceptedFiles.length != 0 && (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Filename</Th>
                      <Th>Size</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {acceptedFiles.map((file, i) => {
                      return (
                        <Tr key={file.name + file.size}>
                          <Td>{file.name}</Td>
                          <Td>
                            {file.size < 1000000
                              ? (file.size / 1000).toFixed(1) + " KB"
                              : (file.size / 1000000).toFixed(1) + " MB"}
                          </Td>
                          <Td>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setacceptedFiles((files) => {
                                  const temp = [...files];
                                  temp.splice(i, 1);
                                  return temp;
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea {...register("note")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="facebook" mr={3}>
              Submit
            </Button>
            <Button
              type="reset"
              onClick={() => {
                reset();
                setacceptedFiles([]);
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewRecord;
