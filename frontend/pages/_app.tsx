import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import Sidebar from "../components/sidebar";
import Overlay from "../components/overlay";

import LoginPage from "./login";

import AuthContext from "../contexts/auth-context";

function MyApp({ Component, pageProps }: AppProps) {
  const [refreshToken, setrefreshToken] = useState<string>();
  const [userData, setuserData] = useState<API.UserData>();
  const onSignIn = (token: string, user: API.UserData) => {
    setrefreshToken(token);
    setuserData(user);
  };
  const onSignOut = () => {
    setrefreshToken(undefined);
    setuserData({
      id: -1,
      fname: "",
      lname: "",
      email: "",
    });
  };

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{ token: refreshToken, user: userData, onSignIn, onSignOut }}
      >
        <Overlay>
          {!!refreshToken ? (
            <Sidebar>
              <Component {...pageProps} />
            </Sidebar>
          ) : (
            <LoginPage />
          )}
        </Overlay>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}
export default MyApp;
