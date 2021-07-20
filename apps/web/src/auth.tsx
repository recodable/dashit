import type { ResourceReturn } from "solid-js";
import { useContext, createContext, createResource } from "solid-js";
import { useAuth0 } from "@rturnq/solid-auth0";
import { Access } from "./types";

export const AuthContext = createContext<ResourceReturn<Access[]>>();

export const AuthContextProvider = (props) => {
  const { getToken } = useAuth0();

  const resource = createResource<Access[]>(async () => {
    const token = await getToken();

    return fetch(`${import.meta.env.VITE_API_URL}/accesses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  });

  return (
    <AuthContext.Provider value={resource}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
