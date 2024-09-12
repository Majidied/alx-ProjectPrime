import { useEffect, useState } from 'react';
import {
  Grid,
  useTheme,
  useMediaQuery,
  Typography,
  CircularProgress,
} from '@mui/material';
import { getContacts } from '../utils/Contact';
import { Contact } from '../utils/Contact';
import { MessageProvider } from '../contexts/MessageContext';
import ChatsSideBar from '../components/ChatsSideBar/ChatsSideBar';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import useVerification from '../hooks/useVerification';
import { ProfileProvider } from '../contexts/UseProfileContext';
import SelectChat from '../assets/selectChat.png';

function ChatPage() {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useVerification();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setContacts(contacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleBackClick = () => {
    setSelectedContact(null);
  };

  return (
    <Grid
      container
      direction={isMobile ? 'column' : 'row'}
      className="h-screen"
    >
      <ProfileProvider>
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
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <ChatsSideBar
                contacts={contacts}
                onSelectContact={setSelectedContact}
              />
            )}
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
      </ProfileProvider>
    </Grid>
  );
}

export default ChatPage;