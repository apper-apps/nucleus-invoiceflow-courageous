import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { invoiceService } from '@/services/api/invoiceService'
import { clientService } from '@/services/api/clientService'
import { settingsService } from '@/services/api/settingsService'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const InvoiceForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [invoice, setInvoice] = useState({
    number: '',
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'draft',
    notes: ''
  })

  const [clients, setClients] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [clientsData, settingsData] = await Promise.all([
        clientService.getAll(),
        settingsService.get()
      ])
      
      setClients(clientsData)
      setSettings(settingsData)

      if (isEditing) {
        const invoiceData = await invoiceService.getById(parseInt(id))
        setInvoice(invoiceData)
      } else {
        // Generate invoice number for new invoice
        const invoices = await invoiceService.getAll()
        const nextNumber = invoices.length + 1
        setInvoice(prev => ({
          ...prev,
          number: `${settingsData.invoicePrefix}${nextNumber.toString().padStart(4, '0')}`
        }))
      }
    } catch (err) {
      setError('Failed to load invoice data')
      console.error('Invoice form loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, isEditing])

  const calculateTotals = (items, taxRate = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax
    
    return { subtotal, tax, total }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Calculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }
    
    const totals = calculateTotals(newItems, settings?.taxRate || 0)
    
    setInvoice(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }))
  }

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (invoice.items.length === 1) return
    
    const newItems = invoice.items.filter((_, i) => i !== index)
    const totals = calculateTotals(newItems, settings?.taxRate || 0)
    
    setInvoice(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!invoice.clientId) {
      toast.error('Please select a client')
      return
    }
    
    if (invoice.items.some(item => !item.description)) {
      toast.error('Please fill in all item descriptions')
      return
    }

    try {
      setSaving(true)
      
      if (isEditing) {
        await invoiceService.update(parseInt(id), invoice)
        toast.success('Invoice updated successfully')
      } else {
        await invoiceService.create(invoice)
        toast.success('Invoice created successfully')
      }
      
      navigate('/invoices')
    } catch (err) {
      toast.error(isEditing ? 'Failed to update invoice' : 'Failed to create invoice')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!isEditing) return
    
    try {
      const updatedInvoice = { ...invoice, status: newStatus }
      await invoiceService.update(parseInt(id), updatedInvoice)
      setInvoice(updatedInvoice)
      toast.success(`Invoice marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update invoice status')
      console.error('Status update error:', err)
    }
  }

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const clientOptions = clients.map(client => ({
    value: client.Id.toString(),
    label: `${client.name} - ${client.company || client.email}`
  }))

  const selectedClient = clients.find(c => c.Id.toString() === invoice.clientId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditing ? `Invoice ${invoice.number}` : 'Create a new invoice for your client'}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
          >
            Cancel
          </Button>
          {isEditing && (
            <div className="flex space-x-2">
              {invoice.status === 'draft' && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange('sent')}
                  icon="Send"
                >
                  Send
                </Button>
              )}
              {invoice.status === 'sent' && (
                <Button
                  variant="success"
                  onClick={() => handleStatusChange('paid')}
                  icon="Check"
                >
                  Mark Paid
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details Card */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Invoice Number"
              value={invoice.number}
              onChange={(e) => setInvoice(prev => ({ ...prev, number: e.target.value }))}
              required
            />
            
            <Select
              label="Client"
              value={invoice.clientId}
              onChange={(e) => setInvoice(prev => ({ ...prev, clientId: e.target.value }))}
              options={clientOptions}
              placeholder="Select a client"
              required
            />
            
            <Input
              label="Invoice Date"
              type="date"
              value={invoice.date}
              onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            
            <Input
              label="Due Date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
        </motion.div>

        {/* Client Information */}
        {selectedClient && (
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bill To
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedClient.name}
              </p>
              {selectedClient.company && (
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedClient.company}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">
                {selectedClient.email}
              </p>
              {selectedClient.phone && (
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedClient.phone}
                </p>
              )}
              {selectedClient.address && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {selectedClient.address}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Line Items */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Line Items
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={addItem}
              icon="Plus"
              size="sm"
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {/* Headers */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            {invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5">
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <div className="pt-2 text-sm font-medium text-gray-900 dark:text-white">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1">
                  {invoice.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      icon="Trash2"
                      className="text-red-600 hover:text-red-700 p-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${invoice.subtotal.toLocaleString()}
                  </span>
                </div>
                {settings?.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax ({settings.taxRate}%):
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${invoice.tax.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">
                    ${invoice.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notes
          </h3>
          <textarea
            className="input min-h-[100px] resize-y"
            placeholder="Additional notes or payment terms..."
            value={invoice.notes}
            onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            type="submit"
            loading={saving}
            size="lg"
            icon="Save"
          >
            {isEditing ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}

export default InvoiceForm