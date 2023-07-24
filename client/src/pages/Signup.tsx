import { useState, FormEvent, useContext, useEffect, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { api } from "../api";

interface SignupForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const initValues: SignupForm = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<SignupForm>(initValues);
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { response, data } = await api.signup(values);

    if (response.ok) return navigate("/login");

    if (response.status >= 500) {
      // server error: should notify the user to try again later.
      return;
    }

    setErrors(data.errors);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                id="firstName"
                name="firstName"
                autoComplete="first-name"
                required
                fullWidth
                autoFocus
                value={values.firstName}
                onChange={handleChange}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                fullWidth
                value={values.lastName}
                onChange={handleChange}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Username"
                id="username"
                name="username"
                autoComplete="username"
                required
                fullWidth
                value={values.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email Address"
                id="email"
                name="email"
                autoComplete="email"
                required
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                fullWidth
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2" component={RouterLink}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/m-ngr/askify"
        target="_blank"
      >
        Askify
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
