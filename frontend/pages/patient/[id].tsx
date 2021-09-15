import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Container, Flex, Heading, SimpleGrid } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

import AuthContext from "contexts/auth-context";
import NotifyContext from "contexts/notify-context";

import { ApiRequest } from "util/request";

import type { NextPage } from "next";
import type { DB } from "@sem5-webdev/types";

interface CardProps {
  title: string;
  value?: string;
}
const ProfileCard: React.FC<CardProps> = ({ title, value }) => {
  return (
    <Flex direction="column" ml={6} mt={4}>
      <Text>{title}</Text>
      <Text fontWeight="semibold" mb={2}>
        {value || "N/A"}
      </Text>
    </Flex>
  );
};

const ProfileView: NextPage = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  // types are stupid here
  const id = parseInt(
    (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id) ||
      "0"
  );

  const [patient, setpatientData] = useState<DB.Patient.Data>();

  const FetchPatientInfo = async () => {
    let { success, data, err } = await ApiRequest<DB.Patient.Data>({
      path: `patient/${id}/`,
      method: "GET",
      token: auth.token,
    });

    if (!success || err) {
      notify.NewAlert({
        msg: "Fetching patient info failed",
        description: err,
        status: "error",
      });

      // redirect back
      router.back();
      return;
    }

    if (!data) {
      notify.NewAlert({
        msg: "Request didn't came with expected response",
        status: "error",
      });

      // redirect back
      router.back();
      return;
    }

    setpatientData(data);
  };

  // onMount
  useEffect(() => {
    (async () => {
      await FetchPatientInfo();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>
          {patient?.fname} {patient?.lname}
        </title>
        <meta name="description" content="Profile View" />
      </Head>

      <Container overflowY="auto" maxW="4xl" minH="100vh">
        <Flex align="center" pl={2} mt={5} flexDirection="column">
          <Container
            maxW="4xl"
            mt="28px"
            mb={10}
            px="35px"
            py="21px"
            shadow="md"
            bg="white"
          >
            <Heading my="20px" size="md" fontWeight="semibold">
              {patient?.fname} {patient?.lname}
            </Heading>

            <SimpleGrid columns={{ base: 2, md: 3 }} pb={4}>
              <ProfileCard title="Gender" value={patient?.gender} />
              <ProfileCard
                title="Birthday"
                value={`${patient?.dob.d} / ${patient?.dob.m} / ${patient?.dob.y}`}
              />
              <ProfileCard title="Address" value={patient?.address} />
              <ProfileCard title="Email" value={patient?.email} />
              <ProfileCard title="Contact Number" value={patient?.tp} />
            </SimpleGrid>
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default ProfileView;
