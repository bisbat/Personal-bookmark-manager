import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useBookmarks } from '../hooks/useBookmarks';
import type { Bookmark } from '../types/bookmark';
import LogoutButton from '../components/LogoutButton';

type BookmarkFormData = {
  title: string;
  url: string;
  notes: string;
};

interface BookmarkFormDialogProps {
  open: boolean;
  editingBookmark: Bookmark | null;
  formData: BookmarkFormData;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (field: keyof BookmarkFormData, value: string) => void;
  onSubmit: () => void;
}

function BookmarkFormDialog({
  open,
  editingBookmark,
  formData,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: BookmarkFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label="URL"
          type="url"
          fullWidth
          required
          value={formData.url}
          onChange={(event) => onChange('url', event.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={(event) => onChange('title', event.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Notes"
          fullWidth
          multiline
          rows={3}
          value={formData.notes}
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={!formData.url.trim() || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function BookmarkPage() {
  const { bookmarks, isFetching, error, fetchBookmarks, addBookmark, updateBookmark, deleteBookmark } = useBookmarks();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookmarkFormData>({ title: '', url: '', notes: '' });

  const handleOpenDialog = (bookmark?: Bookmark) => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || '',
        url: bookmark.url,
        notes: bookmark.notes || '',
      });
      setEditingBookmark(bookmark);
    } else {
      setFormData({ title: '', url: '', notes: '' });
      setEditingBookmark(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBookmark(null);
    setIsSubmitting(false);
  };

  const handleFieldChange = (field: keyof BookmarkFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.url.trim()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        url: formData.url.trim(),
        title: formData.title.trim(),
        notes: formData.notes.trim(),
      };

      const ok = editingBookmark
        ? await updateBookmark(editingBookmark.id, payload)
        : await addBookmark(payload);

      if (ok) {
        handleCloseDialog();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบ Bookmark นี้?')) {
      return;
    }

    await deleteBookmark(id);
  };

  useEffect(() => {
    void fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Bookmarks
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Bookmark
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined">
          <List>
            {bookmarks.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="ยังไม่มี Bookmark"
                  secondary="เพิ่มรายการแรกของคุณได้เลย"
                />
              </ListItem>
            ) : (
              bookmarks.map((bookmark, index) => (
                <ListItem
                  key={bookmark.id}
                  divider={index !== bookmarks.length - 1}
                  secondaryAction={
                    <Box>
                      <IconButton color="primary" onClick={() => handleOpenDialog(bookmark)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(bookmark.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Link
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                        sx={{ display: 'inline-block', wordBreak: 'break-word' }}
                      >
                        {bookmark.title || bookmark.url}
                      </Link>
                    }
                    secondary={bookmark.notes ? bookmark.notes : 'No notes'}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}

      <BookmarkFormDialog
        open={openDialog}
        editingBookmark={editingBookmark}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseDialog}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
      />

      <LogoutButton
        variant="outlined"
        color="secondary"
        size="large"
        sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
      />
    </Container>
  );
}