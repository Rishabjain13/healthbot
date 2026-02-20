import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import Chat from './pages/Chat';
import Files from './pages/Files';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileLoader from './components/ProfileLoader';

function App() {
  return (
    
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            
              
                <Layout />
              </ProfileLoader>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="chat" element={<Chat />} />
          <Route path="files" element={<Files />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
