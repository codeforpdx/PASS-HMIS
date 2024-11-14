// React Imports
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
// Material UI Imports
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

// TODO: Determine future of this modal
// web camera modal
const WebcamModal = ({ open, onClose, onCapture }) => {
  const webcamRef = useRef(null);
  const [facingDirection, setFacingDirection] = useState('environment');

  const handleCameraDirection = () => {
    if (facingDirection === 'environment') {
      setFacingDirection('user');
    } else {
      setFacingDirection('environment');
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="webcam-modal-title"
      aria-describedby="webcam-modal-description"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          height: '100dvh'
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: facingDirection }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="contained" color="primary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleCapture}>
            Take Photo
          </Button>
          <Button variant="contained" color="primary" onClick={handleCameraDirection}>
            <CameraswitchIcon />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WebcamModal;
