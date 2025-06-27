import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { settingsService } from "@/services/api/settingsService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useTheme } from "@/hooks/useTheme";

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef(null)
  const [settings, setSettings] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    invoicePrefix: 'INV-',
    taxRate: 0,
    currency: 'USD',
    branding: {
      logo: null,
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#10b981',
      headerStyle: 'standard',
      footerStyle: 'standard',
      selectedTemplate: 'modern'
    },
    templates: {}
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('company')
  const [showColorPicker, setShowColorPicker] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await settingsService.get()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings')
      console.error('Settings loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await settingsService.update(settings)
      toast.success('Settings saved successfully')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleBrandingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }))
  }

  const handleLogoUpload = async (file) => {
    if (!file) return
    
    try {
      setUploading(true)
      const logoData = await settingsService.uploadLogo(file)
      handleBrandingChange('logo', logoData)
      toast.success('Logo uploaded successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) handleLogoUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleLogoUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeLogo = () => {
    handleBrandingChange('logo', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

const tabs = [
    { id: 'company', label: 'Company', icon: 'Building' },
    { id: 'invoice', label: 'Invoice', icon: 'FileText' },
    { id: 'templates', label: 'Templates', icon: 'Layout' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
  ]

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
  ]

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ]

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadSettings} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your InvoiceFlow preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                  ${activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }
                `}
              >
                <ApperIcon name={tab.icon} className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {/* Company Settings */}
            {activeTab === 'company' && (
              <motion.div
                className="card p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Company Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    This information will appear on your invoices
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                    required
                  />
                  
                  <Input
                    label="Company Email"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Address
                    </label>
                    <textarea
                      className="input min-h-[100px] resize-y"
                      value={settings.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      placeholder="123 Business St, City, State 12345"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invoice Settings */}
            {activeTab === 'invoice' && (
              <motion.div
                className="card p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Invoice Configuration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Customize how your invoices are generated
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Invoice Number Prefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                    placeholder="INV-"
                  />
                  
                  <Select
                    label="Currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    options={currencyOptions}
                  />
                  
                  <Input
                    label="Tax Rate (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Invoice Numbering
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        New invoices will use the format: {settings.invoicePrefix}0001, {settings.invoicePrefix}0002, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Settings */}
{/* Templates Settings */}
            {activeTab === 'templates' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Template Selection */}
                <div className="card p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Invoice Templates
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose a template design for your invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {Object.entries(settings.templates).map(([key, template]) => (
                      <div
                        key={key}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${settings.branding.selectedTemplate === key
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                        onClick={() => handleBrandingChange('selectedTemplate', key)}
                      >
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-3 flex items-center justify-center">
                          <ApperIcon name="FileText" className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="card p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Company Logo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Upload your company logo to appear on invoices
                    </p>
                  </div>

                  <div className="mt-6">
                    {settings.branding.logo ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <img
                            src={settings.branding.logo}
                            alt="Company Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Logo uploaded successfully
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              icon="Upload"
                            >
                              Replace
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removeLogo}
                              icon="Trash2"
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`
                          border-2 border-dashed rounded-lg p-8 text-center transition-colors
                          ${dragActive
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Drop your logo here, or{' '}
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-700"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="card p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Brand Colors
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Customize the color scheme for your invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="space-y-3">
                        <div
                          className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer relative"
                          style={{ backgroundColor: settings.branding.primaryColor }}
                          onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-medium drop-shadow">
                              {settings.branding.primaryColor}
                            </span>
                          </div>
                        </div>
                        {showColorPicker === 'primary' && (
                          <div className="relative">
                            <div className="absolute top-2 left-0 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <HexColorPicker
                                color={settings.branding.primaryColor}
                                onChange={(color) => handleBrandingChange('primaryColor', color)}
                              />
                              <div className="mt-3 flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => setShowColorPicker(null)}
                                >
                                  Done
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="space-y-3">
                        <div
                          className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer relative"
                          style={{ backgroundColor: settings.branding.secondaryColor }}
                          onClick={() => setShowColorPicker(showColorPicker === 'secondary' ? null : 'secondary')}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-medium drop-shadow">
                              {settings.branding.secondaryColor}
                            </span>
                          </div>
                        </div>
                        {showColorPicker === 'secondary' && (
                          <div className="relative">
                            <div className="absolute top-2 left-0 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <HexColorPicker
                                color={settings.branding.secondaryColor}
                                onChange={(color) => handleBrandingChange('secondaryColor', color)}
                              />
                              <div className="mt-3 flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => setShowColorPicker(null)}
                                >
                                  Done
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="space-y-3">
                        <div
                          className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer relative"
                          style={{ backgroundColor: settings.branding.accentColor }}
                          onClick={() => setShowColorPicker(showColorPicker === 'accent' ? null : 'accent')}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-medium drop-shadow">
                              {settings.branding.accentColor}
                            </span>
                          </div>
                        </div>
                        {showColorPicker === 'accent' && (
                          <div className="relative">
                            <div className="absolute top-2 left-0 z-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <HexColorPicker
                                color={settings.branding.accentColor}
                                onChange={(color) => handleBrandingChange('accentColor', color)}
                              />
                              <div className="mt-3 flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => setShowColorPicker(null)}
                                >
                                  Done
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header & Footer Styles */}
                <div className="card p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Header & Footer Styles
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose how headers and footers appear on your invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Select
                        label="Header Style"
                        value={settings.branding.headerStyle}
                        onChange={(e) => handleBrandingChange('headerStyle', e.target.value)}
                        options={[
                          { value: 'minimal', label: 'Minimal' },
                          { value: 'standard', label: 'Standard' },
                          { value: 'detailed', label: 'Detailed' }
                        ]}
                      />
                    </div>
                    <div>
                      <Select
                        label="Footer Style"
                        value={settings.branding.footerStyle}
                        onChange={(e) => handleBrandingChange('footerStyle', e.target.value)}
                        options={[
                          { value: 'minimal', label: 'Minimal' },
                          { value: 'standard', label: 'Standard' },
                          { value: 'detailed', label: 'Detailed' }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="card p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Preview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      See how your invoices will look with current settings
                    </p>
                  </div>

                  <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    {/* Preview Header */}
                    <div 
                      className="flex items-center justify-between mb-6 pb-4 border-b"
                      style={{ borderColor: settings.branding.primaryColor + '20' }}
                    >
                      <div className="flex items-center space-x-4">
                        {settings.branding.logo && (
                          <img
                            src={settings.branding.logo}
                            alt="Logo"
                            className="h-12 w-auto object-contain"
                          />
                        )}
                        <div>
                          <h2 
                            className="text-xl font-bold"
                            style={{ color: settings.branding.primaryColor }}
                          >
                            {settings.companyName || 'Your Company'}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            INVOICE #{settings.invoicePrefix}0001
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Date: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 
                          className="font-semibold mb-2"
                          style={{ color: settings.branding.secondaryColor }}
                        >
                          Bill To:
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Sample Client</p>
                          <p>client@example.com</p>
                          <p>123 Client Street</p>
                        </div>
                      </div>
                      <div>
                        <h3 
                          className="font-semibold mb-2"
                          style={{ color: settings.branding.secondaryColor }}
                        >
                          From:
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>{settings.companyName || 'Your Company'}</p>
                          <p>{settings.companyEmail || 'hello@company.com'}</p>
                          <p>{settings.companyAddress || '123 Business St'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Table */}
                    <div className="mb-6">
                      <div 
                        className="rounded-lg p-3 mb-3"
                        style={{ backgroundColor: settings.branding.primaryColor + '10' }}
                      >
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                          <span>Description</span>
                          <span>Qty</span>
                          <span>Rate</span>
                          <span>Amount</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Sample Service</span>
                        <span>1</span>
                        <span>$100.00</span>
                        <span>$100.00</span>
                      </div>
                    </div>

                    {/* Preview Total */}
                    <div className="flex justify-end">
                      <div className="w-48">
                        <div className="flex justify-between py-2 text-sm">
                          <span>Subtotal:</span>
                          <span>$100.00</span>
                        </div>
                        <div className="flex justify-between py-2 text-sm">
                          <span>Tax ({settings.taxRate}%):</span>
                          <span>${(100 * settings.taxRate / 100).toFixed(2)}</span>
                        </div>
                        <div 
                          className="flex justify-between py-2 text-lg font-bold border-t"
                          style={{ 
                            borderColor: settings.branding.primaryColor + '30',
                            color: settings.branding.primaryColor
                          }}
                        >
                          <span>Total:</span>
                          <span>${(100 + (100 * settings.taxRate / 100)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                className="card p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Appearance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Customize the look and feel of your application
                  </p>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    options={themeOptions}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`
                        border-2 rounded-lg p-4 cursor-pointer transition-all
                        ${theme === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                      onClick={() => setTheme(option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-4 h-4 rounded-full border-2
                          ${theme === option.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                          }
                        `}>
                          {theme === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </div>
                      
                      {/* Theme Preview */}
                      <div className="mt-3 h-16 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {option.value === 'light' && (
                          <div className="h-full bg-white flex">
                            <div className="w-1/3 bg-gray-100"></div>
                            <div className="flex-1 bg-white p-2 space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        )}
                        {option.value === 'dark' && (
                          <div className="h-full bg-gray-900 flex">
                            <div className="w-1/3 bg-gray-800"></div>
                            <div className="flex-1 bg-gray-900 p-2 space-y-1">
                              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                              <div className="h-1 bg-gray-700 rounded w-1/2"></div>
                            </div>
                          </div>
                        )}
                        {option.value === 'system' && (
                          <div className="h-full flex">
                            <div className="w-1/2 bg-white flex">
                              <div className="w-1/2 bg-gray-100"></div>
                              <div className="flex-1 bg-white"></div>
                            </div>
                            <div className="w-1/2 bg-gray-900 flex">
                              <div className="w-1/2 bg-gray-800"></div>
                              <div className="flex-1 bg-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
))}
                </div>
              </motion.div>
            )}
            {/* Save Button */}
            <motion.div
              className="flex justify-end pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                type="submit"
                loading={saving}
                icon="Save"
                size="lg"
              >
                Save Settings
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings