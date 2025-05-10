import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  
  // State for the invoice creation form
  const [formData, setFormData] = useState({
    clientName: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: '',
    taxRate: 0,
    currency: 'USD',
    isRecurring: false,
    reminderEnabled: false,
    templateStyle: 'modern',
    companyLogo: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Calculate totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0
  });
  
  // Recalculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);
    
    const tax = subtotal * (formData.taxRate / 100);
    const total = subtotal + tax;
    
    setTotals({
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    });
  }, [formData.items, formData.taxRate]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Handle changes to line items
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'rate' 
      ? parseFloat(value) || 0 
      : value;
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  // Add a new line item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };
  
  // Remove a line item
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    } else {
      toast.info("You need at least one item on the invoice");
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }
    
    const invalidItems = formData.items.some(item => !item.description.trim());
    if (invalidItems) {
      newErrors.items = "All items must have a description";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, we would save the invoice to the database
      toast.success("Invoice created successfully!");
      
      // Reset form after successful submission
      setFormData({
        clientName: '',
        invoiceNumber: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, rate: 0 }],
        notes: '',
        taxRate: 0
      });
    } else {
      toast.error("Please correct the errors before submitting");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
            <ReceiptIcon className="text-primary" size={20} />
            <span>Start Billing Today</span>
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            <Link to="/invoices/create" className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <FileTextIcon size={14} className="mr-1" /> Create Invoices
            </Link>
            <Link to="/recurring-invoices" className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
              <ClockIcon size={14} className="mr-1" /> Set Recurring
            </Link>
            <Link to="/invoices" className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <SendIcon size={14} className="mr-1" /> Send Invoices
            </Link>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm">
              <ImageIcon size={14} className="mr-1" /> Customizable Templates
            </span>
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
          className={`card p-4 cursor-pointer transition-all ${formData.templateStyle === 'modern' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setFormData({...formData, templateStyle: 'modern'})}
        >
          <div className="h-32 bg-gradient-to-r from-primary to-primary-dark rounded-lg mb-3 flex items-center justify-center text-white">
            <span className="font-bold">Modern Template</span>
          </div>
          <div className="flex items-center gap-2">
            {formData.templateStyle === 'modern' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Modern</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Clean, professional template with a modern color scheme</p>
        </div>
        
        <div 
          className={`card p-4 cursor-pointer transition-all ${formData.templateStyle === 'classic' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setFormData({...formData, templateStyle: 'classic'})}
        >
          <div className="h-32 bg-surface-100 dark:bg-surface-700 rounded-lg mb-3 flex items-center justify-center border border-surface-200 dark:border-surface-600">
            <span className="font-bold text-surface-800 dark:text-surface-200">Classic Template</span>
          </div>
          <div className="flex items-center gap-2">
            {formData.templateStyle === 'classic' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Classic</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Traditional invoice layout with a timeless design</p>
        </div>
        
        <div 
          className={`card p-4 cursor-pointer transition-all ${formData.templateStyle === 'minimal' ? 'ring-2 ring-primary' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
          onClick={() => setFormData({...formData, templateStyle: 'minimal'})}
        >
          <div className="h-32 bg-white dark:bg-surface-800 rounded-lg mb-3 flex items-center justify-center border border-surface-200 dark:border-surface-600">
            <span className="font-bold text-surface-800 dark:text-surface-200">Minimal Template</span>
          </div>
          <div className="flex items-center gap-2">
            {formData.templateStyle === 'minimal' && <CheckIcon className="text-primary" size={16} />}
            <h4 className="font-medium text-sm">Minimal</h4>
          </div>
          <p className="text-surface-500 text-sm mt-1">Sleek, minimalist design that focuses on essential information</p>
        </div>
      </div>
      
      
      <div className="card overflow-visible">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create New Invoice</h3>
            <Link to="/invoices/create" className="button-primary text-sm py-1.5">
              Advanced Options
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Client Information */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Client Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={`input-field ${errors.clientName ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="Enter client name"
                />
                {errors.clientName && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircleIcon size={14} />
                    <span>{errors.clientName}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Invoice Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  className={`input-field ${errors.invoiceNumber ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="INV-001"
                />
                {errors.invoiceNumber && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircleIcon size={14} />
                    <span>{errors.invoiceNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Issue Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            
            {/* Currency Selection */}
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Currency
              </label>
              <div className="relative">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field appearance-none pr-10"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-surface-500">
                  <DollarIcon size={16} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Company Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="file"
                    id="company-logo"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={() => toast.info("Logo upload feature will be available in full version")}
                  />
                  <button
                    type="button"
                    className="button-secondary py-2 flex items-center gap-2"
                  >
                    <ImageIcon size={16} />
                    <span>Upload Logo</span>
                  </button>
                </div>
                {formData.companyLogo && <span className="text-sm text-surface-600">Logo uploaded</span>}
              </div>
            </div>
            
            {/* Recurring Invoice Option */}
            {/* Recurring Invoice Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isRecurring" className="text-surface-700 dark:text-surface-300">Make this a recurring invoice</label>
            </div>
            
            {/* Payment Reminder Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminderEnabled"
                name="reminderEnabled"
                checked={formData.reminderEnabled}
                onChange={(e) => setFormData({...formData, reminderEnabled: e.target.checked})}
                className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
              />
              <label htmlFor="reminderEnabled" className="text-surface-700 dark:text-surface-300">Enable payment reminders</label>
            </div>
          </div>
          
          {/* Line Items */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Line Items</h4>
              <button
                type="button"
                onClick={addItem}
                className="text-sm flex items-center gap-1 text-primary hover:text-primary-dark"
              >
                <PlusIcon size={16} />
                <span>Add Item</span>
              </button>
            </div>
            
            {errors.items && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertCircleIcon size={16} />
                <span>{errors.items}</span>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left pb-2 font-medium text-surface-700 dark:text-surface-300 text-sm">Description</th>
                    <th className="text-right pb-2 font-medium text-surface-700 dark:text-surface-300 text-sm w-24">Quantity</th>
                    <th className="text-right pb-2 font-medium text-surface-700 dark:text-surface-300 text-sm w-32">Rate</th>
                    <th className="text-right pb-2 font-medium text-surface-700 dark:text-surface-300 text-sm w-32">Amount</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {formData.items.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-surface-200 dark:border-surface-700"
                      >
                        <td className="py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="input-field"
                            placeholder="Item description"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="input-field text-right"
                            min="1"
                            step="1"
                          />
                        </td>
                        <td className="py-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">$</span>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              className="input-field text-right pl-8"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="py-3 text-right font-medium">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-surface-500 hover:text-red-500 transition-colors p-1"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* Totals */}
            <div className="mt-6 flex flex-col items-end">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-surface-600 dark:text-surface-400">Tax Rate:</span>
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleChange}
                      className="w-16 text-right input-field py-1 px-2 text-sm"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-surface-600 dark:text-surface-400">%</span>
                  </div>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-surface-200 dark:border-surface-700">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field min-h-24"
              placeholder="Enter any additional notes for the client..."
            ></textarea>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="button-secondary order-2 sm:order-1"
              onClick={() => toast.info("Draft saved!")}
            >
              Save as Draft
            </button>
            <Link
              to="/invoices/create"
              className="button-secondary order-2 sm:order-1"
            >
              Advanced Options
            </Link>
            <motion.button
              type="submit"
              className="button-primary order-1 sm:order-2 py-3"
              whileTap={{ scale: 0.98 }}
            >
              <SaveIcon size={18} className="mr-2" />
              Create Invoice
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MainFeature;