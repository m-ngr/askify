import React from "react";
import { Box, Container, List, ListItem, Typography } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h1" component="h1" align="center" gutterBottom>
        Askify
      </Typography>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        Welcome to Askify, an anonymous Q&A platform where you can ask and
        answer questions.
      </Typography>

      <Box
        sx={{
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#f5f5f5",
          my: 5,
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{ textAlign: "center", marginBottom: "10px" }}
        >
          IMPORTANT
        </Typography>

        <List style={{ listStyle: "disc" }}>
          <ListItem
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography color="primary" variant="h5">
              Wait !
            </Typography>
            <Typography variant="body1">
              Please be patient for 1 minute while Askify's backend boots up.
              Due to the utilization of a free service, this short wait is
              necessary before you can start using the platform.
            </Typography>
          </ListItem>

          <ListItem
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography color="primary" variant="h6">
              Still under development
            </Typography>
            <Typography variant="body1">
              Askify is currently under development, with some features
              functional and others still in progress.
            </Typography>
          </ListItem>

          <ListItem
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography color="primary" variant="h6">
              Fragile UI: Askify's Future Overhaul Planned
            </Typography>
            <Typography variant="body1">
              Please be aware that the current UI of Askify is temporary and may
              be fragile, with the potential for easy breakage. Once the app
              achieves full functionality, the UI will undergo a complete
              overhaul.
            </Typography>
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default Home;
