import React, { useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  IconButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { FiMenu, FiHome, FiUserPlus, FiSearch, FiLogOut } from "react-icons/fi";
import { IconType } from "react-icons/lib";
import AuthContext from "contexts/auth-context";

interface sidebarProps {
  children: React.ReactNode;
}

const NavItem = (props: {
  children: React.ReactNode;
  icon: IconType;
  route: string;
}) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { icon, children, route, ...rest } = props;
  return (
    <Flex
      align="center"
      py="20px"
      cursor="pointer"
      color="black"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      onClick={() => {
        if (route === "signout") {
          authContext.onSignOut();
          router.push("/login");
          return;
        }

        router.push(route);
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="2"
          boxSize="4"
          _groupHover={{
            color: "gray.600",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

const SidebarContent = (props: {
  display?: any;
  w?: string;
  borderRight?: string;
}) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      px="50px"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      w={{ base: 54, md: 60, lg: 72 }}
      {...props}
    >
      <Flex mt="50px" align="center">
        <Text textStyle="h1" fontSize="2xl" fontWeight="semibold">
          PMS
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        mt="25px"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={FiHome} route="/">
          Dashboard
        </NavItem>
        <NavItem icon={FiUserPlus} route="/patient/new">
          Add Patient
        </NavItem>
        <NavItem icon={FiSearch} route="/search">
          Search
        </NavItem>
        <NavItem icon={FiLogOut} route="signout">
          Signout
        </NavItem>
      </Flex>
    </Box>
  );
};

const Sidebar: React.FC<sidebarProps> = ({ children }) => {
  const sidebar = useDisclosure();
  return (
    <Box as="section" bg="gray.50" minH="100vh" backgroundColor="#f8f8f8">
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60, lg: 72 }} transition=".3s ease">
        <Flex
          display={{ base: "flex", md: "none" }}
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          borderBottomWidth="1px"
          borderColor="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
        </Flex>

        <Box as="main" p="4" overflow="hidden">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
