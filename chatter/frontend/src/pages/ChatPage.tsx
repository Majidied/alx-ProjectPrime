import { useState } from 'react';
import {
  Grid,
  useTheme,
  useMediaQuery,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Contact } from '../models/Contact';
import { MessageProvider } from '../contexts/MessageContext';
import ChatsSideBar from '../components/ChatsSideBar/ChatsSideBar';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import useVerification from '../hooks/useVerification';
import SelectChat from '../assets/selectChat.png';
import { useNavigate } from 'react-router-dom';


function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { isVerified, isLoading, isError } = useVerification();

  const handleBackClick = () => {
    setSelectedContact(null);
  };

  if (isLoading) {
    return <CircularProgress style={
      { position: 'absolute', top: '50%', left: '50%' }
    } />;
  }

  if (isError) {
    return <Typography style={
      { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} 
      variant="h6" color="error">Failed to verify user.</Typography>;
  }

  if (!isVerified) {
    navigate('/verify');
  }

  return (
    <Grid
      container
      direction={isMobile ? 'column' : 'row'}
      className="h-screen"
    >
      <MessageProvider>
        {!isMobile || !selectedContact ? (
          <Grid
            item
            xs={12}
            md={4}
            style={{
              width: isMobile ? '100%' : '350px',
              maxWidth: isMobile ? '100%' : '350px',
              overflowY: 'auto',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#f5f5f5',
            }}
          >
            <ChatsSideBar
              onSelectContact={setSelectedContact}
            />
          </Grid>
        ) : null}

        {(isMobile && selectedContact) || !isMobile ? (
          <Grid
            item
            xs={12}
            md={8}
            style={{
              width: isMobile ? '100%' : 'calc(100% - 350px)',
              maxWidth: isMobile ? '100%' : 'calc(100% - 350px)',
              flexGrow: 1,
            }}
          >
            {selectedContact ? (
              <div>
                {isMobile && (
                  <ChatWindow
                    contact={selectedContact}
                    handleBackClick={handleBackClick}
                  />
                )}
                {!isMobile && <ChatWindow contact={selectedContact} />}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="textSecondary" align="center" className='flex flex-col items-center'>
                  <img src={SelectChat} alt="Select Chat" width={200} />
                  Please select a contact to start chatting.
                </Typography>
              </div>
            )}
          </Grid>
        ) : null}
      </MessageProvider>
    </Grid>
  );
}

export default ChatPage;