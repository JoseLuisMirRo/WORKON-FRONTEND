import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/Select'
import { Card, CardContent } from '../../../components/ui/Card'
import { Search, Filter } from '../../../components/ui/Icons'

export const SearchBar = ({ onSearch, sortBy, onSortChange }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Buscar trabajos..." 
              className="pl-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select value={sortBy} onValueChange={onSortChange} defaultValue="recientes">
            <SelectTrigger>
              <SelectValue placeholder="Más recientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recientes">Más recientes</SelectItem>
              <SelectItem value="relevantes">Más relevantes</SelectItem>
              <SelectItem value="presupuesto">Mayor presupuesto</SelectItem>
              <SelectItem value="aplicantes">Menos aplicantes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
