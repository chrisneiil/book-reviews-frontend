<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBooksStore } from '@/store/books';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const booksStore = useBooksStore();
const { isLoading } = storeToRefs(booksStore);

const book = ref(null);
const review = ref("");
const rating = ref(0);
const message = ref("");

// ⚡ Convertir la URL de la imagen a Base64
const toBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error al convertir a Base64:", error);
    return null;
  }
};

// ⚡ obtener datos del libro desde backend
const fetchBook = async () => {
  booksStore.isLoading = true;
  try {
    const res = await $fetch(`http://localhost:3000/api/books/search?q=${route.params.id}`, {
      headers: {
        // hardcode por tiempo.
        Authorization: "Basic " + btoa("admin:1234")
      }
    });
    book.value = res[0] || null;
  } catch (err) {
    console.error("Error cargando libro", err);
  } finally {
    booksStore.isLoading = false;
  }
};

// ⚡ guardar en mi biblioteca
const saveBook = async () => {
  if (!rating.value) {
    message.value = "Debes  dar un puntaje.";
    return;
  }

  message.value = "Guardando...";

  try {
    const coverBase64 = book.value.cover ? await toBase64(book.value.cover) : null;

    const bookData = {
      key: book.value.key,
      title: book.value.title,
      author: book.value.author,
      year: book.value.year,
      cover: coverBase64,
      review: review.value,
      rating: rating.value
    };

    await booksStore.saveBook(bookData);
    message.value = "✅ Libro guardado en tu biblioteca!";
    setTimeout(() => router.push("/my-library"), 1000);
  } catch (err) {
    message.value = "❌ Error al guardar el libro";
  }
};

onMounted(() => {
  fetchBook();
});
</script>


<template>
  <div class="book-detail-page">
    <div v-if="isLoading" class="loading-message">
      <div class="loading-spinner"></div>
      <p>Cargando libro...</p>
    </div>

    <div v-else-if="book" class="book-container">
      <div class="book-header">
        <img v-if="book.cover" :src="book.cover" alt="Portada del libro" class="book-cover" />
        <div v-else class="book-cover no-image">No Image</div>
      </div>

      <div class="book-info">
        <h1 class="book-title">{{ book.title }}</h1>
        <p class="book-author">{{ book.author }}</p>
        <p class="book-year">Año: {{ book.year }}</p>

        <div class="book-form">
          <label class="form-label">Reseña:</label>
          <textarea
              v-model="review"
              maxlength="500"
              placeholder="Escribe tu reseña (máx 500 caracteres)"
              class="form-textarea"
          ></textarea>

          <div class="rating-control">
            <label class="form-label">Puntaje:</label>
            <select v-model="rating" class="form-select">
              <option value="0">Seleccionar</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <button @click="saveBook" class="save-button">
            Guardar en mi biblioteca
          </button>

          <p v-if="message" :class="['message', { success: message.startsWith('✅'), error: message.startsWith('❌') }]">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

$primary-color: #2c3e50;
$secondary-color: #3498db;
$success-color: #27ae60;
$danger-color: #e74c3c;
$border-color: #e0e0e0;

.book-detail-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f9;
  padding: 2rem;
}

.book-container {
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.book-header {
  width: 40%;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.book-cover {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &.no-image {
    background-color: #f9f9f9;
    color: #aaa;
    font-style: italic;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px; /* Para que tenga un tamaño similar a la imagen */
  }
}

.book-info {
  width: 60%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    padding-top: 0;
  }
}

.book-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 0.5rem;
}

.book-author {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 0.25rem;
}

.book-year {
  font-size: 1rem;
  color: #777;
  margin-bottom: 2rem;
}

.book-form {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: $primary-color;
  margin-bottom: 0.5rem;
}

.form-textarea,
.form-select {
  border: 1px solid $border-color;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 1.5rem;
  width: 100%;
  font-size: 1rem;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $secondary-color;
    box-shadow: 0 0 0 3px rgba($secondary-color, 0.2);
  }
}

.rating-control {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.save-button {
  background-color: $success-color;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust($success-color, $lightness: -10%);
  }
}

.message {
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
  padding: 10px;
  border-radius: 6px;

  &.success {
    background-color: rgba($success-color, 0.1);
    color: $success-color;
  }

  &.error {
    background-color: rgba($danger-color, 0.1);
    color: $danger-color;
  }
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;

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