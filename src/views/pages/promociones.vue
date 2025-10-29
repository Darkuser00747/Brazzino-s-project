<template>
  <div class="promotions-page">
    <!-- Fondo animado -->
    <div class="background-overlay"></div>
    
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="brand-title">BRAZZINO'S</router-link>
        <div class="nav-section">
          <div class="nav-links">
            <router-link to="/" class="nav-link">
              <span class="nav-icon">🏠</span>
              Inicio
            </router-link>
            <router-link to="/catalogo" class="nav-link">
              <span class="nav-icon">📋</span>
              Catálogo
            </router-link>
            <a href='#politica' class="nav-link">
              <span class="nav-icon">📋</span>
              Política
            </a>
            <a href='#contactanos' class="nav-link">
              <span class="nav-icon">📞</span>
              Contáctanos
            </a>
          </div>
          
          <!-- Botón de logout para usuarios autenticados -->
          <div v-if="isAuthenticated" class="user-menu">
            <div class="user-welcome">
              <span class="welcome-icon">👋</span>
              <span class="welcome-text">Hola, {{ userName }}!</span>
            </div>
            <button @click="logout" class="logout-btn">
              <span class="logout-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
          
          <!-- Botón de login para usuarios no autenticados -->
          <router-link v-else to="/login" class="login-link">
            <span class="login-icon">🔑</span>
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Header de promociones -->
    <div class="promotions-header">
      <div class="header-content">
        <h1 class="page-title">🎯 Promociones Especiales</h1>
        <p class="page-subtitle">Aprovecha nuestras ofertas exclusivas y ahorra en tus bebidas favoritas</p>
        <div class="title-underline"></div>
      </div>
    </div>

    <!-- Filtros y búsqueda (similar a catálogo) -->
    <div class="filters-section" ref="filtersSection">
      <div class="filters-container">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar promociones..." 
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="['filter-btn', { active: selectedCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
        
        <div class="sort-dropdown">
          <select v-model="sortBy" class="sort-select">
            <option value="name">Ordenar por Nombre</option>
            <option value="price">Ordenar por Precio</option>
            <option value="discount">Ordenar por Descuento</option>
          </select>
        </div>
        
        <!-- Controles de paginación superiores -->
        <div v-if="totalPages > 1" class="pagination-controls">
          <button 
            @click="goToFirstPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
            title="Primera página"
          >
            <span>⏮️</span>
          </button>
          
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
            title="Página anterior"
          >
            <span>⬅️</span>
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['page-number', { active: currentPage === page }]"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
            title="Página siguiente"
          >
            <span>➡️</span>
          </button>
          
          <button 
            @click="goToLastPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
            title="Última página"
          >
            <span>⏭️</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Botón "Volver arriba" -->
    <Transition name="fade">
      <button 
        v-if="showScrollToTop" 
        @click="scrollToTop" 
        class="scroll-to-top"
        title="Volver arriba"
      >
        <span>⬆️</span>
      </button>
    </Transition>

    <!-- Paginación info -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span class="results-info">
          Mostrando {{ startIndex + 1 }}-{{ Math.min(startIndex + itemsPerPage, filteredProducts.length) }} 
          de {{ filteredProducts.length }} promociones
        </span>
        <div class="items-per-page">
          <label for="itemsSelect">Productos por página:</label>
          <select id="itemsSelect" v-model="itemsPerPage" class="items-select">
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Carrito flotante (solo para usuarios autenticados) -->
    <div v-if="isAuthenticated && cart.length > 0" class="floating-cart">
      <button @click="toggleCartModal" class="cart-toggle">
        <span class="cart-icon">🛒</span>
        <span class="cart-count">{{ cart.length }}</span>
      </button>
    </div>

    <!-- Modal del carrito -->
    <div v-if="showCartModal" class="cart-modal-overlay" @click="closeCartModal">
      <div class="cart-modal" @click.stop>
        <div class="cart-header">
          <h3>Mi Carrito</h3>
          <button @click="closeCartModal" class="close-btn">×</button>
        </div>
        <div class="cart-items">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <img :src="item.src" :alt="item.titulo" class="cart-item-image">
            <div class="cart-item-info">
              <h4>{{ item.titulo }}</h4>
              <p>{{ item.precio }}</p>
            </div>
            <button @click="removeFromCart(index)" class="remove-item">🗑️</button>
          </div>
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            Total: {{ calculateTotal() }}
          </div>
          <button class="checkout-btn">Proceder al Pago</button>
        </div>
      </div>
    </div>

    <!-- Grid de productos en promoción -->
    <div class="products-section" ref="productsSection">
      <div class="products-container">
        <div v-if="filteredProducts.length === 0" class="no-products">
          <h3>No se encontraron promociones</h3>
          <p>Intenta ajustar tus filtros de búsqueda</p>
        </div>
        
        <div v-else class="products-grid">
          <div 
            v-for="(product, index) in paginatedProducts" 
            :key="startIndex + index" 
            class="product-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="card-image-container">
              <div class="discount-badge" v-if="product.descuento">{{ product.descuento }}% dto</div>
              <img :src="product.src" :alt="product.alt" class="product-image" />
              <div class="image-overlay"></div>
              <div class="product-actions-overlay">
                <button class="quick-view-btn" @click="showProductDetail(product)">
                  <span>👁️</span>
                  Vista Rápida
                </button>
              </div>
            </div>
            
            <div class="product-info">
              <div class="product-category">{{ product.categoria }}</div>
              <h3 class="product-title">{{ product.titulo }}</h3>
              <p class="product-description">{{ product.descripcion }}</p>
              
              <!-- Rating -->
              <div class="product-rating">
                <div class="stars">
                  <span v-for="star in 5" :key="star" :class="['star', { filled: star <= product.rating }]">⭐</span>
                </div>
                <span class="rating-text">({{ product.reviews }} reseñas)</span>
              </div>
              
              <!-- Mostrar precio solo a usuarios autenticados -->
              <div v-if="isAuthenticated" class="product-actions">
                <div class="price-display">
                  <span v-if="product.precioOriginal" class="original-price">{{ product.precioOriginal }}</span>
                  <span class="price-value">{{ product.precio }}</span>
                </div>
                <button class="add-to-cart-btn" @click="addToCart(product)">
                  <span class="cart-icon">🛒</span>
                  <span>Agregar al Carrito</span>
                </button>
              </div>
              
              <div v-else class="login-prompt">
                <router-link to="/login" class="login-prompt-btn">
                  <span class="lock-icon">🔒</span>
                  <span>Inicia sesión para ver precios</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles de paginación inferiores -->
    <div v-if="totalPages > 1" class="pagination-controls bottom">
      <button 
        @click="goToFirstPage" 
        :disabled="currentPage === 1"
        class="pagination-btn"
        title="Primera página"
      >
        <span>⏮️</span>
      </button>
      
      <button 
        @click="previousPage" 
        :disabled="currentPage === 1"
        class="pagination-btn"
        title="Página anterior"
      >
        <span>⬅️</span>
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-number', { active: currentPage === page }]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
        title="Página siguiente"
      >
        <span>➡️</span>
      </button>
      
      <button 
        @click="goToLastPage" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
        title="Última página"
      >
        <span>⏭️</span>
      </button>
    </div>

    <!-- Modal de detalle de producto -->
    <div v-if="selectedProduct" class="product-modal-overlay" @click="closeProductDetail">
      <div class="product-modal" @click.stop>
        <button class="modal-close" @click="closeProductDetail">×</button>
        <div class="modal-content">
          <div class="modal-image">
            <img :src="selectedProduct.src" :alt="selectedProduct.titulo">
          </div>
          <div class="modal-info">
            <div class="modal-category">{{ selectedProduct.categoria }}</div>
            <h2>{{ selectedProduct.titulo }}</h2>
            <p class="modal-description">{{ selectedProduct.descripcion }}</p>
            <div class="modal-rating">
              <div class="stars">
                <span v-for="star in 5" :key="star" :class="['star', { filled: star <= selectedProduct.rating }]">⭐</span>
              </div>
              <span>({{ selectedProduct.reviews }} reseñas)</span>
            </div>
            <div class="modal-price">
              <span v-if="selectedProduct.precioOriginal" class="original-price">{{ selectedProduct.precioOriginal }}</span>
              <span class="current-price">{{ selectedProduct.precio }}</span>
              <span v-if="selectedProduct.descuento" class="discount-tag">Ahorra {{ selectedProduct.descuento }}%</span>
            </div>
            <div v-if="isAuthenticated" class="modal-actions">
              <button @click="addToCart(selectedProduct)" class="modal-add-to-cart">
                <span>🛒</span> Agregar al Carrito
              </button>
            </div>
            <div v-else class="modal-login-prompt">
              <router-link to="/login" class="modal-login-btn" @click="closeProductDetail">
                <span>🔑</span> Inicia sesión para comprar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer" id="contactanos">
      <div class="footer-content">
        <div class="footer-header">
          <h2 class="footer-title">📞 Contáctanos</h2>
        </div>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h4>Ubicación</h4>
              <address>Calle 30, Carrera 34 #1, Ciudad XYZ</address>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div class="contact-details">
              <h4>Teléfono</h4>
              <a href="tel:+573023723919">+57 302 372 3919</a>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div class="contact-details">
              <h4>Email</h4>
              <a href="mailto:contacto@brazzinos.com">contacto@brazzinos.com</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Notificación elaborada -->
    <transition name="notification-slide">
      <div v-if="showNotification" class="notification">
        <div class="notification-content">
          <span class="notification-icon">✅</span>
          <p class="notification-message">{{ notificationMessage }}</p>
          <button class="notification-close" @click="showNotification = false">&times;</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([
  // Añadir productos con descuentos
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4sJIOk7YAVvCtg_lR47hL-AWJWmxCeIXreQ&s",
    alt: "Vodka Premium",
    titulo: "Vodka Premium",
    descripcion: "Sabor neutro y suave. Perfecto para cócteles premium.",
    categoria: "Vodka",
    rating: 4.5,
    reviews: 128,
    precio: "$85,000",
    precioOriginal: "$100,000",
    descuento: 15
  },
  {
    src: "https://muttsmousers.ca/media/catalog/product/cache/6ab565c3c7e8d6f3f386bd0dc87c9acc/d/o/dog_perignon_gift_set2_grande2.jpg",
    alt: "Dom Pérignon",
    titulo: "Dom Pérignon",
    descripcion: "Champagne de lujo de la región de Champagne, Francia.",
    categoria: "Champagne",
    rating: 5,
    reviews: 89,
    precio: "$450,000",
    precioOriginal: "$500,000",
    descuento: 10
  },
  // Añadir más productos en promoción del catálogo...
])

