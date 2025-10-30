import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { SlidersHorizontal } from '../../../components/ui/Icons'

/**
 * Filter component for the feed
 * @param {Object} filters - Current filter state from useFeedController
 * @param {Function} updateFilter - Function to update a single filter
 * @param {Function} resetFilters - Function to reset all filters
 */
export function FeedFilters({ filters, updateFilter, resetFilters }) {
  const categories = [
    'todas',
    'Desarrollo',
    'Diseño',
    'Marketing',
    'Blockchain',
    'Data Science',
    'Contenido'
  ]
  
  const budgetRanges = [
    { label: 'Todos los presupuestos', value: 'todos' },
    { label: 'Bajo (< $500)', value: 'bajo' },
    { label: 'Medio ($500 - $1,500)', value: 'medio' },
    { label: 'Alto (> $1,500)', value: 'alto' }
  ]

  const sortOptions = [
    { label: 'Más recientes', value: 'recientes' },
    { label: 'Mayor presupuesto', value: 'presupuesto' },
    { label: 'Menos aplicantes', value: 'aplicantes' }
  ]

  const locations = [
    'todas',
    'Remoto',
    'Híbrido',
    'Presencial'
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-accent" size={20} />
          Filtros
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="text-xs hover:text-accent"
        >
          Limpiar
        </Button>
      </div>

      {/* Categorías */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={filters.category === category ? 'default' : 'outline'}
              className="cursor-pointer hover:scale-105 transition-transform capitalize"
              onClick={() => updateFilter('category', category)}
            >
              {category === 'todas' ? 'Todas' : category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
        <div className="flex flex-wrap gap-2">
          {locations.map(location => (
            <Badge
              key={location}
              variant={filters.location === location ? 'default' : 'outline'}
              className="cursor-pointer hover:scale-105 transition-transform capitalize"
              onClick={() => updateFilter('location', location)}
            >
              {location === 'todas' ? 'Todas' : location}
            </Badge>
          ))}
        </div>
      </div>

      {/* Presupuesto */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Presupuesto</label>
        <div className="space-y-2">
          {budgetRanges.map(range => (
            <label
              key={range.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card/50 cursor-pointer transition-all group"
            >
              <input
                type="radio"
                name="budget"
                value={range.value}
                checked={filters.budget === range.value}
                onChange={(e) => updateFilter('budget', e.target.value)}
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm group-hover:text-accent transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar por */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Ordenar por</label>
        <div className="space-y-2">
          {sortOptions.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card/50 cursor-pointer transition-all group"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm group-hover:text-accent transition-colors">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Solo verificados */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card/50 cursor-pointer transition-all group">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary rounded"
          />
          <div className="flex items-center gap-2">
            {/* <CheckCircle className="h-4 w-4 text-primary" size={16} /> */}
            <span className="text-sm group-hover:text-accent transition-colors">
              Solo empleadores verificados
            </span>
          </div>
        </label>
      </div>

      {/* Active Filters Summary */}
      {(filters.category !== 'todas' || 
        filters.location !== 'todas' || 
        filters.budget !== 'todos' || 
        filters.verifiedOnly) && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-1">
            {filters.category !== 'todas' && (
              <Badge variant="secondary" className="text-xs capitalize">
                {filters.category}
              </Badge>
            )}
            {filters.location !== 'todas' && (
              <Badge variant="secondary" className="text-xs">
                {filters.location}
              </Badge>
            )}
            {filters.budget !== 'todos' && (
              <Badge variant="secondary" className="text-xs capitalize">
                {filters.budget}
              </Badge>
            )}
            {filters.verifiedOnly && (
              <Badge variant="secondary" className="text-xs">
                Verificados
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
