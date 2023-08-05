import { Fragment, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { UserActions, UserContext } from "../../contexts/UserContext";
import { api } from "../../utils/api";

const CategoriesList = () => {
  const { user, userDispatch } = useContext(UserContext);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleOpenAddDialog = () => {
    setIsAdding(true);
    setNewCategoryName("");
  };

  const handleOpenEditDialog = (category) => {
    setIsEditing(true);
    setEditCategoryId(category.id);
    setNewCategoryName(category.name);
  };

  const handleCloseDialog = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditCategoryId(null);
    setNewCategoryName("");
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;

    const { response, data } = await api.addCategory(newCategoryName);

    if (response.ok) {
      const categories = user?.categories.concat(data);
      userDispatch({ type: UserActions.Update, payload: { categories } });
    }

    handleCloseDialog();
  };

  const handleEditCategory = async () => {
    if (newCategoryName.trim() === "" || editCategoryId === null) return;
    const { response } = await api.renameCategory(
      editCategoryId,
      newCategoryName
    );

    if (response.ok) {
      const categories = user?.categories.map((cat) => {
        if (cat.id === editCategoryId) {
          cat.name = newCategoryName.trim();
        }
        return cat;
      });
      userDispatch({ type: UserActions.Update, payload: { categories } });
    }

    handleCloseDialog();
  };

  const handleDeleteCategory = async () => {
    if (deleteCategoryId === null) return;
    const { response } = await api.deleteCategory(deleteCategoryId);
    if (response.ok) {
      const categories = user?.categories.filter(
        (cat) => cat.id !== deleteCategoryId
      );
      userDispatch({ type: UserActions.Update, payload: { categories } });
    }
    setDeleteCategoryId(null);
  };

  return (
    <>
      <List>
        {user?.categories?.map((category) => (
          <Fragment key={category.id}>
            <ListItem>
              <ListItemText primary={category.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenEditDialog(category)}
                  sx={{ mr: 0.5 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setDeleteCategoryId(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        sx={{ width: "100%", mt: 1 }}
      >
        Add Category
      </Button>

      {/* Dialog for Adding/Edit Category */}
      <Dialog open={isAdding || isEditing} onClose={handleCloseDialog}>
        <DialogTitle>
          {isAdding ? "Add New Category" : "Rename Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            sx={{ minWidth: "250px" }}
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            autoComplete={undefined}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={isAdding ? handleAddCategory : handleEditCategory}
            color="primary"
          >
            {isAdding ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog
        open={deleteCategoryId !== null}
        onClose={() => setDeleteCategoryId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCategoryId(null)}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesList;
