import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import AskForm from "../components/AskForm";
import QuestionList, { Viewer } from "../components/QuestionList";
import ProfileProvider, {
  ProfileActions,
  ProfileContext,
} from "../contexts/ProfileContext";
import InfiniteScroll from "../components/InfiniteScroll";

function ProfilePage() {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const [viewer, setViewer] = useState<Viewer>("visitor");
  const { profile, profileDispatch } = useContext(ProfileContext);
  const { sort, category, isRegex, questions, loading, hasMore } = profile;

  // on change handlers
  const changeText = (e) => setText(e.target.value);

  function changeQuery() {
    profileDispatch({
      type: ProfileActions.Update,
      payload: { query: text, page: 1 },
    });
  }
  const changeSort = (e) => {
    profileDispatch({
      type: ProfileActions.Update,
      payload: { sort: e.target.value, page: 1 },
    });
  };
  const changeRegex = (e) => {
    profileDispatch({
      type: ProfileActions.Update,
      payload: { isRegex: e.target.checked, page: 1 },
    });
  };
  const changeCategory = (e, cat) => {
    profileDispatch({
      type: ProfileActions.Update,
      payload: { category: cat, page: 1 },
    });
  };

  const fetchNext = useCallback(() => {
    profileDispatch({ type: ProfileActions.FetchNext });
  }, [profileDispatch]);

  useEffect(() => {
    if (!user) return setViewer("visitor");
    if (user.username === profile.user?.username) {
      setViewer("owner");
    } else {
      setViewer("user");
    }
  }, [user, profile.user?.username]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingX: { xs: "10px", md: "20px", lg: "60px" },
        paddingY: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Avatar
          src={profile.user?.avatar}
          alt={`${profile.user?.firstName} Avatar`}
          sx={{ width: 80, height: 80 }}
        />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">
            {profile.user?.firstName + " " + profile.user?.lastName}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            @{profile.user?.username}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Typography variant="body1">{profile.user?.bio}</Typography>
      </Box>

      {user && profile.user && (
        <AskForm
          handle={profile.user.id}
          allowAnonymous={profile.user.allowAnonymous}
          categories={profile.user.categories ?? []}
        />
      )}

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
          Answers
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
          {profile.user?.categories?.map((cat) => (
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
          <QuestionList data={questions} view="profile" viewer={viewer} />
        </InfiniteScroll>
      </Container>
    </Box>
  );
}

export default function Profile() {
  const { username } = useParams();
  return (
    <ProfileProvider username={username}>
      <ProfilePage />
    </ProfileProvider>
  );
}
