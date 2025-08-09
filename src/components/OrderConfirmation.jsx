// src/components/OrderConfirmation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Link,
  TextField,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import QRCode from 'react-qr-code';
import { CheckCircle } from '@mui/icons-material';

const OrderConfirmation = ({ cartItems,setCart, open, onClose, upiId, totalAmount }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    address: ''
  });
  const qrContainerRef = useRef(null);

  // Check for saved user details on component mount
  useEffect(() => {
    const savedDetails = localStorage.getItem('userDetails');
    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
      setActiveStep(1); // Skip to QR page if details exist
    }
  }, []);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus('success');
    }, 2000);
    
  };

  const downloadQRCode = () => {
    const svgElement = qrContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const padding = 20;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Payment_QR_₹${totalAmount}.png`;
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const handleNext = () => {
    // Save to localStorage before proceeding
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    setActiveStep(1);
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDone = () => {
    // Save order to history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    const newOrder = {
      id: Date.now(), // Unique ID using timestamp
      date: new Date().toISOString(),
      items: cartItems,
      totalAmount,
      userDetails,
      status: 'completed'
    };

    localStorage.setItem(
      'orderHistory', 
      JSON.stringify([newOrder, ...orderHistory]) // Newest orders first
    );

    handlePayment(); // Close the dialog
  };

  const upiUrl = `upi://pay?pa=${upiId}&pn=Restaurant&am=${totalAmount}&cu=INR`;

  const steps = ['Enter Details', 'Make Payment'];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>Enter Your Details</Typography>
            
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              required
            />
            
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={userDetails.mobile}
              onChange={handleChange}
              type="tel"
              required
            />
            
            <TextField
              fullWidth
              label="Delivery Address"
              name="address"
              value={userDetails.address}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!userDetails.name || !userDetails.mobile || !userDetails.address}
              sx={{ mt: 2 }}
            >
              Continue to Payment
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {paymentStatus === 'success' ? (
              <>
                <CheckCircle sx={{ fontSize: 80, color: 'green', mb: 2 }} />
                <Typography variant="h5" gutterBottom>Order Placed Successfully!</Typography>
                <Typography>Your order has been confirmed.</Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>Scan QR to Pay</Typography>
                <Box 
                  ref={qrContainerRef}
                  sx={{ 
                    p: 3,
                    bgcolor: 'white', 
                    borderRadius: 2, 
                    mb: 2,
                    border: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <QRCode 
                    value={upiUrl} 
                    size={200} 
                    level="H"
                  />
                </Box>
                
                <Link 
                  component="button"
                  variant="body2"
                  onClick={downloadQRCode}
                  sx={{ 
                    mb: 3,
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.dark',
                      cursor: 'pointer'
                    }
                  }}
                >
                  Download QR Code
                </Link>
                
                <Typography variant="body1" gutterBottom>
                  UPI ID: {upiId}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Amount: ₹{totalAmount}
                </Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', pb: 3, px: 3 }}>
        {activeStep === 1 && paymentStatus !== 'success' && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back to Details
          </Button>
        )}
        
        {activeStep === 1 && paymentStatus !== 'success' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleDone}
            disabled={isProcessing}
            sx={{ px: 4 }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Processing...
              </>
            ) : (
              'I Have Paid'
            )}
          </Button>
        )}
        
        {paymentStatus === 'success' && (
          <Button 
            variant="contained" 
            color="success"
            onClick={onClose}
            sx={{ px: 4 }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderConfirmation;