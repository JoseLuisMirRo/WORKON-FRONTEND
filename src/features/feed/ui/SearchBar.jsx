import { Search } from '../../../components/ui/Icons'

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative group">
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" 
        size={20} 
      />
      <input
        type="text"
        placeholder="Buscar proyectos, habilidades, categorías..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      />
    </div>
  )
}
