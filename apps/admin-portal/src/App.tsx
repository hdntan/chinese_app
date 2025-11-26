import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Levels from './pages/Levels';
import Lessons from './pages/Lessons';
import Vocabularies from './pages/Vocabularies';
import DialogueLines from './pages/DialogueLines';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/levels" element={<Levels />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/vocabularies" element={<Vocabularies />} />
                <Route path="/dialogue-lines" element={<DialogueLines />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
