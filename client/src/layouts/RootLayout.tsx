import { Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <Paper
      elevation={0}
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          paddingY: "10px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Container>
    </Paper>
  );
};

export default RootLayout;
