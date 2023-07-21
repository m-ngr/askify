import { Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      <Footer />
    </Paper>
  );
};

export default RootLayout;
