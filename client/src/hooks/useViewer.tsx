import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";

type Viewer = "visitor" | "user" | "owner";

export default function useViewer(username: string) {
  const { user } = useContext(UserContext);
  const [viewer, setViewer] = useState<Viewer>("visitor");

  useEffect(() => {
    if (!user) return setViewer("visitor");
    if (user.username.toLowerCase().trim() === username.toLowerCase().trim()) {
      setViewer("owner");
    } else {
      setViewer("user");
    }
  }, [user, username]);

  return viewer;
}
