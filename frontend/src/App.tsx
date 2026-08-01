
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<div>Hello world</div>} />
    </Routes>
  );
}

export default App;
