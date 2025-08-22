import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_URL = "http://localhost:3000/api/books";

export const useBooksStore = defineStore('books', {
    state: () => ({
        lastSearches: [],
        myLibrary: [],
        searchResults: [],
        isLoading: false,
        errorMessage: null,
    }),

    actions: {
        // Helper para obtener el encabezado de autenticación
        getAuthHeader() {
            const authStore = useAuthStore();
            return {
                Authorization: `Basic ${authStore.token}`
            };
        },

        async fetchLastSearches() {
            try {
                const res = await $fetch(`${API_URL}/last-search`, {
                    headers: this.getAuthHeader(),
                });
                this.lastSearches = res;
            } catch (err) {
                console.error("Error al obtener últimas búsquedas", err);
            }
        },

        async searchBooks(query) {
            this.isLoading = true;
            this.errorMessage = null;
            try {
                const res = await $fetch(`${API_URL}/search?q=${query}`, {
                    headers: this.getAuthHeader(),
                });
                if (res.message) {
                    this.errorMessage = res.message;
                    this.searchResults = [];
                } else {
                    this.searchResults = res.slice(0, 10);
                }
            } catch (err) {
                this.errorMessage = "Error buscando libros";
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchMyLibrary() {
            this.isLoading = true;
            try {
                const res = await $fetch(`${API_URL}/my-library`, {
                    headers: this.getAuthHeader(),
                });
                this.myLibrary = res;
            } catch (err) {
                console.error("Error al cargar la biblioteca", err);
            } finally {
                this.isLoading = false;
            }
        },

        async saveBook(bookData) {
            this.isLoading = true;
            this.errorMessage = null;
            try {
                await $fetch(`${API_URL}/my-library`, {
                    method: "POST",
                    headers: this.getAuthHeader(),
                    body: bookData,
                });
            } catch (err) {
                console.error("Error guardando libro", err);
                this.errorMessage = "Error al guardar el libro";
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateBook(bookId, bookData) {
            this.isLoading = true;
            this.errorMessage = null;
            try {
                await $fetch(`${API_URL}/my-library/${bookId}`, {
                    method: "PUT",
                    headers: this.getAuthHeader(),
                    body: bookData,
                });
            } catch (err) {
                console.error("Error al actualizar el libro", err);
                this.errorMessage = "Error al actualizar el libro";
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteBook(bookId) {
            this.isLoading = true;
            try {
                await $fetch(`${API_URL}/my-library/${bookId}`, {
                    method: "DELETE",
                    headers: this.getAuthHeader(),
                });
            } catch (err) {
                console.error("Error al eliminar el libro", err);
                this.errorMessage = "Error al eliminar el libro";
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
    },
});