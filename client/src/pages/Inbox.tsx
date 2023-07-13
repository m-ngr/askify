import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Container,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Tab,
  Tabs,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import { fetcher } from "../utils/fetcher";

export default function Inbox() {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerElement = useRef<HTMLDivElement>(null);

  // on change handlers
  const changeText = (e) => setText(e.target.value);
  function changeQuery() {
    setPage(1);
    setQuery(text);
  }
  const changeSort = (e) => {
    setPage(1);
    setSort(e.target.value);
  };
  const changeRegex = (e) => {
    setPage(1);
    setIsRegex(e.target.checked);
  };
  const changeCategory = (e, cat) => {
    setPage(1);
    setCategory(cat);
  };

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setLoading(true);
        const regex = isRegex ? "&regex" : "";
        const qs = `q=${query}${regex}&sort=${sort}&cat=${category}&page=${page}`;

        const response = await fetcher(`/users/me/inbox?${qs}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        const json = await response.json();
        if (response.ok) {
          if (page === 1) {
            setQuestions(json.questions);
          } else {
            setQuestions((prev) => [...prev, ...json.questions]);
          }
          setHasMore(Boolean(json.questions.length));
        } else {
          setHasMore(false);
        }
      } catch {
        setHasMore(false);
      }

      setLoading(false);
    }

    fetchData();

    return () => controller.abort();
  }, [category, isRegex, page, query, sort]);

  const changePage = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target: any = entries[0];
      if (target.isIntersecting) {
        changePage();
      }
    };

    if (observerElement.current) {
      const observer = new IntersectionObserver(handleObserver, options);
      observer.observe(observerElement.current);
      return () => observer.disconnect();
    }
  }, [changePage]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        flexGrow: 1,
        p: 0,
      }}
    >
      <Typography variant="h5" align="center" sx={{ mb: 4 }}>
        Inbox Page
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Box display="flex" alignItems="center">
            <TextField
              label="Search"
              fullWidth
              value={text}
              onChange={changeText}
              sx={{ minWidth: "220px" }}
            />
            <IconButton color="primary" onClick={changeQuery}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} sm={2} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isRegex}
                onChange={changeRegex}
                color="primary"
              />
            }
            label="Regex"
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sort}
              label="Sort By"
              onChange={changeSort}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Tabs
        value={category}
        onChange={changeCategory}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
        sx={{ p: 1, maxWidth: "100%", mt: 2, bgcolor: "background.paper" }}
      >
        <Tab label="All" value="" />
        <Tab label="General" value={"none"} />
        {user?.categories?.map((cat) => (
          <Tab label={cat.name} value={cat.id} key={cat.id} />
        ))}
      </Tabs>

      <List sx={{ mt: 4, width: "100%" }}>
        {questions.map((question) => (
          <ListItem key={question.id} disableGutters sx={{ mb: 2 }}>
            <ListItemText primary={question.question} />
          </ListItem>
        ))}
      </List>

      {loading && <CircularProgress />}

      {hasMore && (
        <div ref={observerElement} onClick={changePage}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Load More
          </Button>
        </div>
      )}

      {!hasMore && (
        <Typography variant="subtitle1" color="GrayText">
          No More Content
        </Typography>
      )}
    </Container>
  );
}
