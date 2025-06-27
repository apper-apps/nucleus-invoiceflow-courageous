import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const TableRow = ({ 
  data, 
  columns, 
  actions = [],
  onAction,
  className = '' 
}) => {
  const handleAction = (action, item) => {
    onAction?.(action, item)
  }

  const renderCellContent = (column, value, item) => {
    if (column.render) {
      return column.render(value, item)
    }

    if (column.type === 'badge') {
      const variant = column.badgeVariant?.(value) || 'default'
      return <Badge variant={variant}>{value}</Badge>
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString()
    }

    return value
  }

  return (
    <motion.tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {columns.map((column) => (
        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
          <div className={column.className || ''}>
            {renderCellContent(column, data[column.key], data)}
          </div>
        </td>
      ))}
      
      {actions.length > 0 && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            {actions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant || 'ghost'}
                size="sm"
                icon={action.icon}
                onClick={() => handleAction(action.key, data)}
                className={action.className}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </td>
      )}
    </motion.tr>
  )
}

export default TableRow