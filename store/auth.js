import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const isAuthenticated = ref(false)
    const loginMessage = ref(null)

    // Función para establecer el estado de autenticación
    function setAuth(apiToken) {
        token.value = apiToken
        isAuthenticated.value = !!apiToken
        if (process.client) {
            localStorage.setItem('auth_token', apiToken)
        }
    }

    // Carga el token desde el localStorage al iniciar la app
    function loadToken() {
        if (process.client) {
            const storedToken = localStorage.getItem('auth_token')
            if (storedToken) {
                setAuth(storedToken)
            }
        }
    }

    // Acción para hacer login
    async function login(username, password) {
        loginMessage.value = 'Iniciando sesión...'
        try {
            // Reemplaza con tu endpoint de login si tienes uno,
            // por ahora usaremos las credenciales hardcodeadas
            // ya que el PDF no especifica un endpoint de login.
            if (username === 'admin' && password === '1234') {
                const fakeToken = btoa(`${username}:${password}`)
                setAuth(fakeToken)
                loginMessage.value = '✅ Inicio de sesión exitoso!'
                return true
            } else {
                loginMessage.value = '❌ Credenciales incorrectas.'
                return false
            }
        } catch (err) {
            console.error("Error en el login", err);
            loginMessage.value = '❌ Error en el inicio de sesión.'
            return false
        }
    }

    // Acción para hacer logout
    function logout() {
        setAuth(null)
        if (process.client) {
            localStorage.removeItem('auth_token')
        }
    }

    return { token, isAuthenticated, loginMessage, setAuth, loadToken, login, logout }
})