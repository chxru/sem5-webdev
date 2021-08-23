import React from "react";
import Head from "next/head";
import {
  Button,
  Container,
  Flex,
  FormControl,
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

const NewPatientPage: React.FC = () => {
  const today = new Date();
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
                <Input type="text" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="lname" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <RadioGroup colorScheme="teal" mt={3}>
                  <HStack>
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="dob">
                <FormLabel>Date of Birthday</FormLabel>
                <HStack>
                  <NumberInput min={1} max={31}>
                    <NumberInputField placeholder="DD" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <NumberInput min={1} max={12}>
                    <NumberInputField placeholder="MM" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <NumberInput min={1} max={today.getFullYear()}>
                    <NumberInputField placeholder="YYYY" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 1, sm: 2 }}>
              <FormControl id="address" isRequired>
                <FormLabel>Address</FormLabel>
                <Input type="text" />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input type="email" />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="tp" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" />
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
                  <NumberInput defaultValue={today.getDate()} min={1} max={31}>
                    <NumberInputField placeholder="DD" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <NumberInput
                    defaultValue={today.getMonth() + 1}
                    min={1}
                    max={12}
                  >
                    <NumberInputField placeholder="MM" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <NumberInput
                    defaultValue={today.getFullYear()}
                    min={2020}
                    max={today.getFullYear()}
                  >
                    <NumberInputField placeholder="YYYY" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl id="adm_dic" isRequired>
                <FormLabel>Doctor in charge</FormLabel>
                <Input type="text" />
              </FormControl>
            </GridItem>
          </Grid>
        </Container>

        <Flex justify="center" mt="35px">
          <Button size="md" colorScheme="teal" mx="5px">
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
