# BookReviews - Frontend

### Descripción
Este proyecto es una **Single Page Application (SPA)** de reseñas de libros, construida con **Nuxt 3**. Permite a los usuarios buscar libros, ver sus detalles, y guardar reseñas y calificaciones en una sección privada llamada "Mi Biblioteca". El proyecto está diseñado con un enfoque en la correcta gestión del estado utilizando Pinia y una capa de autenticación para proteger las rutas.

---

### Características Clave

- **Buscador de Libros**: Permite buscar libros por título utilizando la API pública.
- **Gestión de Reseñas**: Los usuarios pueden añadir una reseña y una calificación (de 1 a 5) a los libros.
- **Mi Biblioteca**: Un área privada donde los usuarios autenticados pueden ver, editar y eliminar los libros que han guardado.
- **Autenticación y Autorización**: Implementa un sistema de autenticación básica con una pantalla de login y un botón de logout. Las rutas críticas (`/my-library` y sus subrutas) están protegidas.
- **Gestión de Estado Centralizada**: Utiliza **Pinia** para manejar de forma eficiente el estado global de la aplicación, incluyendo los resultados de búsqueda, la biblioteca del usuario y el estado de la autenticación.
- **Diseño Responsivo**: La interfaz está diseñada para ser funcional tanto en dispositivos de escritorio como móviles.

---

### Tecnologías Utilizadas

- **Node 20**
- **Nuxt 3**: Framework de Vue 3, optimizado para la creación de aplicaciones de lado del cliente (SPA).
- **Vue 3**: Para la construcción de la interfaz de usuario.
- **Pinia**: Para la gestión de estado centralizada.
- **Sass**: Para un estilo modular y mantenible.

---

### Instalación y Configuración 🚀

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

**Nota**:  para ingresar a la app se realiza con el usuario `admin` y la contraseña `1234`.
tambien, asegurarse que el puerto del frontend sea 3001 ya que por cors se validara.
```bash
# Clona el repositorio
git clone https://github.com/chrisneiil/book-reviews-backend.git
cd book-reviews-frontend

# Instala las dependencias
npm install

# Configura la API (opcional)
# Asegúrate de que tu backend esté en funcionamiento en http://localhost:3000

# Ejecuta el servidor de desarrollo
npm run dev