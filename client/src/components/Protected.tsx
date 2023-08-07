import React, { FC, useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { UserActions, UserContext } from "../contexts/UserContext";
import { api } from "../utils/api";

interface ProtectedProps {
  onUnlock?: (password: string) => void;
  message: string;
  children: any;
}

const Protected: FC<ProtectedProps> = ({ onUnlock, message, children }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lock, setLock] = useState(true);
  const { user, userDispatch } = useContext(UserContext);

  useEffect(() => {
    if (user?.password) {
      setLock(false);
      if (onUnlock) onUnlock(user?.password);
    }
  }, [onUnlock, user?.password]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPassword(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await api.checkPassword(password)) {
      userDispatch({ type: UserActions.Update, payload: { password } });
    } else {
      setError("Incorrect Password");
    }
  };

  if (!lock) return children;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="flex-end">
        <LockIcon color="primary" fontSize="large" sx={{ mr: 1 }} />
        <Typography color="primary" variant="h6">
          Protected
        </Typography>
      </Box>

      <Typography>{message}</Typography>

      <TextField
        margin="none"
        label="Password"
        id="password"
        name="password"
        autoComplete="current-password"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
        onChange={handlePasswordChange}
        error={Boolean(error)}
        helperText={error}
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

      <Button variant="contained" color="primary" onClick={handleSaveClick}>
        Open
      </Button>
    </Box>
  );
};

export default Protected;
