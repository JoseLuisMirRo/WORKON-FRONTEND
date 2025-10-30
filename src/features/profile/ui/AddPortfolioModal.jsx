import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { X, Save, Upload, Trash2 } from '../../../components/ui/Icons'

export const AddPortfolioModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Por favor ingresa un título')
      return
    }

    try {
      setSaving(true)
      setUploadProgress('Creando proyecto...')
      
      await onSave({
        title: formData.title,
        description: formData.description,
        files: selectedFiles
      })
      
      onClose()
    } catch (error) {
      console.error('Error saving portfolio entry:', error)
      alert('Error al guardar el proyecto. Por favor intenta de nuevo.')
    } finally {
      setSaving(false)
      setUploadProgress(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background">
          <h2 className="text-2xl font-bold">Agregar Proyecto</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={saving}
            className="rounded-full"
          >
            <X className="h-5 w-5" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Título del Proyecto *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: DeFi Dashboard"
              disabled={saving}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
              placeholder="Describe tu proyecto, tecnologías utilizadas, resultados obtenidos..."
              disabled={saving}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Archivos (imágenes, PDFs, etc.)</label>
            
            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={saving}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/30 transition-colors">
                  <Upload className="h-4 w-4" size={16} />
                  <span className="text-sm font-medium">Seleccionar archivos</span>
                </div>
              </label>
              <span className="text-xs text-muted-foreground">
                {selectedFiles.length} archivo{selectedFiles.length !== 1 ? 's' : ''} seleccionado{selectedFiles.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* File List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.type.startsWith('image/') ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Upload className="h-5 w-5 text-primary" size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={saving}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-sm text-primary font-medium">{uploadProgress}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-border bg-background">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" size={16} />
            {saving ? 'Guardando...' : 'Guardar Proyecto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
