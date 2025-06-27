import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import InvoiceTable from '@/components/organisms/InvoiceTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { invoiceService } from '@/services/api/invoiceService'
import { clientService } from '@/services/api/clientService'

const InvoiceList = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ])
      
      // Enhance invoices with client names
      const enhancedInvoices = invoicesData.map(invoice => ({
        ...invoice,
        clientName: clientsData.find(c => c.Id === invoice.clientId)?.name || 'Unknown Client'
      }))
      
      setInvoices(enhancedInvoices)
      setClients(clientsData)
      setFilteredInvoices(enhancedInvoices)
    } catch (err) {
      setError('Failed to load invoices')
      console.error('Invoice loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = invoices

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilter = (filters) => {
    setStatusFilter(filters.status || '')
  }

  const handleAction = async (action, invoice) => {
    switch (action) {
      case 'view':
        navigate(`/invoices/edit/${invoice.Id}`)
        break
      case 'edit':
        navigate(`/invoices/edit/${invoice.Id}`)
        break
      case 'delete':
        if (window.confirm('Are you sure you want to delete this invoice?')) {
          try {
            await invoiceService.delete(invoice.Id)
            setInvoices(prev => prev.filter(inv => inv.Id !== invoice.Id))
            toast.success('Invoice deleted successfully')
          } catch (err) {
            toast.error('Failed to delete invoice')
            console.error('Delete error:', err)
          }
        }
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const filters = [
    {
      key: 'status',
      placeholder: 'All Statuses',
      options: statusOptions
    }
  ]

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your invoices
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => navigate('/invoices/new')}
            icon="Plus"
            size="lg"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: invoices.length, color: 'bg-blue-500' },
          { label: 'Draft', count: invoices.filter(i => i.status === 'draft').length, color: 'bg-gray-500' },
          { label: 'Sent', count: invoices.filter(i => i.status === 'sent').length, color: 'bg-yellow-500' },
          { label: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'bg-green-500' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-soft"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <SearchBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filters}
        placeholder="Search invoices..."
      />

      {/* Invoice Table */}
      {filteredInvoices.length === 0 && !loading ? (
        <Empty
          type={searchTerm || statusFilter ? 'search' : 'invoices'}
          onAction={() => searchTerm || statusFilter ? setSearchTerm('') : navigate('/invoices/new')}
        />
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

export default InvoiceList