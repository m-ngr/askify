import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slide,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikedIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { UserContext } from "../contexts/UserContext";
import { Link as RouterLink } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";
import { ProfileActions, ProfileContext } from "../contexts/ProfileContext";
import { fetcher } from "../utils/fetcher";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface QuestionCardProps {
  id: string;
  avatar: string;
  name: string;
  date: string;
  category: { id: string; name: string };
  question: string;
  answer: string;
  likes: number;
  comments: number;
}

const InboxQuestion: React.FC<QuestionCardProps> = ({
  id,
  avatar,
  name,
  date,
  category,
  question,
  answer,
  likes,
  comments,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const [eraseMenuOpen, setEraseMenuOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState(answer);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [userComment, setUserComment] = useState("");

  const { user } = useContext(UserContext);
  const {
    deleteQuestion,
    changeQuestionCategory,
    answerQuestion,
    deleteAnswer,
    profileDispatch,
  } = useContext(ProfileContext);

  const fetchLiked = useCallback(async () => {
    const res = await fetcher(`/questions/${id}/likes`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (res.ok) {
      setLiked(json.liked);
      profileDispatch({
        type: ProfileActions.UpdateQuestion,
        payload: { id, update: { likes: json.likes } },
      });
    }
  }, [id, profileDispatch]);

  useEffect(() => {
    fetchLiked();
  }, [fetchLiked]);

  async function switchLike() {
    const method = liked ? "DELETE" : "POST";
    const res = await fetcher(`/questions/${id}/likes`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) setLiked((prev) => !prev);
    fetchLiked();
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleMoveMenuOpen = () => {
    setMoveMenuOpen(true);
    handleMenuClose();
  };

  const handleMoveMenuClose = () => setMoveMenuOpen(false);

  const handleCategorySelect = (category: string) => {
    changeQuestionCategory(id, category);
    handleMoveMenuClose();
  };

  const handleDeleteMenuOpen = () => {
    setDeleteMenuOpen(true);
    handleMenuClose();
  };

  const handleDeleteMenuClose = () => setDeleteMenuOpen(false);

  const handleDelete = () => {
    deleteQuestion(id);
    handleDeleteMenuClose();
  };

  const handleEraseMenuOpen = () => {
    setEraseMenuOpen(true);
    handleMenuClose();
  };

  const handleEraseMenuClose = () => setEraseMenuOpen(false);

  const handleErase = () => {
    deleteAnswer(id);
    handleEraseMenuClose();
  };

  const handleAnswerDialogOpen = () => {
    handleMenuClose();
    setAnswerDialogOpen(true);
  };
  const handleAnswerDialogClose = () => setAnswerDialogOpen(false);

  const handleAnswerSubmit = () => {
    answerQuestion(id, userAnswer);
    setAnswerDialogOpen(false);
  };

  const handleCommentDialogOpen = () => {
    handleMenuClose();
    setCommentDialogOpen(true);
  };
  const handleCommentDialogClose = () => setCommentDialogOpen(false);

  const handleCommentSubmit = () => {
    async function addComment() {
      const res = await fetcher(`/questions/${id}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userComment }),
      });

      setUserComment("");

      if (res.ok) {
        profileDispatch({
          type: ProfileActions.UpdateQuestion,
          payload: { id, update: { comments: comments + 1 } },
        });
      }
    }
    addComment();
    setCommentDialogOpen(false);
  };

  const renderCategoryMenuItem = (cat: { id: string; name: string }) => (
    <MenuItem
      key={cat.id}
      onClick={() => handleCategorySelect(cat.id)}
      selected={cat.id === category.id}
    >
      <ListItemIcon>{cat.id === category.id && <CheckIcon />}</ListItemIcon>

      {cat.name}
    </MenuItem>
  );

  return (
    <Card sx={{ width: "100%", mx: { xs: 0, md: 1, lg: 2, xlg: 4 } }}>
      <CardHeader
        avatar={<Avatar alt={name} src={avatar} />}
        title={name}
        subheader={date + " - " + category.name}
        action={
          <>
            <IconButton
              aria-label="more"
              aria-controls="question-card-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="question-card-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleAnswerDialogOpen}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                Edit
              </MenuItem>
              <MenuItem onClick={handleEraseMenuOpen}>
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                Erase
              </MenuItem>
              <MenuItem onClick={handleMoveMenuOpen}>
                <ListItemIcon>
                  <MoveToInboxIcon />
                </ListItemIcon>
                Move
              </MenuItem>
              <MenuItem onClick={handleDeleteMenuOpen}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>
          </>
        }
      />

      <CardContent sx={{ paddingY: 0, paddingX: 4 }}>
        <Typography variant="body1">{question}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
          {answer}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="text"
          size="large"
          endIcon={liked ? <LikedIcon /> : <LikeIcon />}
          onClick={switchLike}
        >
          {likes}
        </Button>
        <Button
          variant="text"
          size="large"
          endIcon={<CommentIcon />}
          onClick={handleCommentDialogOpen}
        >
          {comments}
        </Button>

        <Button
          variant="text"
          size="large"
          onClick={handleCommentDialogOpen}
          style={{ marginLeft: "auto" }}
          component={RouterLink}
          to={`/q/${id}`}
        >
          Open
        </Button>

        <Dialog
          open={moveMenuOpen}
          onClose={handleMoveMenuClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Select Category</DialogTitle>
          <DialogContent>
            {renderCategoryMenuItem({ id: "", name: "general" })}
            {user?.categories?.map((cat) => renderCategoryMenuItem(cat))}
          </DialogContent>
        </Dialog>

        <Dialog open={deleteMenuOpen} onClose={handleDeleteMenuClose}>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this question?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteMenuClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={eraseMenuOpen} onClose={handleEraseMenuClose}>
          <DialogTitle>Delete Answer</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this answer?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEraseMenuClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleErase} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen
          open={answerDialogOpen}
          onClose={handleAnswerDialogClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>Answer Question</DialogTitle>

          <DialogContent>
            <CardHeader
              avatar={<Avatar alt={name} src={avatar} />}
              title={name}
              subheader={`${date} - ${category.name}`}
            />

            <CardContent>
              <Typography variant="subtitle1">{question} </Typography>
            </CardContent>

            <TextField
              label="Answer"
              multiline
              rows={6}
              fullWidth
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleAnswerDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleAnswerSubmit}
              color="primary"
              variant="contained"
              disabled={!Boolean(userAnswer.trim())}
            >
              Answer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen
          open={commentDialogOpen}
          onClose={handleCommentDialogClose}
          TransitionComponent={Transition}
        >
          <DialogTitle>Add Comment</DialogTitle>

          <DialogContent>
            <CardHeader
              avatar={<Avatar alt={name} src={avatar} />}
              title={name}
              subheader={`${date} - ${category.name}`}
            />

            <CardContent>
              <Typography variant="subtitle1">{question} </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                {answer}
              </Typography>
            </CardContent>

            <TextField
              label="Comment"
              multiline
              rows={6}
              fullWidth
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCommentDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleCommentSubmit}
              color="primary"
              variant="contained"
              disabled={!Boolean(userComment.trim())}
            >
              Comment
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default InboxQuestion;
