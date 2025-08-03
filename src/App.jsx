import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SendRequestPage from './pages/SendRequestPage';
import ReceiveRequestsPage from './pages/ReceiveRequestsPage';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u));
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      // Store user in Firestore (merge if existing)
      await setDoc(
        doc(db, 'users', u.uid),
        {
          uid: u.uid,
          displayName: u.displayName || '',
          email: u.email || '',
          createdAt: new Date(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  // If not authenticated, show login button
  if (!user) {
    return (
      <div className="auth-container">
        <button onClick={login}>Sign in with Google</button>
      </div>
    );
  }

  // Once authenticated, render the app routes
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
