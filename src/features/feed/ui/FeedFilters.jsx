import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { SlidersHorizontal } from '../../../components/ui/Icons'

export function FeedFilters({ filters, onChange }) {
  const categories = ['Todos', 'Desarrollo', 'Diseño', 'Marketing', 'Contenido']
  const budgetRanges = [
    { label: 'Todos', value: 'all' },
    { label: '< $500', value: '0-500' },
    { label: '$500 - $2000', value: '500-2000' },
    { label: '> $2000', value: '2000+' }
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
          onClick={() => onChange({ category: 'Todos', budget: 'all', urgency: 'all' })}
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
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onChange({ ...filters, category })}
            >
              {category}
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
                onChange={(e) => onChange({ ...filters, budget: e.target.value })}
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm group-hover:text-accent transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Urgencia */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Urgencia</label>
        <div className="flex flex-wrap gap-2">
          {['all', 'alta', 'media', 'baja'].map(urgency => (
            <Badge
              key={urgency}
              variant={filters.urgency === urgency ? 'default' : 'outline'}
              className="cursor-pointer hover:scale-105 transition-transform capitalize"
              onClick={() => onChange({ ...filters, urgency })}
            >
              {urgency === 'all' ? 'Todas' : urgency}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
