import { useEffect, useState } from 'react';
import {
  Grid,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from '@mui/material';
import UserAvatar from './UserAvatar';
import ContactItem from './Contact';
import UserBar from './UserBar';
import AddIcon from '@mui/icons-material/Add';
import SearchUserModal from './SearchUserModal';
import { Contact } from '../../utils/Contact';
import { User, getUserProfile } from '../../utils/User';

function ChatsSideBar({ contacts }: { contacts: Contact[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalOpen, setModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        console.log('UserId:', user._id);
        setUserProfile(user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open
        classes={{
          paper: 'w-100 bg-gray-200',
        }}
      >
        <Grid container direction="column" className="h-full p-2">
          {/* User Avatar at the top */}
          <Grid item>
            <UserAvatar />
          </Grid>
          {/* add line separator */}
          <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            <span className="font-mono text-gray-600 text-lg">Chats</span>
          </Divider>

          {/* search bar and add button */}
          <Grid item>
            <div className="flex justify-between items-center mt-2 ml-4">
              <input
                type="text"
                placeholder="Search"
                className="p-2 w-5/6 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
              />
              <IconButton
                color="primary"
                className="bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-full"
                onClick={handleOpenModal}
              >
                <AddIcon />
              </IconButton>
            </div>
          </Grid>

          {/* add line separator */}
          <Divider sx={{ marginTop: '10px', color: 'text.secondary' }} />
          {/* Contact List in the middle */}
          <Grid item xs className="overflow-y-auto mt-2">
            <Grid container direction="column" spacing={2}>
              {contacts.map((contact) => (
                <Grid item key={contact.id}>
                  <ContactItem
                    contactId={
                      userProfile && userProfile._id === contact.userId
                        ? contact.contactId
                        : contact.userId
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* User Bar at the bottom */}
          <Grid item>
            <UserBar />
          </Grid>
        </Grid>
      </Drawer>

      {/* Search User Modal */}
      <SearchUserModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default ChatsSideBar;
