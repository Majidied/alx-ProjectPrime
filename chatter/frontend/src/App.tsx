import AuthProvider from './provider/AuthProvider';
import Routes from './routes';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        <AuthProvider>
          <Routes />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </AnimatePresence>
    </QueryClientProvider>
  );
}

export default App;
