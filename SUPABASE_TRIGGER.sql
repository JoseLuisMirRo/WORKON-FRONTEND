-- 🔧 TRIGGER AUTOMÁTICO PARA CREAR PERFILES
-- Este trigger se ejecuta automáticamente cuando un usuario se registra en Supabase Auth
-- y crea su perfil correspondiente en la tabla profiles

-- Paso 1: Crear la función que se ejecutará
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar perfil automáticamente cuando se crea un usuario en auth.users
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'freelancer', -- Por defecto, todos son freelancers (puedes cambiar esto)
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), -- Toma el nombre de los metadatos o usa el email
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Paso 2: Crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ✅ LISTO! Ahora cada vez que alguien se registre, automáticamente se creará su perfil.

-- 📝 NOTAS:
-- - El trigger crea el perfil con role 'freelancer' por defecto
-- - Si quieres que sea 'employer', debes actualizarlo después del registro
-- - El full_name se toma de los metadatos del usuario o usa el email como fallback
-- - Este trigger es SEGURO y usa SECURITY DEFINER para tener los permisos necesarios

-- 🧪 PROBAR:
-- Después de ejecutar este SQL, intenta registrar un nuevo usuario
-- y verifica que se cree automáticamente en la tabla profiles

