import {
  Card,
  CardHeader,
  Avatar,
  Typography,
  CardContent,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link as RouterLink } from "react-router-dom";
import useViewer from "../hooks/useViewer";

export default function ProfileHeader({ profile }) {
  const viewer = useViewer(profile?.user?.username ?? "");

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        gap: "20px",
        flexDirection: "column",
      }}
    >
      <CardHeader
        sx={{ p: 0 }}
        avatar={
          <Avatar
            src={profile.user?.avatar}
            alt={`${profile.user?.firstName} Avatar`}
            sx={{ width: 80, height: 80 }}
          />
        }
        title={
          <Typography variant="h6">
            {profile.user?.firstName + " " + profile.user?.lastName}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle1" color="text.secondary">
            @{profile.user?.username}
          </Typography>
        }
        action={
          viewer === "owner" && (
            <IconButton
              sx={{ m: 1 }}
              component={RouterLink}
              to={"/me/settings"}
            >
              <SettingsIcon />
            </IconButton>
          )
        }
      />

      <CardContent style={{ padding: "0px 20px" }}>
        <Typography variant="body1">{profile.user?.bio}</Typography>
      </CardContent>
    </Card>
  );
}
