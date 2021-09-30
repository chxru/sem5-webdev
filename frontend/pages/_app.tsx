import "styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState, useContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import Sidebar from "components/sidebar";
import Overlay from "components/overlay";
import Splash from "components/splash";

import LoginPage from "pages/login";

import AuthContext from "contexts/auth-context";
import NotifyContext from "contexts/notify-context";

import type { API } from "@sem5-webdev/types";
import RegisterPage from "./register";

function MyApp({ Component, pageProps }: AppProps) {
  const notify = useContext(NotifyContext);

  const [loading, setloading] = useState<boolean>(true);
  const [count, setcount] = useState<number>();
  const [accessToken, setaccessToken] = useState<string>();
  const [userData, setuserData] = useState<API.Auth.UserData>();

  const onSignIn = (token: string, user: API.Auth.UserData) => {
    setaccessToken(token);
    setuserData(user);
  };

  const onSignOut = () => {
    setaccessToken(undefined);
    setuserData({
      id: -1,
      fname: "",
      lname: "",
      email: "",
    });
  };

  const FetchCount = async () => {
    try {
      const res = await fetch("/api/auth/count");

      if (!res.ok) {
        throw new Error("res-not-okay");
      }

      const n = await res.text();
      setcount(parseInt(n));
    } catch (error) {
      console.error(error);
      setcount(0);
    }
  };

  const RefreshAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const { success, err, data } = (await res.json()) as API.Response<{
          access_token: string;
          user: API.Auth.UserData;
        }>;

        if (!success) {
          notify.NewAlert({
            msg: "Error occured while refreshing token",
            description: err,
            status: "info",
          });
        }

        if (data?.access_token) {
          setaccessToken(data.access_token);
        }
        if (data?.user) {
          setuserData(data.user);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const onMount = async () => {
    // check database has any records for users
    // if no users are in db, promote register page
    await FetchCount();

    await RefreshAccessToken();
    setloading(false);

    // refresh access token for every 15mins
    setInterval(async () => {
      console.info("Refreshing access token");
      await RefreshAccessToken();
    }, 1000 * 60 * 15);
  };

  // onMount
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{ token: accessToken, user: userData, onSignIn, onSignOut }}
      >
        <Overlay>
          {loading ? (
            <Splash />
          ) : !!accessToken ? (
            <Sidebar>
              <Component {...pageProps} />
            </Sidebar>
          ) : count === 0 ? (
            <RegisterPage />
          ) : (
            <LoginPage />
          )}
        </Overlay>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}
export default MyApp;
