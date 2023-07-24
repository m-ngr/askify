import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
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
  Box,
} from "@mui/material";

import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikedIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";

import dateToDuration from "../utils/dateToDuration";
import { api } from "../api";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Question() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [question, setQuestion] = useState<any>({});
  const [comments, setComments] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const commentRef = useRef<any>(null);
  const [userComment, setUserComment] = useState("");
  const [deleteQuestionOpen, setDeleteQuestionOpen] = useState(false);
  const [deleteAnswerOpen, setDeleteAnswerOpen] = useState(false);
  const [deleteCommentOpen, setDeleteCommentOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState(question.answer ?? "");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editComment, setEditComment] = useState("");

  const scrollToComment = () => {
    commentRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openDeleteQuestion = () => setDeleteQuestionOpen(true);

  const closeDeleteQuestion = () => setDeleteQuestionOpen(false);

  const handleDeleteQuestion = async () => {
    closeDeleteQuestion();
    const { response } = await api.deleteQuestion(id ?? "");
    if (response.ok) navigate("/");
  };

  const openMoveMenu = () => setMoveMenuOpen(true);

  const closeMoveMenu = () => setMoveMenuOpen(false);

  const handleCategorySelect = async (category: string) => {
    closeMoveMenu();
    const { response } = await api.changeQuestionCategory(id ?? "", category);

    if (response.ok) {
      const cat = user?.categories.find((cat) => cat.id === category) ?? {
        id: "",
        name: "general",
      };
      setQuestion((q) => ({ ...q, category: cat }));
    }
  };

  const openDeleteAnswer = () => setDeleteAnswerOpen(true);

  const closeDeleteAnswer = () => setDeleteAnswerOpen(false);

  const handleDeleteAnswer = async () => {
    closeDeleteQuestion();
    const { response } = await api.deleteAnswer(id ?? "");
    if (response.ok) navigate("/");
  };

  const openAnswerDialog = () => setAnswerDialogOpen(true);

  const closeAnswerDialog = () => setAnswerDialogOpen(false);

  const handleAnswerSubmit = async () => {
    setAnswerDialogOpen(false);
    const { response } = await api.answerQuestion(id ?? "", userAnswer);
    if (response.ok) {
      setQuestion((q) => ({ ...q, answer: userAnswer }));
    }
  };

  const openDeleteComment = () => setDeleteCommentOpen(true);

  const closeDeleteComment = () => setDeleteCommentOpen(false);

  const handleDeleteComment = async (id) => {
    closeDeleteComment();
    const { response } = await api.deleteComment(id);
    if (response.ok) {
      setComments((cmts) => cmts.filter((cmt) => cmt.id !== id));
    }
  };

  const openCommentDialog = (content) => {
    setEditComment(content);
    setCommentDialogOpen(true);
  };
  const closeCommentDialog = () => setCommentDialogOpen(false);

  const handleCommentEdit = async (id) => {
    setCommentDialogOpen(false);
    const { response } = await api.editComment(id, editComment);

    if (response.ok) {
      setComments((cmts) =>
        cmts.map((cmt) => {
          if (cmt.id === id) {
            cmt.content = editComment;
          }
          return cmt;
        })
      );
    }
  };

  useEffect(() => {
    setError("");
    setComments([]);
    setQuestion({});

    async function fetchQuestion() {
      const { response, data } = await api.getQuestion(id ?? "");
      if (response.ok) {
        setQuestion(data);
        setUserAnswer(data.answer);
      } else {
        setError(data.error);
      }
    }

    async function fetchComments() {
      const { response, data } = await api.getComments(id ?? "");
      if (response.ok) {
        setComments(data);
      }
    }

    fetchQuestion();
    fetchComments();
  }, [id]);

  const fetchLiked = useCallback(async () => {
    const { response, data } = await api.isLiked(id ?? "");
    if (response.ok) {
      setLiked(data.liked);
      setQuestion((q) => ({ ...q, likes: data.likes }));
    }
  }, [id]);

  useEffect(() => {
    fetchLiked();
  }, [fetchLiked]);

  async function switchLike() {
    // if (viewer === "visitor") return;
    const request = liked ? api.unlikeAnswer : api.likeAnswer;
    setLiked((prev) => !prev);
    setQuestion((q) => ({ ...q, likes: question.likes + (liked ? -1 : 1) }));
    await request(id ?? "");
    fetchLiked();
  }

  function getName(user) {
    if (user === undefined) return "Deleted User";
    if (user === null) return "Anonymous User";
    return `${user.firstName} ${user.lastName}`;
  }

  function addComment(e) {
    e.preventDefault();
    // if (viewer === "visitor") return;
    async function postComment() {
      const { response } = await api.addComment(id ?? "", userComment);

      setUserComment("");

      if (response.ok) {
        setQuestion((q) => ({ ...q, comments: question.comments + 1 }));
        const json = await response.json();
        setComments((cmts) => [...cmts, { ...json, user }]);
      }
    }

    postComment();
  }

  const renderCategoryMenuItem = (cat: { id: string; name: string }) => (
    <MenuItem
      key={cat.id}
      onClick={() => handleCategorySelect(cat.id)}
      selected={cat.id === (question.category?.id ?? "")}
    >
      <ListItemIcon>
        {cat.id === (question.category?.id ?? "") && <CheckIcon />}
      </ListItemIcon>

      {cat.name}
    </MenuItem>
  );

  return error ? (
    <div>Error: {error}</div>
  ) : (
    <Card sx={{ width: "100%", mx: { xs: 0, md: 1, lg: 2, xlg: 4 } }}>
      {/* ========================== Question =================================== */}
      <CardHeader
        avatar={
          <Avatar
            alt={getName(question.fromUser)}
            src={question.fromUser?.avatar ?? ""}
          />
        }
        title={getName(question.fromUser)}
        subheader={question.category?.name ?? "general"}
        action={
          user?.id === question.toUser?.id && (
            <>
              <IconButton onClick={openMoveMenu}>
                <MoveToInboxIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={openDeleteQuestion}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )
        }
      />
      <CardContent sx={{ paddingY: 0, paddingX: 4 }}>
        <Typography variant="body1">{question.question}</Typography>
      </CardContent>
      {user?.id === question.toUser?.id && (
        <CardActions>
          <Dialog
            open={moveMenuOpen}
            onClose={closeMoveMenu}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Select Category</DialogTitle>
            <DialogContent>
              {renderCategoryMenuItem({ id: "", name: "general" })}
              {user?.categories?.map((cat) => renderCategoryMenuItem(cat))}
            </DialogContent>
          </Dialog>

          <Dialog open={deleteQuestionOpen} onClose={closeDeleteQuestion}>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this question?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteQuestion} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteQuestion} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
      )}
      {/* ========================== Answer =================================== */}
      <CardHeader
        avatar={
          <Avatar
            alt={getName(question.toUser)}
            src={question.toUser?.avatar ?? ""}
          />
        }
        title={getName(question.toUser)}
        subheader={dateToDuration(question.answeredAt)}
        action={
          user?.id === question.toUser?.id && (
            <>
              <IconButton onClick={openAnswerDialog}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={openDeleteAnswer}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )
        }
      />

      <CardContent sx={{ paddingY: 0, paddingX: 4 }}>
        <Typography variant="body1">{question.answer}</Typography>
      </CardContent>

      {user?.id === question.toUser?.id && (
        <CardActions>
          <Dialog open={deleteAnswerOpen} onClose={closeDeleteAnswer}>
            <DialogTitle>Delete Answer</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this answer?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteAnswer} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteAnswer} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullScreen
            open={answerDialogOpen}
            onClose={closeAnswerDialog}
            TransitionComponent={Transition}
          >
            <DialogTitle>Answer Question</DialogTitle>

            <DialogContent>
              <CardHeader
                avatar={
                  <Avatar
                    alt={getName(question.fromUser)}
                    src={question?.fromUser?.avatar ?? ""}
                  />
                }
                title={getName(question.fromUser)}
                subheader={question?.category?.name ?? "general"}
              />

              <CardContent>
                <Typography variant="subtitle1">{question.question}</Typography>
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
              <Button onClick={closeAnswerDialog} color="primary">
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
        </CardActions>
      )}
      {/* ========================== Like/comment =================================== */}
      {user && (
        <CardActions>
          <Button
            variant="text"
            size="large"
            endIcon={liked ? <LikedIcon /> : <LikeIcon />}
            onClick={switchLike}
          >
            {question.likes}
          </Button>
          <Button
            variant="text"
            size="large"
            endIcon={<CommentIcon />}
            onClick={scrollToComment}
          >
            {question.comments}
          </Button>
        </CardActions>
      )}
      {/* ========================== Comments =================================== */}
      {comments.map((cmt) => (
        <React.Fragment key={cmt.id}>
          <CardHeader
            avatar={
              <Avatar alt={getName(cmt.user)} src={cmt.user?.avatar ?? ""} />
            }
            title={getName(cmt.user)}
            subheader={dateToDuration(cmt.createdAt)}
            action={
              <>
                {user?.id === cmt.user?.id && (
                  <IconButton onClick={() => openCommentDialog(cmt.content)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}

                {(user?.id === cmt.user?.id ||
                  user?.id === question.toUser?.id) && (
                  <IconButton onClick={openDeleteComment}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </>
            }
          />
          <CardContent sx={{ paddingY: 0, paddingX: 4 }}>
            <Typography variant="body1">{cmt.content}</Typography>
          </CardContent>

          <CardActions>
            <Dialog open={deleteCommentOpen} onClose={closeDeleteComment}>
              <DialogTitle>Delete Comment</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this comment?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDeleteComment} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteComment(cmt.id)}
                  color="primary"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              fullScreen
              open={commentDialogOpen}
              onClose={closeCommentDialog}
              TransitionComponent={Transition}
            >
              <DialogTitle>Edit Comment</DialogTitle>

              <DialogContent>
                <TextField
                  label="Comment"
                  multiline
                  rows={6}
                  fullWidth
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  margin="normal"
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={closeCommentDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCommentEdit(cmt.id)}
                  color="primary"
                  variant="contained"
                  disabled={!Boolean(editComment.trim())}
                >
                  Comment
                </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
        </React.Fragment>
      ))}
      {/* ========================== Add Comment =================================== */}
      {user && (
        <Box
          ref={commentRef}
          component="form"
          onSubmit={addComment}
          noValidate
          sx={{
            mt: 2,
            padding: 2,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <TextField
            label="Comment"
            id="comment"
            name="comment"
            variant="outlined"
            fullWidth
            multiline
            required
            onChange={(e) => setUserComment(e.target.value)}
            value={userComment}
            rows={4}
            sx={{ flexGrow: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!Boolean(userComment.trim())}
          >
            Comment
          </Button>
        </Box>
      )}
    </Card>
  );
}
