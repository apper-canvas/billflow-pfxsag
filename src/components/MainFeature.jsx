import { useState } from 'react';
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
  const [templateStyle, setTemplateStyle] = useState('modern');
  
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
              <ClockIcon size={14} className="mr-1" /> Set Recurring
            </Link>
            <Link to="/invoices" className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <SendIcon size={14} className="mr-1" /> Send Invoices
            </Link>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <ImageIcon size={14} className="mr-1" /> Customizable Templates
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <GlobeIcon size={14} className="mr-1" /> Multiple Currencies
            </span>
          </div>
          
          <p className="text-surface-600 dark:text-surface-400">
            Create professional invoices for your clients
          </p>
        </div>
      </div>
      
      {/* Template Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className={`card p-4 cursor-pointer transition-all ${templateStyle === 'modern' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setTemplateStyle('modern')}
        >
          <div className="h-32 bg-gradient-to-r from-primary to-primary-dark rounded-lg mb-3 flex items-center justify-center text-white">
            <span className="font-bold">Modern Template</span>
          </div>
          <div className="flex items-center gap-2">
            {templateStyle === 'modern' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Modern</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Clean, professional template with a modern color scheme</p>
        </div>
        
        <div 
          className={`card p-4 cursor-pointer transition-all ${templateStyle === 'classic' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setTemplateStyle('classic')}
        >
          <div className="h-32 bg-surface-100 dark:bg-surface-700 rounded-lg mb-3 flex items-center justify-center border border-surface-200 dark:border-surface-600">
            <span className="font-bold text-surface-800 dark:text-surface-200">Classic Template</span>
          </div>
          <div className="flex items-center gap-2">
            {templateStyle === 'classic' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Classic</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Traditional invoice layout with a timeless design</p>
        </div>
        
        <div 
          className={`card p-4 cursor-pointer transition-all ${templateStyle === 'minimal' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setTemplateStyle('minimal')}
        >
          <div className="h-32 bg-white dark:bg-surface-800 rounded-lg mb-3 flex items-center justify-center border border-surface-200 dark:border-surface-600">
            <span className="font-bold text-surface-800 dark:text-surface-200">Minimal Template</span>
          </div>
          <div className="flex items-center gap-2">
            {templateStyle === 'minimal' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Minimal</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Sleek, minimalist design that focuses on essential information</p>
        </div>
      </div>
      
      <div className="card p-6 text-center mt-6">
        <h3 className="text-lg font-semibold mb-4">Ready to Create an Invoice?</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Select your preferred template style above and click the button below to start creating a professional invoice for your clients.
        </p>
        <Link 
          to="/invoices/create" 
          className="button-primary inline-flex items-center justify-center"
      </div>
    </motion.div>
  );
};

export default MainFeature;