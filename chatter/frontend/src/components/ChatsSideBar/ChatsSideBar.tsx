import { Grid, IconButton, Divider } from '@mui/material';
import { useMemo, useState } from 'react';
import UserAvatar from './UserAvatar';
import ContactItem from './Contact';
import UserBar from './UserBar';
import AddIcon from '@mui/icons-material/Add';
import SearchUserModal from './SearchUserModal';
import { Contact } from '../../models/Contact';
import { useUserProfile } from '../../hooks/useUser';
import { useContacts } from '../../hooks/useContacts';
import LoadingAnimation from '../Spinner/LoadingAnimation';
import { useMessageContext } from '../../contexts/MessageContext';



interface ChatsSideBarProps {
  onSelectContact: (contact: Contact) => void;
}

function ChatsSideBar({ onSelectContact }: ChatsSideBarProps) {
  const { data: contactsData , isLoading } = useContacts();
  const contacts: Contact[] = contactsData?.contacts || [];
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userProfile } = useUserProfile();
  const { lastMessages } = useMessageContext();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  // Get last message timestamps for sorting
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const lastMessageA: number = Number(lastMessages[a._id]?.timestamp) || 0;
      const lastMessageB: number = Number(lastMessages[b._id]?.timestamp) || 0;
      // Compare timestamps for sorting
      return lastMessageB - lastMessageA;
    });
  }, [contacts, lastMessages]); // Re-sort when contacts change


  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="p-1 h-full bg-gray-100">
      <Grid
        container
        direction="column"
        className="h-full p-2 rounded-md"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #96C9F4 0%, #E2BFD9 100%)',
        }}
      >
        {/* User Avatar */}
        <Grid item>
          <UserAvatar />
        </Grid>

        {/* Chats Section Divider */}
        <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          <span className="font-mono text-black text-lg">Chats</span>
        </Divider>

        {/* Search Bar and Add Button */}
        <Grid item>
          <div className="flex justify-between items-center mt-2 ml-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-5/6 rounded-lg bg-white dark:bg-gray-700 focus:outline-none"
            />
            <IconButton
              color="primary"
              className="hover:bg-blue-800 text-white rounded-full"
              onClick={handleOpenModal}
              sx={{ backgroundColor: 'white', marginRight: '1rem', marginLeft: '1rem' }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            marginTop: '10px',
            color: 'text.secondary',
            marginBottom: '10px',
          }}
        />

        {/* Contact List */}
        <Grid item xs className="overflow-y-auto mt-2">
          <Grid container direction="column" spacing={1.5}>
            {sortedContacts.map((contact) => {
              return (
                <Grid item key={contact._id}>
                  <ContactItem
                  id={contact._id}
                  contactId={contact.contactId === userProfile?._id ? contact.userId : contact.contactId}
                  onClick={() => onSelectContact(contact)}
                  searchQuery={searchQuery} // Pass search query to filter within ContactItem
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* User Bar */}
        <Grid item>
          <UserBar />
        </Grid>
      </Grid>

      {/* Search User Modal */}
      <SearchUserModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default ChatsSideBar;
