import { useState } from 'react'
import { Search, X } from '../../../components/ui/Icons'
import { Button } from '../../../components/ui/Button'

/**
 * Search bar component for filtering proposals
 * @param {string} value - Current search value from filters
 * @param {Function} onSearch - Function to trigger search
 */
export function SearchBar({ value, onSearch }) {
  const [searchInput, setSearchInput] = useState(value || '')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  const handleClear = () => {
    setSearchInput('')
    onSearch('')
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchInput(newValue)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative group">
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors pointer-events-none" 
        size={20} 
      />
      <input
        type="text"
        placeholder="Buscar proyectos, habilidades, categorías..."
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full h-12 pl-12 pr-24 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchInput && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-8 w-8 hover:bg-muted rounded-lg"
          >
            <X className="h-4 w-4" size={16} />
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="h-8 px-3 rounded-lg"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
