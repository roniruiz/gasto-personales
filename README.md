# Seguimiento de Gastos Personales - Extensión de Chrome

Esta es una aplicación para el seguimiento de gastos personales que puede instalarse como una extensión de Google Chrome. Permite a los usuarios registrarse, iniciar sesión y llevar un control detallado de sus gastos.

## Características

- Registro e inicio de sesión de usuarios
- Dashboard con gráficos y estadísticas
- Añadir nuevos gastos con categorías
- Historial de gastos con filtros
- Exportación de datos a CSV
- Perfil de usuario editable

## Tecnologías utilizadas

- React
- TypeScript
- Supabase (Autenticación y Base de datos)
- Tailwind CSS
- Chart.js
- Vite

## Instalación como extensión de Chrome

1. Ejecuta `npm run build` para generar la carpeta `dist`
2. Abre Chrome y navega a `chrome://extensions/`
3. Activa el "Modo desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta `dist`
5. La extensión debería aparecer en tu barra de herramientas de Chrome

## Configuración de Supabase

Para que la aplicación funcione correctamente, debes crear un proyecto en Supabase y actualizar el archivo `.env` con tus propias credenciales:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

## Desarrollo

1. Clona este repositorio
2. Instala las dependencias con `npm install`
3. Inicia el servidor de desarrollo con `npm run dev`