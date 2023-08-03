import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { FormEvent, useState } from "react";
import { api } from "../utils/api";

interface AskFormProps {
  handle: string;
  allowAnonymous: boolean;
  categories: { id: string; name: string }[];
}

export default function AskForm({
  handle,
  allowAnonymous = false,
  categories = [],
}: AskFormProps) {
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");

  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const info = {
      question,
      category: String(data.get("category")).trim(),
      isAnonymous: Boolean(data.get("isAnonymous")),
    };

    const { response, data: json } = await api.askQuestion(handle, info);

    if (!response.ok) return setError(json.error);
    setQuestion("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      onChange={() => setError("")}
      noValidate
      sx={{
        backgroundColor: "rgba(150, 150, 150, 0.1)",
        padding: "20px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
        border: "2px solid",
        borderColor: error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      }}
    >
      <TextField
        label="Ask a question"
        id="question"
        name="question"
        variant="outlined"
        fullWidth
        multiline
        autoFocus
        required
        onChange={handleChange}
        value={question}
        rows={4}
        sx={{ flexGrow: 1 }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: "10px",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                name="isAnonymous"
                id="isAnonymous"
                disabled={!allowAnonymous}
                defaultChecked={false}
              />
            }
            label="Ask Anonymously"
          />
        </FormGroup>

        <Select
          id="category"
          name="category"
          displayEmpty
          defaultValue=""
          variant="outlined"
          onChange={() => setError("")}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ width: "220px", minWidth: "120px" }}
        >
          <MenuItem value="" key="none">
            <em>None</em>
          </MenuItem>

          {categories.map((cat) => (
            <MenuItem value={cat.id} key={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>

        <Button type="submit" variant="contained" color="primary">
          Ask
        </Button>
      </Box>

      <Typography variant="body2" color="error">
        {error}
      </Typography>
    </Box>
  );
}
