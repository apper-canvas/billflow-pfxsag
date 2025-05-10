import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const DashboardIcon = getIcon('LayoutDashboard');
  const ClientsIcon = getIcon('Users');
  const InvoicesIcon = getIcon('FileText');
  const SettingsIcon = getIcon('Settings');
  const ClockIcon = getIcon('Clock');
  const PlusIcon = getIcon('Plus');
  const navigate = useNavigate();
  const BellIcon = getIcon('Bell');
  
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
    { id: 'clients', name: 'Clients', icon: ClientsIcon },
    { id: 'invoices', name: 'Invoices', icon: InvoicesIcon },
    { id: 'recurring', name: 'Recurring', icon: ClockIcon },
    { id: 'reminders', name: 'Reminders', icon: BellIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];
  
  // Sample data for dashboard
  const stats = [
    { name: 'Outstanding Invoices', value: '$12,480.00', change: '+8.2%', trend: 'up' },
    { name: 'Clients', value: '24', change: '+2', trend: 'up' },
    { name: 'Invoices Due This Week', value: '5', change: '+2', trend: 'up' },
    { name: 'Revenue (MTD)', value: '$28,950.00', change: '+14.5%', trend: 'up' },
    { name: 'Avg. Payment Time', value: '12 days', change: '-3 days', trend: 'down' },
  ];
  
  const handleCreateInvoice = () => {
    toast.info("Opening invoice creation form");
    navigate('/invoices/create');
  };
  
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 p-4 sticky top-24">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
              <Link
                to="/invoices/create"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
              >
                <PlusIcon size={18} />
                <span>New Invoice</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Business Dashboard</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="card p-6 border-l-4 border-l-primary"
                  >
                    <p className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">{stat.name}</p>
                    <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                    <div className={`text-sm font-medium flex items-center ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Main Feature Component */}
              <MainFeature />
            </motion.div>
          )}
          
          {activeTab === 'clients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Client Management</h1>
              <div className="card p-8 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ClientsIcon size={36} />
                </div>
                <h2 className="text-xl font-semibold mb-2">Client Management</h2>
                <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md">
                  Manage your clients, view their information, track their billing history, and more.
                </p>
                <button className="button-primary">
                  Add New Client
                </button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Invoice Management</h1>
                <div>
                  <Link
                     to="/invoices"
                     className="button-secondary"
                  >
                    View All Invoices</Link>
               </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Link to="/invoices" className="card p-6 hover:shadow-soft transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">Manage Invoices</h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">View, edit, and track status of all your invoices in one place.</p>
                </Link>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
              <div className="card p-8 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <SettingsIcon size={36} />
                </div>
                <h2 className="text-xl font-semibold mb-2">App Settings</h2>
                <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md">
                  Configure your account preferences, notification settings, and customize your BillFlow experience.
                </p>
                <button className="button-primary">
                  Update Settings
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;