import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Invoices', href: '/invoices', icon: 'FileText' },
    { name: 'Clients', href: '/clients', icon: 'Users' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ]

  return (
    <motion.div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          className="flex items-center space-x-3"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Receipt" className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              InvoiceFlow
            </span>
          )}
        </motion.div>
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ApperIcon 
            name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
            className="w-4 h-4 text-gray-600 dark:text-gray-400" 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/invoices' && location.pathname.startsWith('/invoices'))
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: linkActive }) => `
                sidebar-item relative group
                ${(isActive || linkActive) ? 'active' : 'text-gray-700 dark:text-gray-300'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
              
              {!isCollapsed && (
                <motion.span
                  className="ml-3 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
              
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Demo User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Free Plan
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar