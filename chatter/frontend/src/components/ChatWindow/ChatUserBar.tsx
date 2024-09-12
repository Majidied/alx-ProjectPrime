import { Avatar, IconButton } from '@mui/material';
import { Call, VideoCall, MoreVert, ArrowBack } from '@mui/icons-material';
import { useContact } from '../../hooks/useContact';

interface UserBarProps {
  avatarUrl?: string;
  recipientId: string;
  handleBackClick?: () => void;
}

const UserBar: React.FC<UserBarProps> = ({ avatarUrl, recipientId, handleBackClick }) => {
  const contact = useContact(recipientId);
  

  return (
    <div className="flex items-center justify-between h-16 bg-white p-2 border rounded-lg"
    style={{ backgroundImage: 'linear-gradient(135deg, #96C9F4 0%, #E2BFD9 100%)' }}>
      {handleBackClick && (
        <IconButton onClick={handleBackClick}>
          <ArrowBack />
        </IconButton>
      )}
      <div className="flex items-center space-x-4">
        <Avatar src={avatarUrl ?? '/path/to/default-avatar.png'} />
        <h1 className="text-xl font-semibold">{contact?.name || 'Unknown'}</h1>
      </div>
      <div className="flex space-x-2">
        <IconButton color="primary">
          <Call />
        </IconButton>
        <IconButton color="primary">
          <VideoCall />
        </IconButton>
        <IconButton color="primary">
          <MoreVert />
        </IconButton>
      </div>
    </div>
  );
};

export default UserBar;
