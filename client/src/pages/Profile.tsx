import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetcher } from "../utils/fetcher";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import AskForm from "../components/AskForm";

/** @todo REFACTOR AND REMOVE DUPLICATION (UserContext.tsx) */
interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  allowAnonymous: boolean;
  categories: { id: string; name: string }[];
}

export default function Profile() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    async function loadProfile() {
      const res = await fetcher(`/users/${username}`);
      const json = await res.json();
      if (res.ok) return setProfile(json);
      // should say that there was an error
    }
    // to be fixed
    if (username === user?.username) {
      setProfile(user!);
    } else {
      loadProfile();
    }
  }, [username]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingX: { xs: "10px", md: "20px", lg: "60px" },
        paddingY: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Avatar
          src={profile?.avatar}
          alt={`${profile?.firstName} Avatar`}
          sx={{ width: 80, height: 80 }}
        />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">
            {profile?.firstName + " " + profile?.lastName}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            @{profile?.username}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Typography variant="body1">{profile?.bio}</Typography>
      </Box>

      {user && profile && (
        <AskForm
          handle={profile.id}
          allowAnonymous={profile.allowAnonymous}
          categories={profile.categories ?? []}
        />
      )}

      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Questions
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <List sx={{ width: "100%", maxWidth: 800, background: "#ccc3" }}>
          <ListItem>
            <ListItemText primary="Question 1" secondary="By John Doe" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Question 2" secondary="By John Doe" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Question 3" secondary="By John Doe" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
