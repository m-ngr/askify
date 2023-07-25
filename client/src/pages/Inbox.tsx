import { useCallback, useContext } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  Tab,
  Tabs,
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
import SearchBar from "../components/SearchBar";

function InboxPage() {
  const { user } = useContext(UserContext);
  const { inbox, inboxDispatch } = useContext(InboxContext);

  const { sort, category, questions, loading, hasMore } = inbox;

  // on change handlers
  function handleSearch(query: string, isRegex: boolean) {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { query, isRegex, page: 1 },
    });
  }

  const changeSort = (e) => {
    inboxDispatch({
      type: InboxActions.Update,
      payload: { sort: e.target.value, page: 1 },
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

      <Grid container spacing={2} gap={1}>
        <Grid item xs>
          <SearchBar onSearch={handleSearch} />
        </Grid>

        <Grid item xs={12} sm={3} md={2}>
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
