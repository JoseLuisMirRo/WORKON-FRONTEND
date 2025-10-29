# Módulo de Perfil - WorkOn

Este módulo maneja la funcionalidad de perfiles para Freelancers y Empleadores en la plataforma WorkOn.

## Componentes Principales

### FreelancerProfilePage
Página completa del perfil del freelancer que incluye:

#### 1. **Header del Perfil**
- Avatar con badge de verificación
- Información personal (nombre, título, ubicación)
- Rating global con estrellas y número de reseñas
- Estadísticas clave (trabajos completados, tasa de éxito)
- Tarifa por hora
- Enlaces a redes sociales
- Badge de disponibilidad

#### 2. **Intereses y Preferencias de Trabajo**
Sección dedicada para mostrar las preferencias del freelancer:
- **Áreas de Especialización**: Categorías de trabajo preferidas (Desarrollo Web, Blockchain, etc.)
- **Tipos de Proyecto**: Modalidades preferidas (Proyecto Completo, Consultoría, etc.)
- **Modalidad de Trabajo**: Remoto, Tiempo Completo, Tiempo Parcial
- **Industrias de Interés**: Sectores preferidos (Fintech, Tecnología, Startups)
- **Rango de Presupuesto**: Presupuesto de proyectos preferido
- **Disponibilidad**: Horas disponibles por semana
- **Tamaño de Proyecto**: Pequeño, Mediano, Grande o Empresarial
- **Compromiso Preferido**: Corto, Mediano o Largo plazo

#### 3. **Experiencia Profesional**
Sección con timeline visual que muestra:
- Título del puesto y empresa
- Fechas de inicio y fin (con duración calculada)
- Ubicación (presencial o remoto)
- Descripción detallada de responsabilidades
- Tecnologías y habilidades utilizadas
- Indicador visual para trabajos actuales

#### 4. **Sistema de Calificaciones y Reseñas**
Sistema completo de ratings de empleadores:
- **Rating Global**: Promedio general con estrellas y número total de reseñas
- **Evaluación por Categorías**:
  - Comunicación
  - Calidad del Trabajo
  - Expertise Técnico
  - Profesionalismo
  - Cumplimiento de Plazos
- **Reseñas Detalladas**: 
  - Información del empleador (nombre, empresa, avatar)
  - Calificación con estrellas
  - Nombre del proyecto
  - Fecha de la reseña
  - Comentario detallado
  - Ratings específicos por habilidad
  - Badge de "Reseña Verificada"
  - Sistema de "útil" para votar reseñas
- **Estadísticas de Desempeño**:
  - Tasa de éxito
  - Proyectos completados

#### 5. **Columna Lateral**
- **Estadísticas**: Resumen de métricas clave
- **Habilidades**: Lista con barras de progreso visuales
- **Idiomas**: Idiomas hablados con nivel de competencia
- **Educación**: Títulos académicos con institución y fechas
- **Certificaciones**: Certificados profesionales
- **Portfolio**: Proyectos destacados con imágenes y descripción

## Componentes Auxiliares

### ExperienceSection
Componente para mostrar y gestionar experiencia profesional:
- Timeline visual con indicadores
- Formateo automático de fechas
- Cálculo de duración de experiencia
- Modal para agregar/editar experiencia

### InterestsSection
Componente para mostrar intereses y preferencias:
- Categorías visuales con iconos
- Badges de colores para diferentes tipos
- Detalles de compromiso en grid
- CTA para actualizar preferencias

### RatingsSection
Componente completo de calificaciones:
- Rating global prominente
- Barras de progreso por categoría
- Lista de reseñas con paginación
- Sistema de votación "útil"
- Badges de verificación

### EditProfileModal
Modal genérico para editar diferentes secciones del perfil:
- Formulario dinámico según sección
- Validación de campos
- Guardado con feedback visual

### AddExperienceModal
Modal específico para agregar/editar experiencia:
- Formulario completo con validación
- Selector de fechas
- Checkbox para "trabajo actual"
- Sistema de tags para habilidades
- Textarea para descripción

## Estructura de Datos

### Profile Object
```javascript
{
  id: string,
  type: 'freelancer',
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  avatar: string,
  title: string,
  bio: string,
  location: string,
  hourlyRate: number,
  verified: boolean,
  available: boolean,
  
  // Intereses y Preferencias
  workInterests: {
    categories: string[],
    projectTypes: string[],
    workArrangement: string[],
    preferredIndustries: string[],
    projectSize: string,
    budgetRange: string,
    availability: string,
    commitment: string
  },
  
  // Habilidades e Idiomas
  skills: [{ name: string, level: number }],
  languages: [{ name: string, level: string }],
  
  // Experiencia
  experience: [{
    id: number,
    title: string,
    company: string,
    location: string,
    startDate: string, // YYYY-MM
    endDate: string, // YYYY-MM o 'Presente'
    description: string,
    skills: string[]
  }],
  
  // Educación y Certificaciones
  education: [{ ... }],
  certifications: [{ ... }],
  portfolio: [{ ... }],
  
  // Enlaces Sociales
  socialLinks: {
    github: string,
    linkedin: string,
    twitter: string,
    website: string
  },
  
  // Estadísticas
  stats: {
    rating: number,
    reviews: number,
    jobsCompleted: number,
    successRate: number,
    responseTime: string,
    memberSince: string
  }
}
```

## Uso

```jsx
import { FreelancerProfilePage } from '@/features/profile'

// En tu router o App.jsx
<Route path="/perfil" element={<FreelancerProfilePage />} />
```

## Características Destacadas

✅ Diseño moderno con glassmorphism y gradientes  
✅ Sistema completo de calificaciones por categorías  
✅ Timeline visual para experiencia profesional  
✅ Intereses y preferencias de trabajo detallados  
✅ Modales de edición intuitivos  
✅ Badges y tags coloridos para información visual  
✅ Responsive design para mobile y desktop  
✅ Animaciones suaves y transiciones  
✅ Sistema de reseñas verificadas  
✅ Portfolio con imágenes  

## Próximas Mejoras

- [ ] Integración con backend real
- [ ] Subida de imágenes para avatar y portfolio
- [ ] Sistema de notificaciones para nuevas reseñas
- [ ] Exportar perfil como PDF
- [ ] Comparador de perfiles
- [ ] Integración con blockchain para verificación

