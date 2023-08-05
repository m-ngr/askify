import { useState, FormEvent, useContext, useEffect, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import InfoIcon from "@mui/icons-material/Info";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { UserActions, UserContext } from "../../contexts/UserContext";
import { api } from "../../utils/api";

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio: string;
}

const initValues: ProfileForm = {
  firstName: "",
  lastName: "",
  username: "",
  avatar: "",
  bio: "",
};

const avatarInfo =
  "Because we are using a free service, it is not possible to store any assets on the server. Please provide a URL for your image, ensuring that CORS is enabled.";

export default function ProfileSettings() {
  const [showInfo, setShowInfo] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [values, setValues] = useState<ProfileForm>(initValues);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const { user, userLoading, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        navigate("/login");
      } else {
        setValues({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
        });
        setAllowAnonymous(user.allowAnonymous);
      }
    }
  }, [user, navigate, userLoading]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function difference() {
    if (!user) return {};
    const diff: Partial<ProfileForm & { allowAnonymous: boolean }> = {};
    if (allowAnonymous !== user.allowAnonymous)
      diff.allowAnonymous = allowAnonymous;

    Object.keys(values).forEach((key) => {
      const value = values[key].trim();
      if (value !== user[key]) diff[key] = value;
    });

    return diff;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { response, data } = await api.updateUser(difference());
    if (!response.ok) return; // should handle errors
    setErrors(data.errors);
    userDispatch({ type: UserActions.Update, payload: data.modified });
    // should show something at success
  };

  return (
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
            label="Avatar URL"
            placeholder="Provide a URL for your photo"
            id="avatar"
            name="avatar"
            type="url"
            fullWidth
            value={values.avatar}
            onChange={handleChange}
            error={Boolean(errors.avatar)}
            helperText={errors.avatar}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={avatarInfo}>
                    <IconButton onClick={() => setShowInfo((p) => !p)}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          {showInfo && (
            <Alert severity="info" sx={{ mt: 1 }}>
              {avatarInfo}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Bio"
            id="bio"
            name="bio"
            fullWidth
            value={values.bio}
            onChange={handleChange}
            error={Boolean(errors.bio)}
            helperText={errors.bio}
            multiline
            rows={5}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={allowAnonymous} />}
            onChange={() => setAllowAnonymous((p) => !p)}
            label="Allow Anonymous Questions"
          />
        </Grid>
      </Grid>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save
      </Button>
    </Box>
  );
}
