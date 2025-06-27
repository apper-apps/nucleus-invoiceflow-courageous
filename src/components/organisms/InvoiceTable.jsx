import { motion } from 'framer-motion'
import TableRow from '@/components/molecules/TableRow'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const InvoiceTable = ({ invoices, onAction, loading = false }) => {
  const columns = [
    {
      key: 'number',
      label: 'Invoice #',
      className: 'text-sm font-medium text-gray-900 dark:text-gray-100'
    },
    {
      key: 'clientName',
      label: 'Client',
      className: 'text-sm text-gray-600 dark:text-gray-400'
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
      className: 'text-sm text-gray-600 dark:text-gray-400'
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
      className: 'text-sm text-gray-600 dark:text-gray-400'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeVariant: (status) => {
        const variants = {
          draft: 'default',
          sent: 'info',
          paid: 'success',
          overdue: 'danger'
        }
        return variants[status] || 'default'
      },
      render: (value) => {
        const labels = {
          draft: 'Draft',
          sent: 'Sent',
          paid: 'Paid',
          overdue: 'Overdue'
        }
        const variant = {
          draft: 'default',
          sent: 'info',
          paid: 'success',
          overdue: 'danger'
        }[value]
        
        return <Badge variant={variant}>{labels[value] || value}</Badge>
      }
    },
    {
      key: 'total',
      label: 'Amount',
      type: 'currency',
      render: (value) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          ${value.toLocaleString()}
        </span>
      )
    }
  ]

const actions = [
    {
      key: 'view',
      label: 'View',
      icon: 'Eye',
      variant: 'ghost'
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'Edit',
      variant: 'ghost'
    },
    {
      key: 'pdf',
      label: 'Download PDF',
      icon: 'Download',
      variant: 'ghost'
    },
    {
      key: 'email',
      label: 'Email to Client',
      icon: 'Mail',
      variant: 'ghost'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700 dark:text-red-400'
    }
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.Id}
                data={invoice}
                columns={columns}
                actions={actions}
                onAction={onAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default InvoiceTable