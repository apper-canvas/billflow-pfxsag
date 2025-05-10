import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, add } from 'date-fns';
import getIcon from '../utils/iconUtils';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const SaveIcon = getIcon('Save');
  const SendIcon = getIcon('Send');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash');
  const AlertCircleIcon = getIcon('AlertCircle');
  const DollarSignIcon = getIcon('DollarSign');
  const ClockIcon = getIcon('Clock');
  const BellIcon = getIcon('Bell');
  const CheckIcon = getIcon('Check');
  const CalendarIcon = getIcon('Calendar');
  const GlobeIcon = getIcon('Globe');
  const ImageIcon = getIcon('Image');
  
  // Define available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ];
  
  // Define recurring frequencies
  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  
  // Define reminder options
  const reminderOptions = [
    { days: 1, label: '1 day before due date' },
    { days: 3, label: '3 days before due date' },
    { days: 7, label: '1 week before due date' },
    { days: 14, label: '2 weeks before due date' },
    { days: 0, label: 'On due date' },
  ];
  
  // Define template styles
  const templateStyles = [
    { id: 'modern', name: 'Modern', description: 'Clean, professional template with a modern color scheme' },
    { id: 'classic', name: 'Classic', description: 'Traditional invoice layout with a timeless design' },
    { id: 'minimal', name: 'Minimal', description: 'Sleek, minimalist design that focuses on essential information' }
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceNumber: isEditing ? id : `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: add(new Date(), { days: 30 }).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: 'Thank you for your business.',
    taxRate: 0,
    currency: 'USD',
    isRecurring: false,
    recurringFrequency: 'monthly',
    recurringEndDate: add(new Date(), { months: 12 }).toISOString().split('T')[0],
    reminders: [7], // Default to 7 days before due date
    
    // Template customization
    templateStyle: 'modern',
    companyName: '',
    companyLogo: '',
    companyAddress: '',
    accentColor: '#6366f1', // Default to primary color
    showSignature: false
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Track which section is expanded
  const [expandedSection, setExpandedSection] = useState(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
  
  // Handle reminder toggles
  const toggleReminder = (days) => {
    if (formData.reminders.includes(days)) {
      setFormData(prev => ({
        ...prev,
        reminders: prev.reminders.filter(d => d !== days)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        reminders: [...prev.reminders, days]
      }));
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Email address is invalid";
    }
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }
    
    const invalidItems = formData.items.some(item => !item.description.trim());
    if (invalidItems) {
      newErrors.items = "All items must have a description";
    }
    
    if (formData.isRecurring && new Date(formData.recurringEndDate) <= new Date(formData.issueDate)) {
      newErrors.recurringEndDate = "End date must be after the issue date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, we would save the invoice to an API
      toast.success(`Invoice ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/invoices');
    } else {
      toast.error("Please correct the errors before submitting");
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Get currency symbol
  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };
  
  // Template preview component
  const TemplatePreview = () => {
    const isModern = formData.templateStyle === 'modern';
    const isClassic = formData.templateStyle === 'classic';
    const isMinimal = formData.templateStyle === 'minimal';
    
    const templateBg = isModern 
      ? 'bg-gradient-to-r from-primary to-primary-dark text-white'
      : isClassic 
        ? 'bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600'
        : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600';
    
    const headerStyle = isModern
      ? 'text-white'
      : 'text-surface-800 dark:text-surface-200';
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTemplatePreview(false)}>
        <div className="bg-white dark:bg-surface-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
          <div className={`p-6 ${templateBg}`} style={isModern ? { background: formData.accentColor } : {}}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className={`text-xl font-bold ${headerStyle}`}>{formData.companyName || 'Your Company Name'}</h2>
                <p className={isModern ? 'text-white/80' : 'text-surface-600 dark:text-surface-400'}>
                  {formData.companyAddress || '123 Business Street, City, Country'}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded flex items-center justify-center overflow-hidden">
                {formData.companyLogo ? (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-bold text-surface-800">
                    LOGO
                  </div>
                ) : (
                  <ImageIcon size={24} className={isModern ? 'text-white/60' : 'text-surface-400'} />
                )}
              </div>
            </div>
            <h1 className={`text-2xl font-bold ${headerStyle}`}>INVOICE</h1>
          </div>
          <div className="p-6 space-y-6">
            <div className="border-b border-surface-200 dark:border-surface-700 pb-4">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">Invoice #: {formData.invoiceNumber || 'INV-2023-001'}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Date: {formData.issueDate || '2023-04-01'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Due Date:</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{formData.dueDate || '2023-05-01'}</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="font-medium mb-1">Bill To:</p>
                <p>{formData.clientName || 'Client Name'}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">{formData.clientEmail || 'client@example.com'}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">{formData.clientAddress || 'Client Address'}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-surface-600 dark:text-surface-400 mb-4">This is a preview of your selected template style</p>
              <button className="button-primary w-full" onClick={() => setShowTemplatePreview(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/invoices" className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h1>
          </div>
        </div>
        
        {showTemplatePreview && (
          <TemplatePreview />
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 rounded-t-xl">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>Invoice Details</span>
                {isEditing && <span className="text-sm font-normal text-surface-500">Editing {id}</span>}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-surface-500 uppercase tracking-wide">Client Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Client Name*
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
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Client Email*
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className={`input-field ${errors.clientEmail ? 'border-red-500 dark:border-red-400' : ''}`}
                        placeholder="client@example.com"
                      />
                      {errors.clientEmail && (
                        <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                          <AlertCircleIcon size={14} />
                          <span>{errors.clientEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Client Address
                    </label>
                    <textarea
                      name="clientAddress"
                      value={formData.clientAddress}
                      onChange={handleChange}
                      className="input-field min-h-20"
                      placeholder="Enter client address"
                    ></textarea>
                  </div>
                </div>
                
                {/* Invoice Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-surface-500 uppercase tracking-wide">Invoice Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Invoice Number*
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleChange}
                        className={`input-field ${errors.invoiceNumber ? 'border-red-500 dark:border-red-400' : ''}`}
                        placeholder="INV-2023-001"
                      />
                      {errors.invoiceNumber && (
                        <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                          <AlertCircleIcon size={14} />
                          <span>{errors.invoiceNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  
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
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-surface-500">
                        <GlobeIcon size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expandable Sections */}
              <div className="space-y-4 mb-8">
            {/* Template Customization */}
            <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('template')}
                className="w-full flex items-center justify-between p-4 text-left bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary" />
                  <span className="font-medium">Invoice Template & Branding</span>
                </div>
                <span className="text-surface-500">
                  {expandedSection === 'template' ? '−' : '+'}
                </span>
              </button>
              
              {expandedSection === 'template' && (
                <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Template Style Selection */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Template Style
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {templateStyles.map(template => (
                          <div 
                            key={template.id}
                            onClick={() => setFormData({...formData, templateStyle: template.id})}
                            className={`cursor-pointer border rounded-lg p-3 text-center ${
                              formData.templateStyle === template.id 
                                ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                                : 'border-surface-200 dark:border-surface-700'
                            }`}
                          >
                            <div className="font-medium text-sm mb-2">{template.name}</div>
                            <div className="h-12 bg-surface-100 dark:bg-surface-700 rounded flex items-center justify-center text-xs">
                              Preview
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <button 
                          type="button" 
                          className="text-primary text-sm hover:underline flex items-center"
                          onClick={() => setShowTemplatePreview(true)}
                        >
                          <ImageIcon size={14} className="mr-1" /> Preview template
                        </button>
                      </div>
                    </div>
                    
                    {/* Company Information */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Company Information
                      </label>
                      <input 
                        type="text" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleChange} 
                        className="input-field" 
                        placeholder="Company Name" 
                      />
                      <textarea 
                        name="companyAddress" 
                        value={formData.companyAddress} 
                        onChange={handleChange} 
                        className="input-field min-h-20" 
                        placeholder="Company Address"
                      >
                      </textarea>
                      </div>
                    </div>
                    
                    {/* Company Information */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                        Company Information
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Company Logo
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="file"
                              id="company-logo"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  // In a real app, you would upload this to a server
                                  // For this demo, we'll just set a placeholder
                                  setFormData({
                                    ...formData,
                                    companyLogo: 'logo-uploaded'
                                  });
                                  toast.success("Logo uploaded successfully!");
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="button-secondary py-2 flex items-center gap-2"
                            >
                              <ImageIcon size={16} />
                              <span>Upload Logo</span>
                            </button>
                          </div>
                          {formData.companyLogo && <span className="text-sm text-green-500">Logo uploaded ✓</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            name="accentColor"
                            value={formData.accentColor}
                            onChange={handleChange}
                            className="h-10 w-10 rounded border-0 p-0"
                          />
                          <span className="text-sm text-surface-600 dark:text-surface-400">
                            {formData.accentColor}
                          </span>
                        </div>
                      </div>
                      <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} className="input-field min-h-20" placeholder="Company Address"></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
                {/* Recurring Invoice Settings */}
                <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('recurring')}
                    className="w-full flex items-center justify-between p-4 text-left bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon size={18} className="text-primary" />
                      <span className="font-medium">Recurring Invoice Settings</span>
                      {formData.isRecurring && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Enabled
                        </span>
                      )}
                    </div>
                    <span className="text-surface-500">
                      {expandedSection === 'recurring' ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedSection === 'recurring' && (
                    <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="checkbox"
                          id="isRecurring"
                          name="isRecurring"
                          checked={formData.isRecurring}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isRecurring" className="text-surface-700 dark:text-surface-300 font-medium">
                          Make this a recurring invoice
                        </label>
                      </div>
                      
                      {formData.isRecurring && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                              Frequency
                            </label>
                            <select
                              name="recurringFrequency"
                              value={formData.recurringFrequency}
                              onChange={handleChange}
                              className="input-field"
                            >
                              {frequencies.map(freq => (
                                <option key={freq.value} value={freq.value}>{freq.label}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              name="recurringEndDate"
                              value={formData.recurringEndDate}
                              onChange={handleChange}
                              className={`input-field ${errors.recurringEndDate ? 'border-red-500 dark:border-red-400' : ''}`}
                            />
                            {errors.recurringEndDate && (
                              <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                                <AlertCircleIcon size={14} />
                                <span>{errors.recurringEndDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Payment Reminders */}
                <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('reminders')}
                    className="w-full flex items-center justify-between p-4 text-left bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <div className="flex items-center gap-2">
                      <BellIcon size={18} className="text-primary" />
                      <span className="font-medium">Payment Reminders</span>
                      {formData.reminders.length > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {formData.reminders.length} {formData.reminders.length === 1 ? 'reminder' : 'reminders'}
                        </span>
                      )}
                    </div>
                    <span className="text-surface-500">
                      {expandedSection === 'reminders' ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedSection === 'reminders' && (
                    <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                      <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">
                        Select when to send payment reminders to the client:
                      </p>
                      
                      <div className="space-y-2">
                        {reminderOptions.map(option => (
                          <div key={option.days} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`reminder-${option.days}`}
                              checked={formData.reminders.includes(option.days)}
                              onChange={() => toggleReminder(option.days)}
                              className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`reminder-${option.days}`} className="text-surface-700 dark:text-surface-300">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                
                {/* Items table similar to the one in MainFeature.jsx */}
                {/* ... (line items implementation would be here) ... */}
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
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/invoices"
              className="button-secondary order-2 sm:order-1"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="button-secondary order-2 sm:order-1"
              onClick={() => {
                toast.info("Draft saved!");
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="button-secondary order-2 sm:order-1"
              onClick={() => {
                if (validateForm()) {
                  toast.success("Invoice saved and sent to client!");
                  navigate('/invoices');
                } else {
                  toast.error("Please correct errors before sending");
                }
              }}
            >
              <SendIcon size={18} className="mr-2" />
              Save & Send
            </button>
            <motion.button
              type="submit"
              className="button-primary order-1 sm:order-2 py-3"
              whileTap={{ scale: 0.98 }}
            >
              <SaveIcon size={18} className="mr-2" />
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;