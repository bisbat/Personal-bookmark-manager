
import { Route, Routes } from 'react-router';
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginPage from './pages/LoginPage';
import BookmarkPage from './pages/BookmarkPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<AuthCallbackPage />} />
      <Route path="/bookmarks" element={<BookmarkPage />} />
      <Route path="*" element={<div>Hello world</div>} />

    </Routes>
  );
}

export default App;
