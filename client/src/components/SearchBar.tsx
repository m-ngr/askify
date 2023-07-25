import {
  Box,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { FC, useEffect, useState } from "react";

interface Props {
  onSearch: (searchText: string, isRegex: boolean) => void;
}

function isValidRegex(regex: string): boolean {
  try {
    new RegExp(regex);
    return true;
  } catch (error) {
    return false;
  }
}

const SearchBar: FC<Props> = ({ onSearch }) => {
  const [text, setText] = useState("");
  const [regex, setRegex] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    if (regex && !isValidRegex(text)) setError("Invalid Regex");
  }, [text, regex]);

  const handleSearch = () => {
    if (!error) onSearch(text, regex);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isRegex = event.target.checked;
    setRegex(isRegex);
    if (isRegex && !isValidRegex(text)) {
      return setError("Invalid Regex");
    }
    onSearch(text, isRegex);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" gap={1}>
        <TextField
          label="Search"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ minWidth: "220px" }}
          helperText={error}
          error={Boolean(error)}
        />

        <IconButton
          color="primary"
          onClick={handleSearch}
          sx={{ width: "56px", height: "56px" }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      <FormControlLabel
        control={
          <Switch checked={regex} onChange={handleSwitch} color="primary" />
        }
        label="Regex"
        sx={{ m: 0 }}
      />
    </Box>
  );
};

export default SearchBar;
