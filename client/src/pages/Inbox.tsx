import { useCallback, useContext, useState } from "react";
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
  Box,
  Grid,
  Tab,
  Tabs,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import QuestionList from "../components/QuestionList";
import {
  InboxActions,
  InboxContext,
  InboxProvider,
} from "../contexts/InboxContext";
import InfiniteScroll from "../components/InfiniteScroll";

function InboxPage() {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const { inbox, inboxDispatch } = useContext(InboxContext);

  const { sort, category, isRegex, questions, loading, hasMore } = inbox;

  // on change handlers
  const changeText = (e) => setText(e.target.value);
  function changeQuery() {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { query: text, page: 1 },
    });
  }
  const changeSort = (e) => {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { sort: e.target.value, page: 1 },
    });
  };
  const changeRegex = (e) => {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { isRegex: e.target.checked, page: 1 },
    });
  };
  const changeCategory = (e, cat) => {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { category: cat, page: 1 },
    });
  };

  const fetchNext = useCallback(() => {
    inboxDispatch({ type: InboxActions.FetchNext });
  }, [inboxDispatch]);

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
        aria-label="scrollable force tabs"
        sx={{ p: 1, maxWidth: "100%", mt: 2, bgcolor: "background.paper" }}
      >
        <Tab label="All" value="all" />
        <Tab label="General" value="" />
        {user?.categories?.map((cat) => (
          <Tab label={cat.name} value={cat.id} key={cat.id} />
        ))}
      </Tabs>

      <InfiniteScroll
        loading={loading}
        hasMore={hasMore}
        fetchMore={fetchNext}
        loadingElement={<CircularProgress />}
        loadMoreElement={
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Load More
          </Button>
        }
        endElement={
          <Typography variant="subtitle1" color="GrayText">
            No More Content
          </Typography>
        }
      >
        <QuestionList data={questions} view="inbox" viewer="owner" />
      </InfiniteScroll>
    </Container>
  );
}

export default function Inbox() {
  return (
    <InboxProvider>
      <InboxPage />
    </InboxProvider>
  );
}
