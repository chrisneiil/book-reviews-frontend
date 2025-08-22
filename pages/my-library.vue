<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useBooksStore } from '@/store/books';

const booksStore = useBooksStore();
const { myLibrary, isLoading } = storeToRefs(booksStore);

const searchQuery = ref("");
const sortOrder = ref("asc");
const excludeNoReview = ref(false);

const isModalOpen = ref(false);
const editingBook = ref(null);
const editedReview = ref("");
const editedRating = ref(0);
const editMessage = ref("");

// ⚡ Lógica de filtrado y ordenamiento
const filteredAndSortedBooks = computed(() => {
  let books = [...myLibrary.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    books = books.filter(
        (book) =>
            book.title.toLowerCase().includes(query) ||
            (book.author && book.author.toLowerCase().includes(query))
    );
  }

  if (excludeNoReview.value) {
    books = books.filter((book) => book.review && book.review.length > 0);
  }

  books.sort((a, b) => {
    if (sortOrder.value === "asc") {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  return books;
});

// ⚡ Abrir modal de edición
const openEditModal = (book) => {
  editingBook.value = book;
  editedReview.value = book.review;
  editedRating.value = book.rating;
  isModalOpen.value = true;
  editMessage.value = "";
};

// ⚡ Guardar cambios de edición
const saveEditedBook = async () => {
  if (!editedReview.value || !editedRating.value) {
    editMessage.value = "Debes escribir una reseña y dar un puntaje.";
    return;
  }

  editMessage.value = "Guardando...";

  try {
    const bookData = {
      review: editedReview.value,
      rating: editedRating.value
    };
    await booksStore.updateBook(editingBook.value._id, bookData);
    editMessage.value = "✅ Libro actualizado con éxito!";
    await booksStore.fetchMyLibrary();
    setTimeout(() => {
      isModalOpen.value = false;
      editingBook.value = null;
    }, 1000);
  } catch (err) {
    editMessage.value = "❌ Error al actualizar el libro.";
  }
};

// ⚡ Eliminar libro
const deleteBook = async (bookId) => {
  if (confirm("¿Estás seguro de que quieres eliminar este libro de tu biblioteca?")) {
    try {
      await booksStore.deleteBook(bookId);
      await booksStore.fetchMyLibrary();
    } catch (err) {
      alert("Error al eliminar el libro. Por favor, inténtalo de nuevo.");
    }
  }
};

onMounted(() => {
  booksStore.fetchMyLibrary();
});
</script>


<template>
  <div class="library-container">
    <header class="library-header">
      <h1>Mi Biblioteca</h1>
    </header>

    <div class="controls-section">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por título o autor"
          class="search-input"
      />

      <div class="filter-group">
        <label for="sort-select">Ordenar por calificación:</label>
        <select id="sort-select" v-model="sortOrder" class="filter-select">
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      <div class="filter-group">
        <label>
          <input type="checkbox" v-model="excludeNoReview" />
          Excluir sin reseña
        </label>
      </div>
    </div>

    <div v-if="isLoading" class="loading-message">
      <div class="loading-spinner"></div>
      <p>Cargando biblioteca...</p>
    </div>

    <div v-else class="books-grid">
      <p v-if="filteredAndSortedBooks.length === 0" class="no-books-message">
        No hay libros en tu biblioteca que coincidan con los criterios.
      </p>

      <div v-for="book in filteredAndSortedBooks" :key="book._id" class="book-card">
        <img
            v-if="book.cover"
            :src="`data:image/jpeg;base64,${book.cover}`"
            alt="Portada del libro"
            class="book-cover"
        />
        <div v-else class="book-cover no-image">No Image</div>

        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="year">Año: {{ book.year }}</p>
          <p class="rating">
            Calificación:
            <span v-for="n in book.rating" :key="n" class="star">★</span>
          </p>
          <p class="review">
            **Reseña:** <span>{{ book.review || 'No hay reseña' }}</span>
          </p>
        </div>

        <div class="card-actions">
          <button @click="openEditModal(book)" class="edit-button">
            Editar
          </button>
          <button @click="deleteBook(book._id)" class="delete-button">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Editar Libro</h2>
        <div v-if="editingBook">
          <h3>{{ editingBook.title }}</h3>
          <label>Nueva Reseña:</label>
          <textarea v-model="editedReview" maxlength="500"></textarea>

          <label>Nuevo Puntaje:</label>
          <select v-model="editedRating">
            <option value="0">Seleccionar</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>

          <p :class="['edit-message', { success: editMessage.startsWith('✅'), error: editMessage.startsWith('❌') }]">
            {{ editMessage }}
          </p>

          <div class="modal-actions">
            <button @click="saveEditedBook" class="save-button">Guardar Cambios</button>
            <button @click="isModalOpen = false" class="cancel-button">Cancelar</button>
          </div>
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
$background-color: #f4f7f9;
$border-color: #e0e0e0;
$shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

.library-container {
  padding: 2rem;
  background-color: $background-color;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.library-header {
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    font-size: 2.5rem;
    color: $primary-color;
    font-weight: bold;
  }
}

.controls-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: $shadow;

  .search-input {
    flex: 1 1 300px;
    padding: 1rem;
    border: 1px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: $secondary-color;
      box-shadow: 0 0 0 3px rgba($secondary-color, 0.2);
    }
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    color: $primary-color;
  }

  .filter-select {
    padding: 0.8rem;
    border: 1px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.book-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: $shadow;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
}

.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  background-color: #f9f9f9;

  &.no-image {
    font-style: italic;
    color: #aaa;
  }
}

.book-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-grow: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: $primary-color;
    margin-bottom: 0.5rem;
  }
  .author, .year {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 0.25rem;
  }
  .rating {
    font-weight: bold;
    margin-top: 1rem;
    color: $primary-color;
    .star {
      color: gold;
      font-size: 1.2rem;
    }
  }
  .review {
    font-style: italic;
    font-size: 0.9rem;
    margin-top: 1rem;
    color: #666;
  }
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  border-top: 1px solid $border-color;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .edit-button {
    background-color: $secondary-color;
    color: white;
    &:hover {
      background-color: color.adjust($secondary-color, $lightness: -10%);
    }
  }

  .delete-button {
    background-color: $danger-color;
    color: white;
    &:hover {
      background-color: color.adjust($danger-color, $lightness: -10%);
    }
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

.no-books-message {
  text-align: center;
  width: 100%;
  margin-top: 3rem;
  font-size: 1.5rem;
  color: #888;
}

// Estilos para el modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 90%;

  max-width: 500px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: $primary-color;
  }

  h3 {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 1rem;
  }

  label {
    align-self: flex-start;
    font-weight: bold;
    color: $primary-color;
  }

  textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid $border-color;
    border-radius: 8px;
  }

  .edit-message {
    font-weight: bold;
    padding: 0.5rem;
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

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .save-button, .cancel-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .save-button {
    background-color: $success-color;
    color: white;
    &:hover {
      background-color: color.adjust($success-color, $lightness: -10%);
    }
  }

  .cancel-button {
    background-color: #bdc3c7;
    color: $primary-color;
    &:hover {
      background-color: color.adjust(#bdc3c7, $lightness: -10%);
    }
  }
}
</style>
