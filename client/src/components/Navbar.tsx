import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function Navbar() {
  let NavButtons = [
    <Button color="inherit" component={RouterLink} to="login" key="login">
      Login
    </Button>,
    <Button color="inherit" component={RouterLink} to="signup" key="signup">
      Signup
    </Button>,
  ];

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
