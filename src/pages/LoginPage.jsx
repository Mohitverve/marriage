// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Link
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Log In
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleLogin} className="form-container">
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
          Log In
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account?{' '}
        <Link component={RouterLink} to="/register">
          Sign up
        </Link>
      </Typography>
    </Container>
  );
}
