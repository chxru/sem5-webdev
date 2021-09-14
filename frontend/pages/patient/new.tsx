import React, { useContext, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

import AuthContext from "contexts/auth-context";
import NotifyContext from "contexts/notify-context";

import { ApiRequest } from "util/request";

import type { API } from "@sem5-webdev/types";

const NewPatientPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);
  const router = useRouter();

  const today = new Date();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<API.Patient.RegistrationForm>();

  const [submitting, setsubmitting] = useState<boolean>(false);

  const Submit = async (values: API.Patient.RegistrationForm) => {
    setsubmitting(true);

    // remove empty fields from the values object
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (!values[key]) {
          delete values[key];
        }
      }
    }

    const { success, data, err } = await ApiRequest<{ id: number }>({
      path: "patient/add",
      method: "POST",
      obj: values,
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
      msg: "New patient record saved",
      status: "success",
    });

    if (!data) {
      notify.NewAlert({
        msg: "No patient id received",
        description:
          "Cannot redirect to patient profile due to lack of patient id in the database response",
        status: "info",
      });
    } else {
      router.push(`/patient/${data}`);
    }
  };

  return (
    <>
      <Head>
        <title>New Patient</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="4xl" minH="100vh">
        <Heading mt={{ base: "0", md: "35px" }} size="md" fontWeight="semibold">
          Add New Patient
        </Heading>

        <Container
          maxW="4xl"
          bg="white"
          mt="35px"
          px="35px"
          py="21px"
          shadow="md"
          borderRadius="lg"
        >
          <Heading fontWeight="medium" size="md">
            Basic Details
          </Heading>

          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
            gap={7}
            mt="15px"
            pt="15px"
          >
            <GridItem>
              <FormControl id="fname" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input type="text" {...register("fname", { required: true })} />
                <FormHelperText>{errors.fname?.message}</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="lname">
                <FormLabel>Last Name</FormLabel>
                <Input type="text" {...register("lname")} />
                <FormHelperText>{errors.lname?.message}</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup colorScheme="teal" mt={3} {...field}>
                      <HStack>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="dob">
                <FormLabel>Date of Birthday</FormLabel>
                <HStack>
                  <Controller
                    name="dob.d"
                    control={control}
                    render={({ field }) => (
                      <NumberInput min={1} max={31} {...field}>
                        <NumberInputField placeholder="DD" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <Controller
                    name="dob.m"
                    control={control}
                    render={({ field }) => (
                      <NumberInput min={1} max={12} {...field}>
                        <NumberInputField placeholder="MM" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <Controller
                    name="dob.y"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        min={1990}
                        max={today.getFullYear()}
                        {...field}
                      >
                        <NumberInputField placeholder="YYYY" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                </HStack>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 1, sm: 2 }}>
              <FormControl id="address" isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  {...register("address", { required: true })}
                />
                <FormHelperText>{errors.address?.message}</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register("email")} />
                <FormHelperText>{errors.email?.message}</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="tp" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" {...register("tp", { required: true })} />
                <FormHelperText>{errors.tp?.message}</FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>
        </Container>

        <Container
          maxW="4xl"
          bg="white"
          mt="35px"
          px="35px"
          py="21px"
          shadow="md"
          borderRadius="lg"
        >
          <Heading fontWeight="medium" size="md">
            Admission Details
          </Heading>

          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
            gap={7}
            mt="15px"
            pt="15px"
          >
            <GridItem>
              <FormControl id="adm_date" isRequired>
                <FormLabel>Admission date</FormLabel>
                <HStack>
                  <Controller
                    name="dob.d"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        defaultValue={today.getDate()}
                        min={1}
                        max={31}
                      >
                        <NumberInputField placeholder="DD" {...field} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <Controller
                    name="dob.d"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        defaultValue={today.getMonth() + 1}
                        min={1}
                        max={12}
                      >
                        <NumberInputField placeholder="MM" {...field} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <Controller
                    name="dob.d"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        defaultValue={today.getFullYear()}
                        min={2020}
                        max={today.getFullYear()}
                      >
                        <NumberInputField placeholder="YYYY" {...field} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                </HStack>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="adm_dic" isRequired>
                <FormLabel>Doctor in charge</FormLabel>
                <Input
                  type="text"
                  {...register("admission.dic", { required: true })}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Container>

        <Flex justify="center" mt="35px">
          <Button
            size="md"
            colorScheme="teal"
            mx="5px"
            onClick={handleSubmit(Submit)}
          >
            Register
          </Button>
          <Button size="md" mx="5px">
            Reset
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default NewPatientPage;
