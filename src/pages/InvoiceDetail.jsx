import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Mock data for a single invoice
const mockInvoice = {
  id: 'INV-2023-001',
  client: {
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    address: '123 Corporate Lane\nMetropolis, NY 10001\nUnited States'
  },
  issueDate: '2023-05-15',
  dueDate: '2023-06-15',
  status: 'paid',
  currency: 'USD',
  taxRate: 10,
  items: [
    { description: 'Website Development', quantity: 1, rate: 1500.00 },
    { description: 'UI/UX Design', quantity: 1, rate: 800.00 },
    { description: 'Content Creation', quantity: 1, rate: 150.00 }
  ],
  notes: 'Thank you for your business. Payment is due within 30 days.',
  templateStyle: 'modern',
  companyName: 'YourBusiness',
  companyAddress: '456 Commerce Street\nEnterprise City, CA 94105\nUnited States'
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PrinterIcon = getIcon('Printer');
  const DownloadIcon = getIcon('Download');
  const SendIcon = getIcon('Send');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CheckIcon = getIcon('Check');
  const ClockIcon = getIcon('Clock');
  const AlertCircleIcon = getIcon('AlertCircle');
  const DollarSignIcon = getIcon('DollarSign');
  const FileTextIcon = getIcon('FileText');
  
  // State
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch invoice data from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setInvoice({
        ...mockInvoice,
        id: id // Use the ID from the URL
      });
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Calculate totals
  const calculateTotals = () => {
    if (!invoice) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = subtotal * (invoice.taxRate / 100);
    const total = subtotal + tax;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };
  
  const totals = calculateTotals();
  
  // Handle invoice actions
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    toast.info("Invoice download initiated");
  };
  
  const handleSend = () => {
    toast.success(`Invoice ${id} sent to ${invoice?.client.email}`);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      toast.success(`Invoice ${id} has been deleted`);
      navigate('/invoices');
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
  
  // Determine template styling
  const getTemplateStyles = () => {
    if (!invoice) return {};
    
    const isModern = invoice.templateStyle === 'modern';
    const isClassic = invoice.templateStyle === 'classic';
    
    return {
      header: isModern 
        ? 'bg-gradient-to-r from-primary to-primary-dark text-white' 
        : isClassic 
          ? 'bg-surface-100 dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600' 
          : 'bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-600',
      title: isModern ? 'text-white' : 'text-surface-800 dark:text-surface-200',
      subtitle: isModern ? 'text-white/80' : 'text-surface-600 dark:text-surface-400'
    };
  };
  
  const templateStyles = getTemplateStyles();
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-surface-400">Loading invoice...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/invoices" className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Invoice {invoice.id}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="button-secondary py-2"
            >
              <PrinterIcon size={16} className="mr-1" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button 
              onClick={handleDownload}
              className="button-secondary py-2"
            >
              <DownloadIcon size={16} className="mr-1" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={handleSend}
              className="button-primary py-2"
            >
              <SendIcon size={16} className="mr-1" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
        
        {/* Invoice Document */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
          {/* Invoice Header with Template Style */}
          <div className={`p-6 ${templateStyles.header}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className={`text-xl font-bold ${templateStyles.title}`}>{invoice.companyName}</h2>
                <p className={templateStyles.subtitle}>{invoice.companyAddress.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}</p>
              </div>
              <div className="text-right">
                <h1 className={`text-2xl font-bold mb-2 ${templateStyles.title}`}>INVOICE</h1>
                <p className={templateStyles.subtitle}>#{invoice.id}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Client and Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-surface-500 uppercase tracking-wide mb-2">Bill To</h3>
                <p className="font-medium text-lg">{invoice.client.name}</p>
                <p className="text-surface-600 dark:text-surface-400">{invoice.client.email}</p>
                <p className="text-surface-600 dark:text-surface-400 whitespace-pre-line">{invoice.client.address}</p>
              </div>
              
              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Issue Date:</span>
                    <span>{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Due Date:</span>
                    <span>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;