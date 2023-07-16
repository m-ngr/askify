import React, { useContext, useState } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import { UserContext } from "../contexts/UserContext";
import { InboxContext } from "../contexts/InboxContext";
import { TransitionProps } from "@mui/material/transitions";

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
}

const InboxQuestion: React.FC<QuestionCardProps> = ({
  id,
  avatar,
  name,
  date,
  category,
  question,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useContext(UserContext);
  const { deleteQuestion, changeQuestionCategory, answerQuestion } =
    useContext(InboxContext);

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

  const handleAnswerDialogOpen = () => setAnswerDialogOpen(true);
  const handleAnswerDialogClose = () => setAnswerDialogOpen(false);

  const handleAnswerSubmit = () => {
    answerQuestion(id, userAnswer);
    setAnswerDialogOpen(false);
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
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton aria-label="Answer" onClick={handleAnswerDialogOpen}>
          <SendIcon color="primary" />
        </IconButton>
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
      </CardActions>
    </Card>
  );
};

export default InboxQuestion;
