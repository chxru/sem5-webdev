import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import Overlay from "../components/overlay";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Overlay>
        <Component {...pageProps} />
      </Overlay>
    </ChakraProvider>
  );
}
export default MyApp;
