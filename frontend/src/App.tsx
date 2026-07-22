import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ToastContainer } from './components/ToastContainer.js';
import { AppRoutes } from './routes/AppRoutes.js';
import { CurrencyProvider } from './context/CurrencyContext.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </CurrencyProvider>
    </QueryClientProvider>
  );
};

export default App;
