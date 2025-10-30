# 🎯 Instrucciones para Conectar con Supabase

## ✅ Lo que ya está hecho

He configurado tu proyecto para trabajar con Supabase:

1. ✅ Cliente de Supabase instalado (`@supabase/supabase-js`)
2. ✅ Archivo de configuración creado (`src/lib/supabaseClient.js`)
3. ✅ Servicio de autenticación actualizado para usar Supabase
4. ✅ Archivo `.gitignore` actualizado para proteger tus credenciales
5. ✅ Documentación completa con ejemplos para todos los servicios

## 🔧 Lo que NECESITAS hacer (3 pasos)

### Paso 1: Crear tu proyecto en Supabase

1. Ve a **https://app.supabase.com**
2. Crea una cuenta (o inicia sesión)
3. Haz clic en **"New Project"**
4. Completa:
   - **Name**: WorkOn (o el nombre que prefieras)
   - **Database Password**: (crea una contraseña segura y guárdala)
   - **Region**: Elige la más cercana a ti
5. Haz clic en **"Create new project"**
6. Espera 2-3 minutos mientras se inicializa

### Paso 2: Obtener tus credenciales

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Verás dos valores importantes:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **anon public**: una clave larga que empieza con `eyJ...`

### Paso 3: Configurar las variables de entorno

1. Crea un archivo llamado **`.env`** en la RAÍZ de tu proyecto (al mismo nivel que `package.json`)
2. Agrega este contenido (reemplazando con tus valores reales):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu-clave-aqui
```

3. Guarda el archivo
4. **IMPORTANTE**: Reinicia tu servidor de desarrollo:

```bash
# Detén el servidor (Ctrl + C)
# Luego reinicia:
npm run dev
```

### Paso 4: Crear las tablas en Supabase

1. En tu proyecto de Supabase, ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**
3. Copia y pega TODO el SQL que está en **SUPABASE_QUICKSTART.md** (sección "Paso 2: Crear las Tablas")
4. Haz clic en **RUN** (▶️)
5. Deberías ver el mensaje: "Success. No rows returned"

## 🎉 ¡Ya está listo!

Ahora tu aplicación está conectada a Supabase. Puedes probarla:

1. Abre tu app: http://localhost:5173
2. Ve a la página de registro
3. Crea una cuenta nueva con email y contraseña
4. Si todo funciona, serás redirigido al dashboard

Para verificar que funcionó:
- Ve a tu proyecto de Supabase
- Haz clic en **Authentication** → verás el usuario creado
- Haz clic en **Table Editor** → **profiles** → verás el perfil del usuario

## 📁 Archivos Creados/Modificados

### Archivos nuevos:
- `src/lib/supabaseClient.js` - Cliente configurado de Supabase
- `SUPABASE_INTEGRATION.md` - Documentación completa con ejemplos
- `SUPABASE_QUICKSTART.md` - Guía rápida de inicio
- `INSTRUCCIONES_SUPABASE.md` - Este archivo

### Archivos modificados:
- `src/features/auth/services/authService.js` - Ahora usa Supabase Auth
- `.gitignore` - Protege el archivo `.env`

## 🔄 Migrar los otros servicios

El servicio de autenticación ya está funcionando con Supabase. Para migrar los demás:

### Feed de trabajos
Abre: `src/features/feed/services/feedService.js`
Usa los ejemplos de: `SUPABASE_INTEGRATION.md` sección "Feed de Trabajos"

### Dashboard del empleador
Abre: `src/features/employer/services/employerService.js`
Usa los ejemplos de: `SUPABASE_INTEGRATION.md` sección "Empleador (Dashboard)"

### Mensajes
Abre: `src/features/messages/services/messagesService.js`
Usa los ejemplos de: `SUPABASE_INTEGRATION.md` sección "Mensajes"

### Perfil
Abre: `src/features/profile/services/profileService.js`
Usa los ejemplos de: `SUPABASE_INTEGRATION.md` sección "Perfil"

## 🆘 Problemas Comunes

### "supabaseUrl and supabaseAnonKey are required"
➡️ No has creado el archivo `.env` o las variables no están bien escritas

### "Invalid API Key"
➡️ Copiaste mal la clave. Vuelve a copiarla desde Supabase (Settings → API)

### El servidor no lee las variables de entorno
➡️ Reinicia el servidor: detén con `Ctrl+C` y ejecuta `npm run dev` de nuevo

### Los usuarios no se crean
➡️ Verifica que ejecutaste el SQL completo en Supabase SQL Editor

## 📞 Necesitas ayuda?

1. **Documentación completa**: `SUPABASE_INTEGRATION.md`
2. **Docs oficiales**: https://supabase.com/docs
3. **Dashboard de Supabase**: https://app.supabase.com

---

**¡Éxito con tu proyecto! 🚀**

