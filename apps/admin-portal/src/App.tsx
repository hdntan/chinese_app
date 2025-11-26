import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Levels from './pages/Levels';
import Lessons from './pages/Lessons';
import Vocabularies from './pages/Vocabularies';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/vocabularies" element={<Vocabularies />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
