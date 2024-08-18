interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const backgroundColor =
    type === 'success'
      ? 'bg-green-400 border-green-500'
      : 'bg-red-400 border-red-500';
  const icon = type === 'success' ? '✔️' : '❌';

  return (
    <div
      className={`fixed top-5 right-5 z-50 border-2 ${backgroundColor} text-white p-4 flex items-center`}
    >
      <span className="text-xl mr-2">{icon}</span>
      <span>{message}</span>
      <button
        className="ml-4 bg-inherit text-black rounded-full px-2"
        onClick={onClose}
      >
        ✖️
      </button>
    </div>
  );
};

export default Notification;
