import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grow,
  Slide,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { CloudUpload as CloudUploadIcon, MonetizationOn as MonetizationOnIcon } from '@mui/icons-material';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #00ff00; }
  50% { box-shadow: 0 0 20px #00ff00; }
  100% { box-shadow: 0 0 5px #00ff00; }
`;

const AnimatedBanner = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  animation: `${glowAnimation} 2s infinite`,
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  cursor: 'pointer',
}));

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDonateDialog, setOpenDonateDialog] = useState(false);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://test-2oux.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult({
        subject: response.data.emailSubject,
        body: response.data.emailBody
      });
    } catch (err) {
      setError('Error uploading file or processing request.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDonateDialog = () => {
    setOpenDonateDialog(true);
  };

  const handleCloseDonateDialog = () => {
    setOpenDonateDialog(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0xf7981432b640C5da6Fa8AeA0F8e800D102Ba32B5');
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          RESO - Resume -ANALYSE + FEEDBACK Tool
         </Typography>
        <form onSubmit={handleSubmit}>
          <Fade in={true} timeout={1000}>
            <Box mb={2}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Resume
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={handleResumeChange}
                />
              </Button>
              {resume && <Typography variant="body2">{resume.name}</Typography>}
            </Box>
          </Fade>
          <Grow in={true} timeout={1000}>
            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              label="Job Description"
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              margin="normal"
            />
          </Grow>
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>
        {error && (
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          </Slide>
        )}
        {result && (
          <Grow in={true} timeout={1000}>
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Email Subject:
                </Typography>
                <Typography variant="body1" paragraph>
                  {result.subject}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Email Body:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                  value={result.body}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(result.body)}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          </Grow>
        )}
      </Box>
      <AnimatedBanner onClick={handleOpenDonateDialog}>
        <Typography variant="body2">
          Click here to donate CELO CRYPTO
        </Typography>
      </AnimatedBanner>
      <Dialog open={openDonateDialog} onClose={handleCloseDonateDialog}>
        <DialogTitle>Donate CELO CRYPTO</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Your support helps us maintain and improve this service. Please send your CELO donations to:
          </Typography>
          <TextField
            fullWidth
            value="0xf7981432b640C5da6Fa8AeA0F8e800D102Ba32B5"
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyAddress} startIcon={<MonetizationOnIcon />}>
            Copy Address
          </Button>
          <Button onClick={handleCloseDonateDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;