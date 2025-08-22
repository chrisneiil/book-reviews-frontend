import { useAuthStore } from '@/store/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    const { isAuthenticated } = authStore;

    // Define las rutas públicas que no requieren autenticación
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.some(path => to.path.startsWith(path));

    // Si el usuario NO está autenticado y la ruta NO es pública, redirigir al login
    if (!isAuthenticated && !isPublicRoute) {
        return navigateTo('/login');
    }

    // Si el usuario ya está autenticado y está intentando acceder a la página de login, redirigir a la página principal
    if (isAuthenticated && to.path === '/login') {
        return navigateTo('/');
    }
});