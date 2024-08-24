import { Grid, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import UserAvatar from './UserAvatar';
import ContactItem from './Contact';
import UserBar from './UserBar';
import AddIcon from '@mui/icons-material/Add';
import SearchUserModal from './SearchUserModal';
import { Contact } from '../../utils/Contact';
import { useUserProfile } from '../../hooks/useUserProfile';

interface ChatsSideBarProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

function ChatsSideBar({ contacts, onSelectContact }: ChatsSideBarProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const userProfile = useUserProfile();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <Grid container direction="column" className="h-full p-2">
        {/* User Avatar */}
        <Grid item>
          <UserAvatar />
        </Grid>

        {/* Chats Section Divider */}
        <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          <span className="font-mono text-gray-600 text-lg">Chats</span>
        </Divider>

        {/* Search Bar and Add Button */}
        <Grid item>
          <div className="flex justify-between items-center mt-2 ml-4">
            <input
              type="text"
              placeholder="Search"
              className="p-2 w-5/6 rounded-lg bg-white dark:bg-gray-700 focus:outline-none"
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

        {/* Divider */}
        <Divider sx={{ marginTop: '10px', color: 'text.secondary', marginBottom: '10px' }} />

        {/* Contact List */}
        <Grid item xs className="overflow-y-auto mt-2">
          <Grid container direction="column" spacing={1.5}>
            {contacts.map((contact) => (
              <Grid item key={contact._id}>
                <ContactItem
                  id={contact._id}
                  contactId={
                    userProfile && userProfile._id === contact.userId
                      ? contact.contactId
                      : contact.userId
                  }
                  onClick={() => onSelectContact(contact)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* User Bar */}
        <Grid item>
          <UserBar />
        </Grid>
      </Grid>

      {/* Search User Modal */}
      <SearchUserModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default ChatsSideBar;
