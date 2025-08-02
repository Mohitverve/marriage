import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Certificate from '../components/Certificate';
import '../styles/home.css';

export default function HomePage({ user }) {
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'marriages', user.uid);
    const unsubscribe = onSnapshot(
      ref,
      snap => setCertificate(snap.exists() ? snap.data() : null),
      err => console.error('HomePage snapshot error:', err)
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'marriages', user.uid))
      .then(snap => { if (snap.exists()) setCertificate(snap.data()); })
      .catch(err => console.error('HomePage getDoc error:', err));
  }, [user]);

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      {certificate ? (
        <Certificate />
      ) : (
        <Typography variant="h5" className="fun-line">
          You’re not married yet! Send or accept a proposal to get certified 💌
        </Typography>
      )}
    </Container>
  );
}
