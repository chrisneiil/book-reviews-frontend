<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const router = useRouter();
const { isAuthenticated, loginMessage } = storeToRefs(authStore);

const username = ref('');
const password = ref('');

async function handleLogin() {
  const success = await authStore.login(username.value, password.value);
  if (success) {
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Iniciar Sesión</h2>
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input id="username" v-model="username" type="text" placeholder="admin">
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input id="password" v-model="password" type="password" placeholder="1234">
      </div>
      <button @click="handleLogin" class="login-button">Entrar</button>
      <p v-if="loginMessage" :class="['message', { success: isAuthenticated, error: !isAuthenticated }]">
        {{ loginMessage }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #2c3e50;
$secondary-color: #3498db;
$success-color: #27ae60;
$danger-color: #e74c3c;
$background-color: #f4f7f9;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $background-color;
  font-family: Arial, sans-serif;
}

.login-form {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: $primary-color;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: $primary-color;
    }

    input {
      width: 94%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      &:focus {
        outline: none;
        border-color: $secondary-color;
        box-shadow: 0 0 0 3px rgba($secondary-color, 0.2);
      }
    }
  }

  .login-button {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background-color: $secondary-color;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($secondary-color, 10%);
    }
  }

  .message {
    margin-top: 1.5rem;
    font-weight: bold;
    &.success {
      color: $success-color;
    }
    &.error {
      color: $danger-color;
    }
  }
}
</style>