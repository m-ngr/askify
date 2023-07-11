import { createContext, useEffect, useReducer } from "react";
import { fetcher } from "../utils/fetcher";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  followers: number;
  following: number;
  allowAnonymous: boolean;
  categories: string[]; // may be deleted
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
        return null;
      }
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

export const UserContext = createContext<{
  user: State;
  userDispatch: React.Dispatch<Action>;
}>({
  user: null,
  userDispatch: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetcher("/users/me", { credentials: "include" });
      const json = await res.json();
      if (res.ok) userDispatch({ type: UserActions.Set, payload: json });
    }

    loadUser();
  }, [userDispatch]);

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};
