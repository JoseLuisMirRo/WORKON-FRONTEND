import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/Select'
import { Separator } from '../../../components/ui/Separator'
import { TrendingUp } from '../../../components/ui/Icons'

export const FeedFilters = ({ 
  filters, 
  onFilterChange, 
  trendingSkills,
  onSkillClick 
}) => {
  return (
    <div className="space-y-6 sticky top-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => onFilterChange('category', value)}
              defaultValue="todas"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                <SelectItem value="diseno">Diseño</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Presupuesto</label>
            <Select 
              value={filters.budget} 
              onValueChange={(value) => onFilterChange('budget', value)}
              defaultValue="todos"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="0-500">0 - 500 USDC</SelectItem>
                <SelectItem value="500-1000">500 - 1,000 USDC</SelectItem>
                <SelectItem value="1000-2000">1,000 - 2,000 USDC</SelectItem>
                <SelectItem value="2000+">2,000+ USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => onFilterChange('location', value)}
              defaultValue="todas"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Empresas Verificadas</h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-border"
                checked={filters.verifiedOnly}
                onChange={(e) => onFilterChange('verifiedOnly', e.target.checked)}
              />
              Solo empresas verificadas
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Trending Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Skills en Demanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingSkills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => onSkillClick && onSkillClick(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