const searchQuery = ref('')
const selectedCategory = ref('Todos')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const showScrollToTop = ref(false)
const cart = ref([])
const showCartModal = ref(false)
const selectedProduct = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const isAuthenticated = ref(false)
const userName = ref('')

const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.categoria))]
  return ['Todos', ...uniqueCategories]
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.titulo.toLowerCase().includes(query) ||
      product.descripcion.toLowerCase().includes(query) ||
      product.categoria.toLowerCase().includes(query)
    )
  }

  // Filtro por categoría
  if (selectedCategory.value !== 'Todos') {
    filtered = filtered.filter(product => product.categoria === selectedCategory.value)
  }

  // Ordenar
  switch (sortBy.value) {
    case 'name':
      filtered = filtered.sort((a, b) => a.titulo.localeCompare(b.titulo))
      break
    case 'price':
      filtered = filtered.sort((a, b) => {
        const priceA = parseInt(a.precio.replace(/[$,]/g, ''))
        const priceB = parseInt(b.precio.replace(/[$,]/g, ''))
        return priceA - priceB
      })
      break
    case 'discount':
      filtered = filtered.sort((a, b) => (b.descuento || 0) - (a.descuento || 0))
      break
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  if (start > 1) pages.push(1)
  if (start > 2) pages.push('...')
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages.value - 1) pages.push('...')
  if (end < totalPages.value) pages.push(totalPages.value)

  return pages
})

