import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry, type = 'default' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Connection Error',
          description: message || 'Unable to connect to the server. Please check your internet connection.',
        }
      case 'notfound':
        return {
          icon: 'Search',
          title: 'Not Found',
          description: message || 'The item you\'re looking for could not be found.',
        }
      case 'permission':
        return {
          icon: 'Shield',
          title: 'Access Denied',
          description: message || 'You don\'t have permission to access this resource.',
        }
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Something went wrong',
          description: message || 'An unexpected error occurred. Please try again.',
        }
    }
  }

  const { icon, title, description } = getErrorContent()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ApperIcon name={icon} className="w-8 h-8 text-red-600 dark:text-red-400" />
      </motion.div>
      
      <motion.h3
        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {description}
      </motion.p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error