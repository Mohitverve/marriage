import React, { useState, useEffect } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/send.css';
import Navbar from '../components/Navbar';

const pheras = [
  { title: 'The First Phera: A Vow of Duty', text: 'As the couple takes their first steps around the agni, the groom leads...' },
  { title: 'The Second Phera: A Promise of Strength', text: 'In the second round...' },
  { title: 'The Third Phera: A Commitment to Prosperity', text: 'Money matters...' },
  { title: 'The Fourth Phera: A Pledge of Love and Respect', text: 'The romance...' },
  { title: 'The Fifth Phera: A Prayer for Progeny', text: 'Speaking of kids...' },
  { title: 'The Sixth Phera: A Request for Health and Peace', text: 'In the sixth round...' },
  { title: 'The Seventh Phera: A Swear of Friendship and Loyalty', text: 'The final one...' }
];

export default function SendRequestPage({ user }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('');
  const [accepted, setAccepted] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'users'), where('uid', '!=', user.uid));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    })();
  }, [user]);

  const allAccepted = pheras.every((_, i) => accepted[i]);

  const handleSend = async () => {
    if (!selected) return;
    await addDoc(collection(db, 'requests'), {
      senderId: user.uid,
      receiverId: selected,
      status: 'pending',
      createdAt: Date.now()
    });
    setSelected(''); setAccepted({}); setActiveStep(0);
    alert('Proposal sent!');
  };

  return (
    <div> 
      
    <Container className="container">
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Select Partner</StepLabel>
          <div className="step-content">
            <FormControl fullWidth>
              <InputLabel>Choose User</InputLabel>
              <Select
                value={selected}
                label="Choose User"
                onChange={e => setSelected(e.target.value)}
              >
                {users.map(u => (
                  <MenuItem key={u.uid} value={u.uid}>
                    {u.displayName || u.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="actions">
              <Button disabled={!selected} variant="contained" onClick={() => setActiveStep(1)}>
                Next
              </Button>
            </div>
          </div>
        </Step>

        <Step>
          <StepLabel>Accept the 7 Pheras</StepLabel>
          <div className="step-content">
            {pheras.map((p, i) => (
              <div key={i} className="phera-item">
                <Typography variant="subtitle1">{p.title}</Typography>
                <Typography variant="body2" paragraph>{p.text}</Typography>
                <FormControlLabel
                  control={<Checkbox checked={!!accepted[i]} onChange={() => setAccepted(prev => ({ ...prev, [i]: !prev[i] }))} />}
                  label="I accept"
                />
              </div>
            ))}
            <div className="actions">
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button disabled={!allAccepted} variant="contained" onClick={handleSend}>
                Send Proposal
              </Button>
            </div>
          </div>
        </Step>
      </Stepper>
    </Container>
    </div>
  );
}