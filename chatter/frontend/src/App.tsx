import React from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = React.useState("API is not running");

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/');
        setMessages(response.data);
    } catch (error) {
      console.error('There was an error fetching the messages!', error);
    }
  };

  React.useEffect(() => {
    fetchMessages();
  }, []);
  return (
    <>
      <h1>Chatter</h1>
      <p>Chatter is a simple chat application.</p>
      <ul>{messages}</ul>
    </>
  );
};

export default App;
