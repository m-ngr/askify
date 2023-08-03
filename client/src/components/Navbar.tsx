import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { useContext } from "react";
import { UserActions, UserContext } from "../contexts/UserContext";
import { api } from "../utils/api";

export default function Navbar() {
  const { user, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();

  function logout() {
    api.logout().finally(() => {
      userDispatch({ type: UserActions.Reset });
      navigate("/login");
    });
  }

  let NavButtons = [
    <Button color="inherit" component={RouterLink} to="login" key="login">
      Login
    </Button>,
    <Button color="inherit" component={RouterLink} to="signup" key="signup">
      Signup
    </Button>,
  ];

  if (user) {
    NavButtons = [
      <Button
        color="inherit"
        component={RouterLink}
        to={"/me/inbox"}
        key="inbox"
      >
        Inbox
      </Button>,
      <Button
        color="inherit"
        component={RouterLink}
        to={`/${user.username}`}
        key="profile"
      >
        {user.firstName}
      </Button>,
      <Button color="inherit" onClick={logout} key="logout">
        Logout
      </Button>,
    ];
  }

  return (
    <Box sx={{ flexGrow: 1, maxHeight: "65px" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <Link
              color="inherit"
              underline="none"
              component={RouterLink}
              to="/"
            >
              Askify
            </Link>
          </Typography>

          {NavButtons}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
