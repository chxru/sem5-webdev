import React from "react";
import type { API } from "@sem5-webdev/types";

const AuthContext = React.createContext<{
  user?: API.Auth.UserData;
  token?: string;
  onSignIn: (token: string, user: API.Auth.UserData) => void;
  onSignOut: () => void;
}>({
  onSignIn: () => {},
  onSignOut: () => {},
});

export default AuthContext;
