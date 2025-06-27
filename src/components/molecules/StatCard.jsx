import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  className = '' 
}) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400',
    success: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
  }

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <motion.div
      className={`card p-6 ${className}`}
      whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center text-sm font-medium ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                className="w-4 h-4 mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard