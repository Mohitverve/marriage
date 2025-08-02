import React from 'react';
import '../styles/certificate.css';  // global CSS

export default function Certificate({ imageSrc }) {
  return (
    <div className="certificate">
      <img
        src={imageSrc}
        alt="Marriage Certificate"
        className="certificateImage"
      />
    </div>
  );
}