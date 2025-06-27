import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  filters = [], 
  placeholder = "Search...",
  showFilters = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({})

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value }
    if (!value) {
      delete newFilters[filterKey]
    }
    setActiveFilters(newFilters)
    onFilter?.(newFilters)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setActiveFilters({})
    onSearch?.('')
    onFilter?.({})
  }

  const hasActiveFilters = searchTerm || Object.keys(activeFilters).length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            icon="Search"
          />
        </div>
        
        {showFilters && filters.map((filter) => (
          <div key={filter.key} className="min-w-0 sm:w-48">
            <Select
              placeholder={filter.placeholder}
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              options={filter.options}
            />
          </div>
        ))}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            icon="X"
            className="whitespace-nowrap"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default SearchBar