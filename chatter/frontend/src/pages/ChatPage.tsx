import { useEffect, useState } from 'react';
import { getContacts } from '../utils/Contact';
import { Contact } from '../utils/Contact';
import ChatsSideBar from '../components/ChatsSideBar/ChatsSideBar';

function ChatPage() {
  const [contacts, setContacts] = useState([] as Contact[]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setContacts(contacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };


    fetchContacts();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <ChatsSideBar contacts={contacts} />
    </div>
  );
}

export default ChatPage;
