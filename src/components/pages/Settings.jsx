import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { settingsService } from '@/services/api/settingsService'
import { useTheme } from '@/hooks/useTheme'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    invoicePrefix: 'INV-',
    taxRate: 0,
    currency: 'USD'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('company')

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

  const tabs = [
    { id: 'company', label: 'Company', icon: 'Building' },
    { id: 'invoice', label: 'Invoice', icon: 'FileText' },
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