import React from "react";

const AuthContext = React.createContext<{
  user?: API.UserData;
  token?: string;
  onSignIn: (token: string, user: API.UserData) => void;
  onSignOut: () => void;
}>({
  onSignIn: () => {},
  onSignOut: () => {},
});

export default AuthContext;
