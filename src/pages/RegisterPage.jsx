// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Link
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Save user profile
      await setDoc(doc(db, 'users', userCred.user.uid), {
        displayName,
        email,
        uid: userCred.user.uid
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleRegister} className="form-container">
        <TextField
          label="Your Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Container>
  );
}
