import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useTheme } from '@/hooks/useTheme'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ isCollapsed, onToggleSidebar }) => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.header
      className={`fixed top-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'left-16' : 'left-64'
      }`}
      initial={false}
      animate={{ left: isCollapsed ? 64 : 256 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="hidden md:block max-w-md">
            <Input
              type="text"
              placeholder="Search invoices, clients..."
              icon="Search"
              className="bg-gray-50 dark:bg-gray-700 border-0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'dark' ? 'Sun' : 'Moon'}
            onClick={toggleTheme}
            className="p-2"
          />
          
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="p-2 relative"
          >
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-medium transition-shadow">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header