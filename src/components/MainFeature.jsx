import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icons
  const DollarSignIcon = getIcon('DollarSign');
  const FileTextIcon = getIcon('FileText');
  const CalendarIcon = getIcon('Calendar');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash');
  const ReceiptIcon = getIcon('Receipt');
  const SaveIcon = getIcon('Save');
  const AlertCircleIcon = getIcon('AlertCircle');
  const ClockIcon = getIcon('Clock');
  const SendIcon = getIcon('Send');
  const DollarIcon = getIcon('DollarSign');
  const GlobeIcon = getIcon('Globe');
  const ImageIcon = getIcon('Image');
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
            <ReceiptIcon className="text-primary" size={20} />
            <span>Start Billing Today</span>
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <Link to="/recurring-invoices" className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <ClockIcon size={14} className="mr-1" /> Set Recurring
            </Link>
            <Link to="/invoices" className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <SendIcon size={14} className="mr-1" /> Send Invoices
            </Link>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <ImageIcon size={14} className="mr-1" /> Customizable Templates
            </span>
          </div>
          
          <p className="text-surface-600 dark:text-surface-400">
            Create professional invoices for your clients
          </p>
        </div>
      </div>
      

        <h3 className="text-lg font-semibold mb-4">Ready to Create an Invoice?</h3>
        <h3 className="text-lg font-semibold mb-4">Create a Professional Invoice</h3>
          Select your preferred template style above and click the button below to start creating a professional invoice for your clients.
          Click the button below to start creating a professional invoice for your clients.
        <Link 
          to="/invoices/create" 
          className="button-primary inline-flex items-center justify-center"
        >
          <PlusIcon size={18} className="mr-2" />
          <span>Create New Invoice</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default MainFeature;