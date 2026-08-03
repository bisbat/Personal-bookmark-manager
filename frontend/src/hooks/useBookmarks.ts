import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Bookmark } from '../types/bookmark';

type BookmarkFormData = {
  title: string;
  url: string;
  notes: string;
};

export const useBookmarks = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsFetching(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:3001/bookmark', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookmarks(data);
    } catch (err: unknown) {
      console.error('Failed to fetch bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsFetching(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const addBookmark = async (formData: BookmarkFormData) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch('http://localhost:3001/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('บันทึกข้อมูลไม่สำเร็จ');
      }

      const newBookmark = await response.json();
      setBookmarks((prev) => [...prev, newBookmark]);

      return true;
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึก Bookmark');
      return false;
    }
  };

  const updateBookmark = async (id: string, formData: BookmarkFormData) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:3001/bookmark/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('อัปเดตข้อมูลไม่สำเร็จ');
      }

      const updatedBookmark = await response.json();
      setBookmarks((prev) =>
        prev.map((bookmark) => (bookmark.id === id ? updatedBookmark : bookmark)),
      );

      return true;
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการอัปเดต Bookmark');
      return false;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:3001/bookmark/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('ลบข้อมูลไม่สำเร็จ');
      }

      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการลบ Bookmark');
      return false;
    }
  };

  return {
    bookmarks,
    isFetching,
    error,
    fetchBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  };
};