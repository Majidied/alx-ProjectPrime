import AuthProvider from './provider/authProvider';
import Routes from './routes';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AnimatePresence>
    <AuthProvider>
      <Routes />
    </AuthProvider>
    </AnimatePresence>
  );
}

export default App;
