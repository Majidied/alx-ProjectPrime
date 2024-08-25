import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, TextField } from '@mui/material';
import {
  Send,
  PhotoCamera,
  Audiotrack,
  InsertDriveFile,
  AttachFile,
  EmojiEmotions,
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';

interface CustomEmoji {
  emoji: string;
}

interface InputAreaProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  addEmoji: (emoji: CustomEmoji) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  message,
  setMessage,
  sendMessage,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prevVisible) => !prevVisible);
  };

  const handleEmojiClick = (emojiObject: CustomEmoji) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="flex items-center relative">
      {/* Attachment Dropdown Menu */}
      <IconButton color="primary" onClick={handleMenuOpen} aria-label="Attach files">
        <AttachFile />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <PhotoCamera />
          &nbsp;Photo/Video
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Audiotrack />
          &nbsp;Audio
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <InsertDriveFile />
          &nbsp;Document
        </MenuItem>
      </Menu>

      {/* Emoji Picker */}
      {emojiPickerVisible && (
        <div className="absolute bottom-12 left-0 z-10">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      <IconButton color="primary" onClick={toggleEmojiPicker} aria-label="Pick emojis">
        <EmojiEmotions />
      </IconButton>

      {/* Message Input */}
      <TextField
        variant="outlined"
        placeholder="Type a message"
        fullWidth
        size="small"
        style={{ marginLeft: '1rem', marginRight: '1rem' }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
            e.preventDefault(); // Prevent newline on Enter
          }
        }}
        aria-label="Type a message"
      />
      <IconButton color="primary" onClick={sendMessage} aria-label="Send message">
        <Send />
      </IconButton>
    </div>
  );
};

export default InputArea;
