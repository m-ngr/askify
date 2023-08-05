import { createContext, useEffect, useReducer, useState } from "react";
import { api } from "../utils/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  allowAnonymous: boolean;
  categories: { id: string; name: string }[];
}

export enum UserActions {
  Set,
  Reset,
  Update,
}

type State = User | null;

type Action =
  | { type: UserActions.Set; payload: User }
  | { type: UserActions.Reset }
  | { type: UserActions.Update; payload: Partial<User> };

const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case UserActions.Set:
      return action.payload;
    case UserActions.Reset:
      return null;
    case UserActions.Update:
      if (state === null) {
        return action.payload as User;
      }
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

export const UserContext = createContext<{
  user: State;
  userLoading: boolean;
  userDispatch: React.Dispatch<Action>;
}>({
  user: null,
  userLoading: true,
  userDispatch: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { response, data } = await api.loadUser();
      if (response.ok)
        userDispatch({ type: UserActions.Update, payload: data });
      setUserLoading(false);
    }

    async function loadCats() {
      const { response, data } = await api.loadCategories();
      if (response.ok)
        userDispatch({ type: UserActions.Update, payload: data });
    }

    try {
      loadUser();
      loadCats();
    } catch {
      setUserLoading(false);
    }
  }, [userDispatch]);

  return (
    <UserContext.Provider value={{ user, userLoading, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};
