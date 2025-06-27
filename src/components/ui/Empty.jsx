import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = 'FileText', 
  title, 
  description, 
  action, 
  onAction, 
  type = 'default' 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'invoices':
        return {
          icon: 'FileText',
          title: 'No invoices yet',
          description: 'Create your first invoice to start managing your billing and get paid faster.',
          action: 'Create Invoice',
        }
      case 'clients':
        return {
          icon: 'Users',
          title: 'No clients found',
          description: 'Add your first client to start creating invoices and managing your business relationships.',
          action: 'Add Client',
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          action: 'Clear Filters',
        }
      case 'draft':
        return {
          icon: 'Edit3',
          title: 'No draft invoices',
          description: 'All your invoices have been sent. Create a new invoice to get started.',
          action: 'Create Invoice',
        }
      default:
        return {
          icon: icon,
          title: title || 'No data available',
          description: description || 'There\'s nothing to show here yet.',
          action: action || 'Get Started',
        }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center">
          <ApperIcon name={content.icon} className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {content.title}
      </motion.h3>
      
      <motion.p
        className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {content.description}
      </motion.p>
      
      {(onAction || content.action) && (
        <motion.button
          onClick={onAction}
          className="btn-primary px-6 py-3 text-base font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {content.action}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty