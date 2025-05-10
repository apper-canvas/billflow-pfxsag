import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Demo invoice data (in a real app, this would come from an API or state)
const demoInvoice = {
  id: 'INV-2023-003',
  client: {
    name: 'Stark Industries',
    address: '200 Park Avenue, New York, NY 10166',
    email: 'accounting@stark.com',
    phone: '(212) 555-3000'
  },
  issueDate: '2023-06-01',
  dueDate: '2023-07-01',
  items: [
    { description: 'Web Application Development', quantity: 80, rate: 55, amount: 4400 },
    { description: 'UI/UX Design Services', quantity: 20, rate: 60, amount: 1200 },
    { description: 'Server Deployment & Setup', quantity: 1, rate: 450, amount: 450 }
  ],
  subtotal: 6050,
  taxRate: 8.5,
  taxAmount: 514.25,
  total: 6564.25,
  status: 'pending',
  currency: 'USD',
  notes: 'Thank you for your business. Payment is due within 30 days.',
  isRecurring: true,
  recurringInfo: {
    frequency: 'monthly',
    nextDate: '2023-07-01'
  },
  paymentReminders: [
    { days: 7, status: 'scheduled' },
    { days: 1, status: 'scheduled' }
  ]
};

const InvoiceDetail = () => {
  const { id } = useParams();
  // In a real app, we would fetch the invoice data based on the id parameter
  const [invoice] = useState(demoInvoice);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  
  // Get icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PrinterIcon = getIcon('Printer');
  const DownloadIcon = getIcon('Download');
  const SendIcon = getIcon('Send');
  const ClockIcon = getIcon('Clock');
  const BellIcon = getIcon('Bell');
  const EditIcon = getIcon('Edit');
  const DollarSignIcon = getIcon('DollarSign');
  const CheckIcon = getIcon('Check');
  const AlertCircleIcon = getIcon('AlertCircle');
  const TrashIcon = getIcon('Trash');
  const CreditCardIcon = getIcon('CreditCard');
  const CopyIcon = getIcon('Copy');
  
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
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  // Action handlers
  const handleSendInvoice = () => {
    toast.success('Invoice sent to client email successfully!');
  };
  
  const handleMarkAsPaid = () => {
    toast.success('Invoice has been marked as paid');
    setShowPaymentOptions(false);
    // In a real app, we would update the invoice status
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    toast.info('Invoice PDF is being generated and will download shortly');
  };
  
  const handleReminderToggle = (days) => {
    toast.success(`Payment reminder ${days} days before due date has been toggled`);
    // In a real app, we would update the reminder status
  };
  
  const formatCurrency = (amount) => {
    const currencySymbol = 
      invoice.currency === 'USD' ? '$' : 
      invoice.currency === 'EUR' ? '€' : 
      invoice.currency === 'GBP' ? '£' : '$';
      
    return `${currencySymbol}${amount.toFixed(2)}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/invoices" className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Invoice #{invoice.id}</h1>
            <StatusBadge status={invoice.status} />
            {invoice.isRecurring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <ClockIcon size={14} />
                Recurring
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handlePrint}
              className="button-secondary py-2"
            >
              <PrinterIcon size={16} className="mr-1" />
              Print
            </button>
            <button 
              onClick={handleDownload}
              className="button-secondary py-2"
            >
              <DownloadIcon size={16} className="mr-1" />
              Download
            </button>
            <button 
              onClick={handleSendInvoice}
              className="button-secondary py-2"
            >
              <SendIcon size={16} className="mr-1" />
              Send
            </button>
            <Link 
              to={`/invoices/edit/${invoice.id}`}
              className="button-secondary py-2"
            >
              <EditIcon size={16} className="mr-1" />
              Edit
            </Link>
            <button 
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
              className="button-primary py-2"
            >
              <DollarSignIcon size={16} className="mr-1" />
              Record Payment
            </button>
          </div>
        </div>
        
        {/* Payment Options (conditional) */}
        {showPaymentOptions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-4"
          >
            <h3 className="font-medium mb-3">Record Payment</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleMarkAsPaid}
                className="button-primary py-1.5 px-3 text-sm"
              >
                <CheckIcon size={14} className="mr-1" />
                Mark as Paid
              </button>
              <button 
                className="button-secondary py-1.5 px-3 text-sm"
              >
                <CreditCardIcon size={14} className="mr-1" />
                Credit Card
              </button>
              <button 
                className="button-secondary py-1.5 px-3 text-sm"
              >
                <DollarSignIcon size={14} className="mr-1" />
                Bank Transfer
              </button>
              <button 
                onClick={() => setShowPaymentOptions(false)}
                className="button-secondary py-1.5 px-3 text-sm text-red-500 hover:text-red-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Invoice Content */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="p-8">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-1">INVOICE</h2>
                <p className="text-2xl font-bold mb-4">{invoice.id}</p>
                <div className="space-y-1 text-surface-700 dark:text-surface-300">
                  <p><span className="font-medium">Issue Date:</span> {format(new Date(invoice.issueDate), 'MMMM d, yyyy')}</p>
                  <p><span className="font-medium">Due Date:</span> {format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 text-right">
                <div className="text-xl font-bold mb-2">BillFlow Inc.</div>
                <div className="text-surface-700 dark:text-surface-300">
                  <p>1234 Business Ave</p>
                  <p>Suite 567</p>
                  <p>San Francisco, CA 94107</p>
                  <p>billing@billflow.com</p>
                </div>
              </div>
            </div>
            
            {/* Client Information */}
            <div className="mb-8">
              <div className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-2">BILL TO</div>
              <div className="text-lg font-bold mb-1">{invoice.client.name}</div>
              <div className="text-surface-700 dark:text-surface-300">
                <p>{invoice.client.address}</p>
                <p>{invoice.client.email}</p>
                <p>{invoice.client.phone}</p>
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 font-medium text-surface-700 dark:text-surface-300">Description</th>
                    <th className="text-right py-3 font-medium text-surface-700 dark:text-surface-300">Quantity</th>
                    <th className="text-right py-3 font-medium text-surface-700 dark:text-surface-300">Rate</th>
                    <th className="text-right py-3 font-medium text-surface-700 dark:text-surface-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-surface-200 dark:border-surface-700">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Invoice Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-64">
                <div className="flex justify-between py-2">
                  <span className="text-surface-700 dark:text-surface-300">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-surface-700 dark:text-surface-300">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-surface-200 dark:border-surface-700 mt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-surface-700 dark:text-surface-300">{invoice.notes}</p>
              </div>
            )}
            
            {/* Recurring and Reminder Settings */}
            {(invoice.isRecurring || invoice.paymentReminders.length > 0) && (
              <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {invoice.isRecurring && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-1">
                        <ClockIcon size={16} className="text-primary" />
                        Recurring Schedule
                      </h3>
                      <div className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-3">
                        <p className="text-surface-700 dark:text-surface-300 mb-1">
                          <span className="font-medium">Frequency:</span> {invoice.recurringInfo.frequency.charAt(0).toUpperCase() + invoice.recurringInfo.frequency.slice(1)}
                        </p>
                        <p className="text-surface-700 dark:text-surface-300">
                          <span className="font-medium">Next Invoice:</span> {format(new Date(invoice.recurringInfo.nextDate), 'MMMM d, yyyy')}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="text-sm text-primary hover:text-primary-dark">Edit Schedule</button>
                          <button className="text-sm text-red-500 hover:text-red-600">Cancel Recurring</button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {invoice.paymentReminders.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-1">
                        <BellIcon size={16} className="text-primary" />
                        Payment Reminders
                      </h3>
                      <div className="space-y-2">
                        {invoice.paymentReminders.map((reminder, index) => (
                          <div key={index} className="flex items-center justify-between bg-surface-50 dark:bg-surface-700/50 rounded-lg p-3">
                            <span className="text-surface-700 dark:text-surface-300">
                              {reminder.days} {reminder.days === 1 ? 'day' : 'days'} before due date
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300">
                                {reminder.status}
                              </span>
                              <button 
                                onClick={() => handleReminderToggle(reminder.days)}
                                className="text-surface-500 hover:text-red-500"
                              >
                                <TrashIcon size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="text-sm text-primary hover:text-primary-dark mt-2 flex items-center gap-1">
                          <BellIcon size={14} />
                          Add Reminder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;