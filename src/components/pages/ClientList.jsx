import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import ClientTable from '@/components/organisms/ClientTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { clientService } from '@/services/api/clientService'
import { invoiceService } from '@/services/api/invoiceService'
import ApperIcon from '@/components/ApperIcon'

const ClientList = () => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [saving, setSaving] = useState(false)

  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [clientsData, invoicesData] = await Promise.all([
        clientService.getAll(),
        invoiceService.getAll()
      ])
      
      // Add invoice count to each client
      const enhancedClients = clientsData.map(client => ({
        ...client,
        invoiceCount: invoicesData.filter(inv => inv.clientId === client.Id).length
      }))
      
      setClients(enhancedClients)
      setFilteredClients(enhancedClients)
    } catch (err) {
      setError('Failed to load clients')
      console.error('Client loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [clients, searchTerm])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const resetForm = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    })
    setEditingClient(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!clientForm.name || !clientForm.email) {
      toast.error('Name and email are required')
      return
    }

    try {
      setSaving(true)
      
      if (editingClient) {
        await clientService.update(editingClient.Id, clientForm)
        toast.success('Client updated successfully')
      } else {
        await clientService.create(clientForm)
        toast.success('Client created successfully')
      }
      
      resetForm()
      loadData()
    } catch (err) {
      toast.error(editingClient ? 'Failed to update client' : 'Failed to create client')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAction = async (action, client) => {
    switch (action) {
      case 'edit':
        setClientForm({
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          company: client.company || '',
          address: client.address || ''
        })
        setEditingClient(client)
        setShowAddForm(true)
        break
      case 'delete':
        if (client.invoiceCount > 0) {
          toast.error('Cannot delete client with existing invoices')
          return
        }
        if (window.confirm('Are you sure you want to delete this client?')) {
          try {
            await clientService.delete(client.Id)
            setClients(prev => prev.filter(c => c.Id !== client.Id))
            toast.success('Client deleted successfully')
          } catch (err) {
            toast.error('Failed to delete client')
            console.error('Delete error:', err)
          }
        }
        break
      default:
        console.log('Unknown action:', action)
    }
  }

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
            Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your client relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowAddForm(true)}
            icon="Plus"
            size="lg"
          >
            Add Client
          </Button>
        </div>
      </div>

      {/* Add/Edit Client Form */}
      {showAddForm && (
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              icon="X"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={clientForm.name}
                onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Phone"
                value={clientForm.phone}
                onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                label="Company"
                value={clientForm.company}
                onChange={(e) => setClientForm(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            
            <Input
              label="Address"
              value={clientForm.address}
              onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving}
                icon="Save"
              >
                {editingClient ? 'Update Client' : 'Add Client'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search clients..."
        showFilters={false}
      />

      {/* Client Table */}
      {filteredClients.length === 0 && !loading ? (
        <Empty
          type={searchTerm ? 'search' : 'clients'}
          onAction={() => searchTerm ? setSearchTerm('') : setShowAddForm(true)}
        />
      ) : (
        <ClientTable
          clients={filteredClients}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

export default ClientList