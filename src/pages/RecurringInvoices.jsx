import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Mock data for recurring invoices
const mockRecurringInvoices = [
  {
    id: 'REC-001',
    client: 'Stark Industries',
    frequency: 'monthly',
    amount: 5200.00,
    lastIssued: '2023-06-01',
    nextIssue: '2023-07-01',
    status: 'active',
    currency: 'USD',
  },
  {
    id: 'REC-002',
    client: 'Oscorp Industries',
    frequency: 'monthly',
    amount: 4750.00,
    lastIssued: '2023-06-20',
    nextIssue: '2023-07-20',
    status: 'active',
    currency: 'USD',
  },
  {
    id: 'REC-003',
    client: 'Wayne Enterprises',
    frequency: 'quarterly',
    amount: 12500.00,
    lastIssued: '2023-04-15',
    nextIssue: '2023-07-15',
    status: 'active',
    currency: 'USD',
  },
  {
    id: 'REC-004',
    client: 'LexCorp',
    frequency: 'weekly',
    amount: 1200.00,
    lastIssued: '2023-06-25',
    nextIssue: '2023-07-02',
    status: 'paused',
    currency: 'GBP',
  },
  {
    id: 'REC-005',
    client: 'Daily Planet',
    frequency: 'yearly',
    amount: 24000.00,
    lastIssued: '2023-01-10',
    nextIssue: '2024-01-10',
    status: 'active',
    currency: 'EUR',
  },
];

const RecurringInvoices = () => {
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PlusIcon = getIcon('Plus');
  const ClockIcon = getIcon('Clock');
  const PauseIcon = getIcon('Pause');
  const PlayIcon = getIcon('Play');
  const EditIcon = getIcon('Edit');
  const CalendarIcon = getIcon('Calendar');
  const AlertCircleIcon = getIcon('AlertCircle');
  const CheckIcon = getIcon('Check');
  
  // State
  const [recurringInvoices, setRecurringInvoices] = useState(mockRecurringInvoices);
  
  // Handle actions
  const handleToggleStatus = (id) => {
    setRecurringInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id 
          ? { 
              ...invoice, 
              status: invoice.status === 'active' ? 'paused' : 'active' 
            } 
          : invoice
      )
    );
    
    const invoice = recurringInvoices.find(inv => inv.id === id);
    const newStatus = invoice.status === 'active' ? 'paused' : 'active';
    
    toast.success(`Recurring invoice for ${invoice.client} is now ${newStatus}`);
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    switch(status) {
      case 'active':
        bgColor = 'bg-green-100 dark:bg-green-900/20';
        textColor = 'text-green-800 dark:text-green-400';
        icon = <CheckIcon size={14} />;
        break;
      case 'paused':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/20';
        textColor = 'text-yellow-800 dark:text-yellow-400';
        icon = <PauseIcon size={14} />;
        break;
      default:
        bgColor = 'bg-surface-100 dark:bg-surface-700';
        textColor = 'text-surface-800 dark:text-surface-300';
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Recurring Invoices</h1>
          </div>
          
          <Link to="/invoices/create" className="button-primary">
            <PlusIcon size={18} className="mr-2" />
            New Recurring Invoice
          </Link>
        </div>
        
        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-primary">
          <div className="flex items-start gap-3">
            <ClockIcon size={20} className="mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">About Recurring Invoices</h3>
              <p className="text-sm">
                Recurring invoices are automatically generated and sent to your clients according to the schedule you set. 
                They help you save time and ensure consistent billing for ongoing services.
              </p>
            </div>
          </div>
        </div>
        
        {/* Recurring Invoices List */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
          {recurringInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Frequency</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Next Issue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {recurringInvoices.map((invoice) => (
                    <motion.tr 
                      key={invoice.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className="dark:hover:bg-surface-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-primary hover:text-primary-dark font-medium">
                            {invoice.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                        <span className="capitalize">{invoice.frequency}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {invoice.currency === 'USD' && '$'}
                        {invoice.currency === 'EUR' && '€'}
                        {invoice.currency === 'GBP' && '£'}
                        {invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                        {format(new Date(invoice.nextIssue), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/invoices/edit/${invoice.id}`} className="text-primary hover:text-primary-dark" title="Edit Invoice">
                            <EditIcon size={18} />
                          </Link>
                          <button 
                            onClick={() => handleToggleStatus(invoice.id)} 
                            className="text-surface-600 hover:text-primary"
                            title={invoice.status === 'active' ? 'Pause Recurring' : 'Activate Recurring'}
                          >
                            {invoice.status === 'active' ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 mb-4">
                <ClockIcon size={24} className="text-surface-600 dark:text-surface-400" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">No recurring invoices yet</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Set up recurring invoices to automatically bill your clients on a schedule.
              </p>
              <Link to="/invoices/create" className="button-primary">
                <PlusIcon size={18} className="mr-2" />
                Create Recurring Invoice
              </Link>
            </div>
          )}
        </div>
        
        {/* Upcoming Schedule */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="font-medium flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary" />
              <span>Upcoming Invoice Schedule</span>
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recurringInvoices
                .filter(inv => inv.status === 'active')
                .sort((a, b) => new Date(a.nextIssue) - new Date(b.nextIssue))
                .slice(0, 3)
                .map((invoice, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700"
                  >
                    <div>
                      <div className="font-medium">{invoice.client}</div>
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        {invoice.id} - {invoice.currency === 'USD' ? '$' : invoice.currency === 'EUR' ? '€' : '£'}{invoice.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{format(new Date(invoice.nextIssue), 'MMMM d, yyyy')}</div>
                      <div className="text-xs text-surface-500">
                        {new Date(invoice.nextIssue).toLocaleString('en-us', { weekday: 'long' })}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringInvoices;