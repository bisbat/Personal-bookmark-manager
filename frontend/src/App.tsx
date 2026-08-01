
import { Route, Routes } from 'react-router';
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<AuthCallbackPage />} />
      <Route path="*" element={<div>Hello world</div>} />
    </Routes>
  );
}

export default App;