function goToPage(page) {
  if (page !== '...') {
    currentPage.value = page
    scrollToProducts()
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToProducts()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToProducts()
  }
}

function goToFirstPage() {
  currentPage.value = 1
  scrollToProducts()
}

function goToLastPage() {
  currentPage.value = totalPages.value
  scrollToProducts()
}

function scrollToProducts() {
  nextTick(() => {
    const section = this.$refs.productsSection
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

function scrollToFilters() {
  nextTick(() => {
    const section = this.$refs.filtersSection
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function checkScroll() {
  showScrollToTop.value = window.scrollY > 300
}

function addToCart(product) {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  cart.value.push({ ...product })
  showNotificationMessage('Producto agregado al carrito')
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
}

function toggleCartModal() {
  showCartModal.value = !showCartModal.value
}

function closeCartModal() {
  showCartModal.value = false
}

function calculateTotal() {
  return cart.value.reduce((total, item) => {
    return total + parseInt(item.precio.replace(/[$,]/g, '')) * item.quantity
  }, 0).toLocaleString('es-CO')
}

function showProductDetail(product) {
  selectedProduct.value = product
}

function closeProductDetail() {
  selectedProduct.value = null
}

function showNotificationMessage(message) {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

function checkAuth() {
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  isAuthenticated.value = !!token && !!user
  if (user) {
    const userData = JSON.parse(user)
    userName.value = userData.name || userData.email
  }
}

function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  userName.value = ''
  router.push('/login')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
/* Estilos similares a Catalogo.vue */
.promotions-page {
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #3d3d3d 75%, #1a1a1a 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Background overlay (similar a home.vue) */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.5" fill="%23ffffff" opacity="0.02"/><circle cx="80" cy="80" r="0.3" fill="%23ffffff" opacity="0.015"/><circle cx="40" cy="60" r="0.4" fill="%23ffffff" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
}

/* Navbar (similar a Catalogo.vue) */
.navbar {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-title {
  color: #FFD700;
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  background: linear-gradient(135deg, #FFD700, #FF4500);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ... (Mantener estilos de nav-links, user-menu, etc., idénticos a home.vue) */

/* Header de promociones */
.promotions-header {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 69, 0, 0.1));
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.page-title {
  color: #FFD700;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  letter-spacing: 2px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 1px;
}

.title-underline {
  width: 150px;
  height: 5px;
  background: linear-gradient(90deg, #FFD700, #FF4500);
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* Filtros (similar a Catalogo.vue) */
.filters-section {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  padding: 2rem;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  scroll-margin-top: 0;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
}

.search-bar {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  background: rgba(0, 0, 0, 0.6);
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
}

/* Filter buttons */
.filter-buttons {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.filter-buttons::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  background: rgba(255, 215, 0, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.filter-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.filter-btn.active {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border-color: #FFD700;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}

/* Sort dropdown */
.sort-dropdown {
  position: relative;
}

.sort-select {
  padding: 1rem 2.5rem 1rem 1.5rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sort-select:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  background: rgba(0, 0, 0, 0.6);
}

.sort-dropdown::after {
  content: '▼';
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

/* Paginación (similar a Catalogo.vue) */
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 2rem 0;
}

.pagination-btn {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
}

.page-number {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.page-number:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.page-number.active {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border-color: #FFD700;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.page-number:disabled {
  cursor: default;
  opacity: 0.5;
}

/* Paginación info */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.95);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  position: sticky;
  top: calc(var(--navbar-height) + 1px); /* Ajustar según altura de navbar */
  z-index: 98;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.results-info {
  font-weight: 600;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.items-select {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.items-select:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
}

/* Botón de volver arriba */
.scroll-to-top {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  z-index: 99;
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Floating cart (similar a Catalogo.vue) */
.floating-cart {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
}

.cart-toggle {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.cart-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #FF4500;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  min-width: 25px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 69, 0, 0.5);
}

/* Modal del carrito (similar a Catalogo.vue) */
.cart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cart-modal {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.cart-header h3 {
  color: #FFD700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #FFD700;
}

.cart-items {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 40vh;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h4 {
  color: #FFD700;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.cart-item-info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
}

.remove-item {
  background: rgba(255, 69, 0, 0.2);
  border: none;
  color: #FF4500;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-item:hover {
  background: rgba(255, 69, 0, 0.4);
  transform: scale(1.1);
}

.cart-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total {
  color: #FFD700;
  font-weight: 700;
  font-size: 1.1rem;
}

.checkout-btn {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* Productos grid (similar a Catalogo.vue) */
.products-section {
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.products-container {
  position: relative;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  animation: fadeIn 1s ease-out;
}

/* Tarjeta de producto */
.product-card {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(100%);
}

.product-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
}

.card-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.5);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.product-actions-overlay {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .product-actions-overlay {
  opacity: 1;
  bottom: 1.5rem;
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.quick-view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.product-category {
  color: #FFD700;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.product-title {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.product-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.2rem;
}

.star {
  font-size: 1.2rem;
  color: rgba(255, 215, 0, 0.3);
}

.star.filled {
  color: #FFD700;
}

.rating-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Precios */
.price-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.original-price {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  text-decoration: line-through;
}

.price-value {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.discount-tag {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.5);
}

/* Botón agregar al carrito */
.add-to-cart-btn {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
  background: linear-gradient(135deg, #FF4500, #8B4513);
}

.cart-icon {
  font-size: 1rem;
}

/* Login prompt */
.login-prompt-btn {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  text-decoration: none;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-prompt-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.lock-icon {
  font-size: 1rem;
}

/* Modal de detalle de producto */
.product-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.product-modal {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #FFD700;
  transform: rotate(90deg);
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.modal-image {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.modal-image img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.modal-image:hover img {
  transform: scale(1.05);
}

.modal-category {
  color: #FFD700;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.modal-info h2 {
  color: #FFD700;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.modal-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.original-price {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  text-decoration: line-through;
}

.current-price {
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.discount-tag {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.5);
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-add-to-cart {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.modal-add-to-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.modal-login-btn {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  text-decoration: none;
  padding: 1.2rem 2rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.modal-login-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* Notificación (de home.vue) */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e0e0e0;
}

.notification-icon {
  font-size: 1.2rem;
  color: #48bb78;
}

.notification-message {
  margin: 0;
  font-size: 1rem;
}

.notification-close {
  background: none;
  border: none;
  color: rgba(255, 215, 0, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
}

.notification-close:hover {
  color: #FFD700;
}

/* Footer (de home.vue) */
.footer {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding: 4rem 2rem 2rem;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FFD700, #FF4500, #8B4513, #FFD700);
  background-size: 400% 400%;
  animation: shimmer 3s ease-in-out infinite;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-header {
  text-align: center;
  margin-bottom: 3rem;
}

.footer-title {
  color: #FFD700;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-item {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.contact-item:hover {
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.contact-details h4 {
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-details address,
.contact-details a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-style: normal;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.contact-details a:hover {
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .filters-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .modal-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .page-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .navbar-content {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }

  .nav-section {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
  }

  .brand-title {
    font-size: 2rem;
    text-align: center;
    width: 100%;
  }

  .promotions-header {
    padding: 4rem 1rem 3rem;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .filters-section {
    scroll-margin-top: 120px;
  }
  
  .products-section {
    scroll-margin-top: 120px;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    gap: 0.3rem;
    padding: 1.5rem 1rem;
  }
  
  .pagination-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .page-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .page-numbers {
    margin: 0 0.5rem;
  }
  
  .scroll-to-top {
    bottom: 4rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.1rem;
  }
  
  .floating-cart {
    bottom: 1rem;
    right: 1rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .filters-container {
    padding: 1.5rem;
  }

  .filter-buttons {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .filter-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .floating-cart {
    bottom: 1rem;
    right: 1rem;
  }

  .cart-toggle {
    width: 60px;
    height: 60px;
  }

  .cart-icon {
    font-size: 1.5rem;
  }

  .cart-count {
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
  }

  .cart-modal {
    width: 95%;
  }

  .product-modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-image img {
    height: 250px;
  }

  .modal-info h2 {
    font-size: 1.8rem;
  }

  .current-price {
    font-size: 1.6rem;
  }

  .user-menu {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.8rem;
  }

  .brand-title {
    font-size: 1.8rem;
  }

  .nav-link {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }

  .promotions-header {
    padding: 3rem 1rem 2rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .filters-section {
    scroll-margin-top: 140px;
  }
  
  .products-section {
    scroll-margin-top: 140px;
  }

  .filters-container {
    padding: 1rem;
    gap: 1rem;
  }

  .search-input {
    padding: 0.8rem 2.5rem 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .filter-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }

  .sort-select {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .product-info {
    padding: 1.5rem;
  }

  .product-title {
    font-size: 1.2rem;
  }

  .product-description {
    font-size: 0.9rem;
  }

  .price-value {
    font-size: 1.2rem;
  }

  .add-to-cart-btn {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .floating-cart {
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .cart-toggle {
    width: 55px;
    height: 55px;
  }

  .cart-icon {
    font-size: 1.3rem;
  }

  .cart-count {
    width: 20px;
    height: 20px;
    font-size: 0.65rem;
    top: -3px;
    right: -3px;
  }

  .pagination-info {
    padding: 1rem;
  }
  
  .results-info {
    font-size: 0.85rem;
  }
  
  .items-per-page label {
    font-size: 0.8rem;
  }
  
  .items-select {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
  
  .pagination-controls {
    padding: 1rem 0.5rem;
    gap: 0.2rem;
  }
  
  .pagination-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .page-number {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
  
  .page-numbers {
    margin: 0 0.3rem;
  }
  
  .scroll-to-top {
    bottom: 3rem;
    right: 0.5rem;
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }

  .cart-modal {
    width: 98%;
  }

  .product-modal {
    margin: 0.5rem;
    width: calc(100% - 1rem);
    max-height: 95vh;
  }

  .modal-close {
    top: 0.5rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }

  .modal-content {
    padding: 1rem;
    gap: 1.5rem;
  }

  .modal-image img {
    height: 200px;
  }

  .modal-info h2 {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.4rem;
  }

  .modal-price .original-price {
    font-size: 1rem;
  }

  .modal-add-to-cart,
  .modal-login-btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .footer {
    padding: 3rem 1rem 2rem;
  }

  .footer-title {
    font-size: 2rem;
  }

  .contact-item {
    padding: 1.5rem;
  }

  .contact-icon {
    font-size: 2.5rem;
  }
}

/* Mejoras de accesibilidad y UX */
.search-input:focus,
.sort-select:focus,
.filter-btn:focus,
.cart-toggle:focus,
.add-to-cart-btn:focus,
.login-prompt-btn:focus,
.modal-add-to-cart:focus,
.modal-login-btn:focus {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
}

/* Estados de hover mejorados */
.nav-link,
.filter-btn,
.add-to-cart-btn,
.login-prompt-btn,
.cart-toggle,
.quick-view-btn,
.modal-add-to-cart,
.modal-login-btn,
.checkout-btn {
  position: relative;
  overflow: hidden;
}

.nav-link::before,
.filter-btn::before,
.add-to-cart-btn::before,
.login-prompt-btn::before,
.quick-view-btn::before,
.modal-add-to-cart::before,
.modal-login-btn::before,
.checkout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before,
.filter-btn:hover::before,
.add-to-cart-btn:hover::before,
.login-prompt-btn:hover::before,
.quick-view-btn:hover::before,
.modal-add-to-cart:hover::before,
.modal-login-btn:hover::before,
.checkout-btn:hover::before {
  left: 100%;
}

/* Notificación */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e0e0e0;
}

.notification-icon {
  font-size: 1.2rem;
  color: #48bb78;
}

.notification-message {
  margin: 0;
  font-size: 1rem;
}

.notification-close {
  background: none;
  border: none;
  color: rgba(255, 215, 0, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
}

.notification-close:hover {
  color: #FFD700;
}
</style>