<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBooksStore } from '@/store/books'

const booksStore = useBooksStore()
const { lastSearches, searchResults, isLoading, errorMessage } = storeToRefs(booksStore)

const query = ref("")

const handleSearch = async () => {
  if (!query.value) return
  await booksStore.searchBooks(query.value)
  await booksStore.fetchLastSearches()
}

onMounted(() => {
  booksStore.fetchLastSearches()
})
</script>

<template>
  <div class="home-container">
    <div class="search-section">
      <div class="search-bar">
        <input
            v-model="query"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Escribe el nombre de un Libro para continuar"
            class="search-input"
        />
        <button @click="handleSearch" class="search-button">
          Buscar
        </button>
      </div>

      <div v-if="lastSearches.length" class="last-searches-list">
        <h2>Últimas búsquedas</h2>
        <ul>
          <li v-for="s in lastSearches" :key="s._id" @click="query = s.query; handleSearch()">
            {{ s.query }}
          </li>
        </ul>
      </div>
    </div>

    <div class="results-section">
      <div v-if="isLoading" class="loading-message">
        <div class="loading-spinner"></div>
        <p>Cargando libros...</p>
      </div>

      <p v-if="errorMessage && !isLoading" class="error-message">{{ errorMessage }}</p>

      <div v-if="searchResults.length && !isLoading" class="results-grid">
        <NuxtLink
            v-for="book in searchResults"
            :key="book.key"
            :to="`/book/${encodeURIComponent(book.key)}`"
            class="book-card"
        >
          <img v-if="book.cover" :src="book.cover" alt="Portada" class="book-cover" />
          <div v-else class="book-cover no-image">
            No Image
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-year">Año: {{ book.year }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:color";

$primary-color: #2c3e50;
$secondary-color: #3498db;
$accent-color: #27ae60;
$background-color: #f4f7f9;
$border-color: #e0e0e0;
$text-light-color: #7f8c8d;
$shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: $background-color;
  font-family: Arial, sans-serif;
}

.search-section {
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 5vh;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.search-input {
  width: 75%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid $border-color;
  border-radius: 8px 0 0 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $secondary-color;
    box-shadow: 0 0 0 3px rgba($secondary-color, 0.2);
  }

  @media (max-width: 600px) {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
}

.search-button {
  width: 25%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: $secondary-color;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust($secondary-color, $lightness: -10%);
  }

  @media (max-width: 600px) {
    width: 100%;
    border-radius: 8px;
  }
}

.last-searches-list {
  text-align: left;
  margin-top: 2rem;

  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    color: $primary-color;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.5rem;
      color: $text-light-color;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #e9ecef;
      }
    }
  }
}

.results-section {
  width: 100%;
  max-width: 1000px;
  margin-top: 3rem;
  text-align: center;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.book-card {
  display: flex;
  flex-direction: column;
  width: 225px;
  text-decoration: none;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: $shadow;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* La propiedad clave para que la imagen se ajuste sin distorsionarse */
  display: block;
}

.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid $border-color;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: $text-light-color;

  &.no-image {
    background-color: #f9f9f9;
    color: #aaa;
    font-style: italic;
  }
}

.book-info {
  padding: 1rem;
  text-align: center;
  flex: 1; /* Añadido: Permite que este elemento crezca y llene el espacio restante */
  display: flex; /* Añadido: Convierte este contenedor en un flexbox */
  flex-direction: column; /* Añadido: Apila los elementos verticalmente */
  justify-content: space-between; /* Añadido: Distribuye el espacio entre los elementos */
}

.book-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 0.25rem;
}

.book-author {
  font-size: 0.9rem;
  color: $text-light-color;
  margin-bottom: 0.25rem;
}

.book-year {
  font-size: 0.8rem;
  color: #95a5a6;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  p {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: $primary-color;
  }
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid $secondary-color;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>