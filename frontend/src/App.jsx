import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/auth/Login/LoginPage';
import SignupPage from './pages/auth/Signup/SignUpPage';
import NotificationPage from './pages/notifications/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import SearchPage from './pages/search/SearchPage';
import SavedPosts from "./pages/Save/SavedPosts"; 

import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center bg-base-100 text-base-content'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto bg-base-100 text-base-content min-h-screen">
        {authUser && <Sidebar />}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
          <Route path="profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
          <Route path="/saved" element={authUser ? <SavedPosts /> : <Navigate to="/login" />} />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster />
      </div>
    </>
  );
}

export default App;
