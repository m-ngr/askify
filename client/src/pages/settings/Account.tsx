import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Protected from "../../components/Protected";
import { UserActions, UserContext } from "../../contexts/UserContext";
import { api } from "../../utils/api";

interface AccountForm {
  email: string;
  password: string;
}

const initValues: AccountForm = {
  email: "",
  password: "",
};

function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [values, setValues] = useState<AccountForm>(initValues);
  const [errors, setErrors] = useState<Partial<AccountForm>>({});
  const { user, userLoading, userDispatch } = useContext(UserContext);

  useEffect(() => {
    if (!userLoading && user) {
      setValues({
        email: user.email,
        password: user.password,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function difference() {
    if (!user) return {};
    const diff: Partial<AccountForm> = {};

    Object.keys(values).forEach((key) => {
      const value = values[key].trim();
      if (value !== user[key]) diff[key] = value;
    });

    return diff;
  }

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDeleteClick = () => setConfirmationDialogOpen(true);
  const handleCancelDelete = () => setConfirmationDialogOpen(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const diff = difference();
    const currentPassword = user?.password ?? "";

    if (diff.email) {
      const { response, data } = await api.changeEmail(
        diff.email,
        currentPassword
      );
      if (!response.ok) return; // should handle errors
      setErrors(data.errors);
      userDispatch({ type: UserActions.Update, payload: data.modified });
      // should show something at success
    }

    if (diff.password) {
      const { response, data } = await api.changePassword(
        diff.password,
        currentPassword
      );

      if (response.ok) {
        userDispatch({
          type: UserActions.Update,
          payload: { password: diff.password },
        });
        // should show something at success
      } else {
        setErrors((prev) => ({ ...prev, password: data.error }));
      }
    }
  };

  const handleConfirmDelete = async () => {
    api.deleteAccount(user?.password ?? "");
    userDispatch({ type: UserActions.Reset });
    setConfirmationDialogOpen(false);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
      >
        <TextField
          margin="none"
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

        <TextField
          margin="none"
          label="Password"
          id="password"
          name="password"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
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

        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>

        <Paper
          elevation={0}
          sx={{
            padding: "16px",
            mt: 1,
            backgroundColor: "#ffcece",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" alignItems="flex-end">
            <WarningAmberIcon
              color="error"
              fontSize="large"
              sx={{ marginRight: "8px" }}
            />
            <Typography color="error" variant="h6">
              Danger Zone
            </Typography>
          </Box>
          <Typography color="error" sx={{ margin: "8px 0" }}>
            This action is irreversible!
          </Typography>
          <Button variant="contained" color="error" onClick={handleDeleteClick}>
            Delete Account
          </Button>
        </Paper>
      </Box>

      <Dialog open={confirmationDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action is
            irreversible!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function AccountSettings() {
  return (
    <Protected message="Enter your password to access the account settings.">
      <Settings />
    </Protected>
  );
}
