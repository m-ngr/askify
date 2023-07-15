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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { UserContext } from "../contexts/UserContext";

interface QuestionCardProps {
  id: string;
  avatar: string;
  name: string;
  date: string;
  category: { id: string; name: string };
  question: string;
  setQuestions: any;
}

const InboxQuestion: React.FC<QuestionCardProps> = ({
  id,
  avatar,
  name,
  date,
  category,
  question,
  setQuestions,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [cat, setCat] = useState(category.id);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { user } = useContext(UserContext);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoveClick = () => {
    setMoveMenuOpen(true);
    handleMenuClose();
  };

  const handleMoveMenuClose = () => {
    setMoveMenuOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setQuestions((arr: any[]) =>
      arr.map((q) => {
        if (q.id === id) q.category = category;
        return q;
      })
    );
    setCat(category);
    handleMoveMenuClose();
  };

  const handleConfirmationOpen = () => {
    setConfirmationOpen(true);
    handleMenuClose();
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const handleDelete = () => {
    setQuestions((arr: any[]) => arr.filter((q) => q.id !== id));
    handleConfirmationClose();
  };

  const renderCategoryMenuItem = (category) => (
    <MenuItem
      key={category.id}
      onClick={() => handleCategorySelect(category.id)}
      selected={category.id === cat}
    >
      <ListItemIcon>{category.id === cat && <CheckIcon />}</ListItemIcon>

      {category.name}
    </MenuItem>
  );

  return (
    <Card sx={{ width: "100%" }}>
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
              <MenuItem onClick={handleMoveClick}>
                <ListItemIcon>
                  <MoveToInboxIcon />
                </ListItemIcon>
                Move
              </MenuItem>
              <MenuItem onClick={handleConfirmationOpen}>
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

      <CardActions>
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
        <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this question?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmationClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default InboxQuestion;
