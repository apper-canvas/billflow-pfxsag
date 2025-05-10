import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceForm from './pages/InvoiceForm';
import RecurringInvoices from './pages/RecurringInvoices';
import getIcon from './utils/iconUtils';

function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || 
        (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    toast.info(
      darkMode ? "Light mode activated" : "Dark mode activated",
      { icon: darkMode ? "☀️" : "🌙" }
    );
  };

  const handleCreateInvoice = () => {
    toast.info("Opening invoice creation form");
    navigate('/invoices/create');
  };
  
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const PlusIcon = getIcon('Plus');
  const FileTextIcon = getIcon('FileText');
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary dark:text-primary-light font-bold text-2xl">
              BillFlow
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </motion.button>
        </div>
      </header>
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/invoices/create" element={<InvoiceForm />} />
            <Route path="/recurring-invoices" element={<RecurringInvoices />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BillFlow. All rights reserved.</p>
        </div>
      </footer>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="!bg-white dark:!bg-surface-800 !text-surface-800 dark:!text-surface-100 !shadow-soft"
      />
      
      {/* Floating Action Button for Create Invoice */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateInvoice}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg font-medium transition-colors"
        aria-label="Create new invoice"
      >
        <PlusIcon size={20} />
        <span>Create Invoice</span>
      />
    </div>
  );
}

export default App;