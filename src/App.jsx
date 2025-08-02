import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SendRequestPage from './pages/SendRequestPage';
import ReceiveRequestsPage from './pages/ReceiveRequestsPage';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  if (!user) {
    return (
      <div className="auth-container">
        <button onClick={login}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar onLogout={logout} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/send" element={<SendRequestPage user={user} />} />
        <Route path="/receive" element={<ReceiveRequestsPage user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}