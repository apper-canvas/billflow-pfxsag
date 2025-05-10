import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-2023-001',
    client: 'Acme Corporation',
    issueDate: '2023-05-15',
    dueDate: '2023-06-15',
    amount: 2450.00,
    status: 'paid',
    currency: 'USD',
    recurring: false
  },
  {
    id: 'INV-2023-002',
    client: 'Wayne Enterprises',
    issueDate: '2023-05-20',
    dueDate: '2023-06-20',
    amount: 3750.00,
    status: 'paid',
    currency: 'USD',
    recurring: false
  },
  {
    id: 'INV-2023-003',
    client: 'Stark Industries',
    issueDate: '2023-06-01',
    dueDate: '2023-07-01',
    amount: 5200.00,
    status: 'pending',
    currency: 'USD',
    recurring: true
  },
  {
    id: 'INV-2023-004',
    client: 'Daily Planet',
    issueDate: '2023-06-10',
    dueDate: '2023-07-10',
    amount: 1800.00,
    status: 'overdue',
    currency: 'EUR',
    recurring: false
  },
  {
    id: 'INV-2023-005',
    client: 'LexCorp',
    issueDate: '2023-06-15',
    dueDate: '2023-07-15',
    amount: 3200.00,
    status: 'draft',
    currency: 'GBP',
    recurring: false
  },
  {
    id: 'INV-2023-006',
    client: 'Oscorp Industries',
    issueDate: '2023-06-20',
    dueDate: '2023-07-20',
    amount: 4750.00,
    status: 'pending',
    currency: 'USD',
    recurring: true
  }
];

const InvoiceList = () => {
  // Get icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const ClockIcon = getIcon('Clock');
  const SendIcon = getIcon('Send');
  const FileTextIcon = getIcon('FileText');
  const TrashIcon = getIcon('Trash');
  const CheckIcon = getIcon('Check');
  const AlertCircleIcon = getIcon('AlertCircle');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  // State
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Filter invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      if (filter === 'all') return true;
      if (filter === 'recurring' && invoice.recurring) return true;
      return invoice.status === filter;
    })
    .filter(invoice => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        invoice.id.toLowerCase().includes(term) ||
        invoice.client.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === 'amount') {
        valueA = a.amount;
        valueB = b.amount;
      } else if (sortBy === 'client') {
        valueA = a.client;
        valueB = b.client;
      } else {
        valueA = new Date(a[sortBy]);
        valueB = new Date(b[sortBy]);
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  
  // Handle actions
  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast.success(`Invoice ${id} has been deleted`);
  };
  
  const handleSendInvoice = (id) => {
    toast.success(`Invoice ${id} has been sent to the client`);
  };
  
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    switch(status) {
      case 'paid':
        bgColor = 'bg-green-100 dark:bg-green-900/20';
        textColor = 'text-green-800 dark:text-green-400';
        icon = <CheckIcon size={14} />;
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/20';
        textColor = 'text-yellow-800 dark:text-yellow-400';
        icon = <ClockIcon size={14} />;
        break;
      case 'overdue':
        bgColor = 'bg-red-100 dark:bg-red-900/20';
        textColor = 'text-red-800 dark:text-red-400';
        icon = <AlertCircleIcon size={14} />;
        break;
      default:
        bgColor = 'bg-surface-100 dark:bg-surface-700';
        textColor = 'text-surface-800 dark:text-surface-300';
        icon = <FileTextIcon size={14} />;
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Invoices</h1>
          </div>
          
          <Link to="/invoices/create" className="button-primary">
            <PlusIcon size={18} className="mr-2" />
            New Invoice
          </Link>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field py-2.5"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Drafts</option>
              <option value="recurring">Recurring</option>
            </select>
            
            <button className="button-secondary p-2.5">
              <FilterIcon size={20} />
            </button>
          </div>
        </div>
        
        {/* Invoices List */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('id')}>
                      <div className="flex items-center gap-1">
                        Invoice #
                        {sortBy === 'id' && <ArrowUpDownIcon size={14} />}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('client')}>
                      <div className="flex items-center gap-1">
                        Client
                        {sortBy === 'client' && <ArrowUpDownIcon size={14} />}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('issueDate')}>
                      <div className="flex items-center gap-1">
                        Issue Date
                        {sortBy === 'issueDate' && <ArrowUpDownIcon size={14} />}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('dueDate')}>
                      <div className="flex items-center gap-1">
                        Due Date
                        {sortBy === 'dueDate' && <ArrowUpDownIcon size={14} />}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('amount')}>
                      <div className="flex items-center gap-1">
                        Amount
                        {sortBy === 'amount' && <ArrowUpDownIcon size={14} />}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredInvoices.map((invoice) => (
                    <motion.tr 
                      key={invoice.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className="dark:hover:bg-surface-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {invoice.recurring && (
                            <span className="mr-1.5 text-primary" title="Recurring Invoice">
                              <ClockIcon size={14} />
                            </span>
                          )}
                          <Link to={`/invoices/${invoice.id}`} className="text-primary hover:text-primary-dark font-medium">
                            {invoice.id}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                        {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                        {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {invoice.currency === 'USD' && '$'}
                        {invoice.currency === 'EUR' && '€'}
                        {invoice.currency === 'GBP' && '£'}
                        {invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/invoices/${invoice.id}`} className="text-primary hover:text-primary-dark" title="View Invoice">
                            <FileTextIcon size={18} />
                          </Link>
                          <button onClick={() => handleSendInvoice(invoice.id)} className="text-surface-600 hover:text-primary" title="Send Invoice">
                            <SendIcon size={18} />
                          </button>
                          <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-surface-600 hover:text-red-500" title="Delete Invoice">
                            <TrashIcon size={18} />
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
                <FileTextIcon size={24} className="text-surface-600 dark:text-surface-400" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">No invoices found</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                {searchTerm ? "Try adjusting your search or filter." : "Get started by creating your first invoice."}
              </p>
              <Link to="/invoices/create" className="button-primary">
                <PlusIcon size={18} className="mr-2" />
                Create Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;