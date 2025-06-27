import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Badge from '@/components/atoms/Badge'
import { invoiceService } from '@/services/api/invoiceService'
import { clientService } from '@/services/api/clientService'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const Dashboard = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ])
      
      setInvoices(invoicesData)
      setClients(clientsData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const calculateStats = () => {
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)
    
    const pendingAmount = invoices
      .filter(inv => inv.status === 'sent')
      .reduce((sum, inv) => sum + inv.total, 0)
    
    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0)
    
    const draftCount = invoices.filter(inv => inv.status === 'draft').length

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      draftCount,
      totalInvoices: invoices.length,
      totalClients: clients.length
    }
  }

  const getRecentInvoices = () => {
    return invoices
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(invoice => ({
        ...invoice,
        clientName: clients.find(c => c.Id === invoice.clientId)?.name || 'Unknown Client'
      }))
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const stats = calculateStats()
  const recentInvoices = getRecentInvoices()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your invoices.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Pending Payments"
          value={`$${stats.pendingAmount.toLocaleString()}`}
          icon="Clock"
          color="warning"
          trend="up"
          trendValue={`${invoices.filter(i => i.status === 'sent').length} invoices`}
        />
        <StatCard
          title="Overdue Amount"
          value={`$${stats.overdueAmount.toLocaleString()}`}
          icon="AlertTriangle"
          color="danger"
          trend="down"
          trendValue={`${invoices.filter(i => i.status === 'overdue').length} invoices`}
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon="Users"
          color="info"
          trend="up"
          trendValue="+3 this month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <Button variant="ghost" size="sm" icon="MoreHorizontal" />
          </div>
          
          <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="TrendingUp" className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Chart visualization would go here
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Invoices */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Invoices
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/invoices')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No invoices yet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/invoices/new')}
                  className="mt-2"
                >
                  Create your first invoice
                </Button>
              </div>
            ) : (
              recentInvoices.map((invoice) => (
                <motion.div
                  key={invoice.Id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(`/invoices/edit/${invoice.Id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {invoice.number}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {invoice.clientName} • {format(new Date(invoice.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        invoice.status === 'paid' ? 'success' :
                        invoice.status === 'sent' ? 'info' :
                        invoice.status === 'overdue' ? 'danger' : 'default'
                      }
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${invoice.total.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="ghost"
            className="justify-start p-4 h-auto"
            onClick={() => navigate('/invoices/new')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">New Invoice</p>
                <p className="text-xs text-gray-500">Create invoice</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start p-4 h-auto"
            onClick={() => navigate('/clients')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserPlus" className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Add Client</p>
                <p className="text-xs text-gray-500">Manage clients</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start p-4 h-auto"
            onClick={() => navigate('/invoices')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Pending</p>
                <p className="text-xs text-gray-500">View pending</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start p-4 h-auto"
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Settings</p>
                <p className="text-xs text-gray-500">Configure app</p>
              </div>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard