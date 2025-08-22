<script setup>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const router = useRouter();

const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  // Cargar el token desde el localStorage al montar la aplicación
  authStore.loadToken();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="layout-container">
    <header class="main-header">
      <nav>
        <div class="logo">
          <NuxtLink to="/">
            <h1>BookReviews</h1>
          </NuxtLink>
        </div>
        <div class="nav-links">
          <NuxtLink v-if="isAuthenticated" to="/my-library" class="btn-library">
            Mi Biblioteca
          </NuxtLink>
          <button v-if="isAuthenticated" @click="handleLogout" class="btn-logout">
            Cerrar Sesión
          </button>
          <NuxtLink v-else to="/login" class="btn-login">
            Iniciar Sesión
          </NuxtLink>
        </div>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style lang="scss">
@use "sass:color";

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f4f7f9;
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo a {
    text-decoration: none;
    color: #2c3e50;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .nav-links {
    display: flex;
    gap: 1rem;
    align-items: center;

    a, button {
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      transition: background-color 0.3s ease, color 0.3s ease;
      cursor: pointer;
      border: none;
    }

    .btn-library {
      background-color: #3498db;
      color: white;
      &:hover {
        background-color: color.adjust(#3498db, $lightness: -10%);
      }
    }

    .btn-login {
      background-color: #27ae60;
      color: white;
      &:hover {
        background-color: color.adjust(#27ae60, $lightness: -10%);
      }
    }

    .btn-logout {
      background-color: #e74c3c;
      color: white;
      height: 50px;
      font-size: 15px;
      &:hover {
        background-color: color.adjust(#e74c3c, $lightness: -10%);
      }
    }
  }
}

main {
  flex: 1;
}
</style>