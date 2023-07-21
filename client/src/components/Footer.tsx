import { LinkedIn, GitHub, Language } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.common.black,
        color: (theme) => theme.palette.common.white,
        padding: (theme) => theme.spacing(2),
      }}
    >
      <Typography component="span" sx={{ marginRight: 1 }}>
        Coded by Mahmoud Elnagar
      </Typography>

      <LinkedIn
        sx={{
          fontSize: "2rem",
          marginLeft: 1,
          color: "white",
          cursor: "pointer",
          "&:hover": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
        onClick={() =>
          window.open("https://www.linkedin.com/in/m-ngr", "_blank")
        }
      />

      <GitHub
        sx={{
          fontSize: "2rem",
          marginLeft: 1,
          color: "white",
          cursor: "pointer",
          "&:hover": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
        onClick={() => window.open("https://www.github.com/m-ngr", "_blank")}
      />

      <Language
        sx={{
          fontSize: "2rem",
          marginLeft: 1,
          color: "white",
          cursor: "pointer",
          "&:hover": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
        onClick={() => window.open("https://m-ngr.super.site/", "_blank")}
      />
    </Box>
  );
}
