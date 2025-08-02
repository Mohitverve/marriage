// ================================
import React, { useState, useEffect } from 'react';
import {
  Container, Card, CardContent, Typography,
  Button, Checkbox, FormControlLabel
} from '@mui/material';
import {
  collection, query, where, getDocs,
  updateDoc, doc, setDoc, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/re.css';
import Navbar from '../components/Navbar';

const pherasList = [
  'The First Phera: A Vow of Duty',
  'The Second Phera: A Promise of Strength',
  'The Third Phera: A Commitment to Prosperity',
  'The Fourth Phera: A Pledge of Love and Respect',
  'The Fifth Phera: A Prayer for Progeny',
  'The Sixth Phera: A Request for Health and Peace',
  'The Seventh Phera: A Swear of Friendship and Loyalty'
];

export default function ReceiveRequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  const [active, setActive] = useState({});
  const [accepted, setAccepted] = useState({});

  useEffect(() => {
    (async () => {
      const reqQuery = query(
        collection(db, 'requests'),
        where('receiverId', '==', user.uid),
        where('status', '==', 'pending')
      );
      const snap = await getDocs(reqQuery);
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, [user]);

  const startAcceptance = id => setActive(prev => ({ ...prev, [id]: true }));
  const allAccepted = id => pherasList.every((_, idx) => accepted[`${id}-${idx}`]);

  const handleConfirm = async (r) => {
    // 1) Mark request accepted
    await updateDoc(doc(db, 'requests', r.id), { status: 'accepted' });

    // 2) Fetch profiles
    const [senderSnap, receiverSnap] = await Promise.all([
      getDoc(doc(db, 'users', r.senderId)),
      getDoc(doc(db, 'users', user.uid))
    ]);
    const senderData   = senderSnap.data() || {};
    const receiverData = receiverSnap.data() || {};
    const date = new Date().toLocaleDateString();

    // 3) Participants array for security
    const participants = [r.senderId, user.uid];

    // 4) Write certificate docs for both users
    await setDoc(doc(db, 'marriages', user.uid), {
      partnerName: receiverData.displayName || receiverData.email,
      spouseName:  senderData.displayName   || senderData.email,
      date,
      requestId:   r.id,
      participants
    });
    await setDoc(doc(db, 'marriages', r.senderId), {
      partnerName: senderData.displayName   || senderData.email,
      spouseName:  receiverData.displayName || receiverData.email,
      date,
      requestId:   r.id,
      participants
    });

    // 5) Clean up
    setRequests(prev => prev.filter(x => x.id !== r.id));
    alert('Marriage confirmed!');
  };

  return (
<div>
   
    <Container className="container">
      {requests.length === 0 ? (
        <Typography>No new proposals 💌</Typography>
      ) : (
        requests.map(r => (
          <div key={r.id} className="request-block">
            {!active[r.id] ? (
              <Card className="card">
                <CardContent>
                  <Typography variant="body1">{r.message}</Typography>
                  <Button variant="contained" onClick={() => startAcceptance(r.id)}>
                    Accept Marriage
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="card">
                <CardContent>
                  <Typography variant="h6">Accept the 7 Pheras:</Typography>
                  {pherasList.map((text, idx) => (
                    <FormControlLabel
                      key={idx}
                      control={<Checkbox checked={!!accepted[`${r.id}-${idx}`]} onChange={() => setAccepted(prev => ({
                        ...prev,
                        [`${r.id}-${idx}`]: !prev[`${r.id}-${idx}`]
                      }))} />}
                      label={text}
                    />
                  ))}
                  <Button disabled={!allAccepted(r.id)} variant="contained" onClick={() => handleConfirm(r)}>
                    Confirm Marriage
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ))
      )}
    </Container>
     </div>
  );
}
