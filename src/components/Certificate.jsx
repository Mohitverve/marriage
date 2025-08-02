import React from 'react';
import '../styles/certificate.css';
import certImg from '../assets/1.png';
import { Button } from '@mui/material';

export default function Certificate() {
  return (
    <div className="certificate">
      <img
        src={certImg}
        alt="Marriage Certificate"
        className="certificateImage"
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        component="a"
        href={certImg}
        download="certificate.png"
      >
        Download Certificate
      </Button>
    </div>
  );
}