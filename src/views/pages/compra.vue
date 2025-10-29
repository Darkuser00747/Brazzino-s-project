<template>
  <div class="checkout-layout">
    <!-- Fondo animado -->
    <div class="background-overlay"></div>

    <!-- Encabezado FIJO -->
    <header class="checkout-header">
      <div class="header-content">
        <h1 class="brand-title">BRAZZINO'S - Finalizar Compra</h1>
        <div class="header-actions">
          <router-link to="/" class="back-link">
            <span class="back-icon">⬅️</span>
            Volver al Inicio
          </router-link>
          <button @click="toggleCartView" class="cart-button" v-if="isAuthenticated">
            <span class="cart-icon">🛒</span>
            <span class="cart-text">Carrito</span>
            <span v-if="cartItems.length > 0" class="cart-badge">{{ cartItems.length }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Modal del Carrito -->
    <transition name="modal">
      <div v-if="showCartModal" class="cart-modal-overlay" @click="closeCartView">
        <div class="cart-modal" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">🛒 Tu Carrito</h2>
            <button @click="closeCartView" class="close-modal-btn">✕</button>
          </div>
          
          <div class="modal-body">
            <div v-if="cartItems.length > 0" class="modal-cart-items">
              <div v-for="(item, index) in cartItems" :key="item.titulo" class="modal-cart-item">
                <img :src="item.src" :alt="item.titulo" class="modal-item-image" />
                <div class="modal-item-info">
                  <h4 class="modal-item-title">{{ item.titulo }}</h4>
                  <p class="modal-item-price">{{ getItemPrice(item) }}</p>
                  <div class="modal-item-quantity">
                    <button @click="decreaseQuantity(item)" class="modal-qty-btn">-</button>
                    <span class="modal-qty">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" class="modal-qty-btn">+</button>
                  </div>
                </div>
                <button @click="removeItem(item)" class="modal-remove-btn">
                  <span>🗑️</span>
                </button>
                <button @click="checkoutItem(item)" class="modal-item-checkout-btn">
                  Comprar este
                </button>
              </div>
            </div>
            <div v-else class="modal-empty-cart">
              <p>Tu carrito está vacío</p>
              <router-link to="/catalogo" class="modal-catalog-link" @click="closeCartView">
                Ver Catálogo
              </router-link>
            </div>
          </div>
          
          <div class="modal-footer">
            <div class="modal-total">
              <span class="modal-total-label">Total:</span>
              <span class="modal-total-amount">${{ getCartTotal }}</span>
            </div>
            <button 
              @click="checkoutAll" 
              class="modal-checkout-btn"
              :disabled="cartItems.length === 0"
            >
              Proceder al Pago (Todo)
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Contenido principal con SCROLL (solo para usuarios autenticados) -->
    <main v-if="isAuthenticated" class="checkout-content">
      <div class="content-container">
        <!-- Resumen del carrito -->
        <section class="cart-summary">
          <div class="section-header">
            <h2 class="section-title">🛒 Resumen del Carrito</h2>
            <div class="title-underline"></div>
          </div>
          <div class="cart-items">
            <div v-for="(item, index) in displayedItems" :key="item.titulo" class="cart-item">
              <div class="cart-item-image">
                <img :src="item.src" :alt="item.titulo" class="item-image" />
              </div>
              <div class="cart-item-details">
                <h3 class="item-title">{{ item.titulo }}</h3>
                <p class="item-description">{{ item.descripcion }}</p>
                <div class="item-pricing">
                  <span class="price-label">Precio:</span>
                  <span class="price-value">{{ getItemPrice(item) }}</span>
                  <span v-if="userRole === 'vip' || userRole === 'premium'" class="original-price">
                    (Regular: {{ item.precio }})
                  </span>
                </div>
                <div class="item-quantity">
                  <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
                </div>
                <button @click="removeItem(item)" class="remove-btn">
                  <span class="remove-icon">🗑️</span>
                  Eliminar
                </button>
              </div>
            </div>
            <div v-if="!displayedItems.length" class="empty-cart">
              <p>Tu carrito está vacío. <router-link to="/catalogo" class="catalog-link">Explora nuestro catálogo</router-link>.</p>
            </div>
          </div>
          <div class="cart-total">
            <h3>Total: <span class="total-amount">${{ getTotalPrice }}</span></h3>
          </div>
        </section>

        <!-- Información del usuario -->
        <section class="user-info-section">
          <div class="section-header">
            <h2 class="section-title">👤 Información de Envío</h2>
            <div class="title-underline"></div>
          </div>
          <form @submit.prevent="handleCheckout" class="user-info-form">
            <div class="form-group">
              <label for="full-name">Nombre Completo:</label>
              <input
                type="text"
                id="full-name"
                v-model="userInfo.fullName"
                required
                placeholder="Tu nombre completo"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label for="address">Dirección de Envío:</label>
              <input
                type="text"
                id="address"
                v-model="userInfo.address"
                required
                placeholder="Calle, Ciudad, País"
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label for="phone">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                v-model="userInfo.phone"
                required
                placeholder="+57 123 456 7890"
                :disabled="isLoading"
              />
            </div>
          </form>
        </section>

        <!-- Opciones de pago -->
        <section class="payment-section">
          <div class="section-header">
            <h2 class="section-title">💳 Método de Pago</h2>
            <div class="title-underline"></div>
          </div>
          <div class="payment-options">
            <label class="payment-option">
              <input type="radio" v-model="paymentMethod" value="credit-card" :disabled="isLoading" />
              <span class="payment-icon">💳</span>
              Tarjeta de Crédito/Débito
            </label>
            <label class="payment-option">
              <input type="radio" v-model="paymentMethod" value="paypal" :disabled="isLoading" />
              <span class="payment-icon">📱</span>
              PayPal
            </label>
            <label class="payment-option">
              <input type="radio" v-model="paymentMethod" value="bank-transfer" :disabled="isLoading" />
              <span class="payment-icon">🏦</span>
              Transferencia Bancaria
            </label>
            <label class="payment-option">
              <input type="radio" v-model="paymentMethod" value="saldo" :disabled="isLoading || userBalance < getTotalPriceNumeric" />
              <span class="payment-icon">💰</span>
              Saldo Disponible (${{ userBalance.toLocaleString('es-CO') }})
            </label>
          </div>
        </section>

        <!-- Botón de confirmación -->
        <section class="confirmation-section">
          <button 
            @click="handleCheckout" 
            class="confirm-btn" 
            :disabled="isLoading || !displayedItems.length || !paymentMethod"
          >
            {{ isLoading ? 'Procesando...' : 'Confirmar Compra' }}
          </button>
        </section>
      </div>
    </main>

    <!-- Mensaje para usuarios no autenticados -->
    <main v-else class="checkout-content">
      <div class="content-container">
        <section class="login-prompt-section">
          <div class="section-header">
            <h2 class="section-title">🔒 Inicia Sesión para Continuar</h2>
            <div class="title-underline"></div>
          </div>
          <p>Debes iniciar sesión para acceder a la página de compra.</p>
          <router-link to="/login" class="login-prompt-btn">
            <span class="lock-icon">🔑</span>
            Iniciar Sesión
          </router-link>
        </section>
      </div>
    </main>

    <!-- Alerta personalizada -->
    <div v-if="showAlert" class="custom-alert">
      <div class="alert-content">
        <h3 class="alert-title">✅ Pago Realizado</h3>
        <p class="alert-message">Su producto se llegará en: {{ estimatedDeliveryDate }}</p>
        <button @click="closeAlert" class="alert-close-btn">✕</button>
      </div>
    </div>

    <!-- Footer FIJO -->
    <footer class="footer">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Constantes de roles
const ROLES = {
  USER: 'user',
  VIP: 'vip',
  PREMIUM: 'premium',
  ADMIN: 'admin'
}

// Estado de autenticación
const isAuthenticated = ref(false)
const userRole = ref('')
const userName = ref('')
const userBalance = ref(0)

// Estado del carrito
const cartItems = ref([
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4sJIOk7YAVvCtg_lR47hL-AWJWmxCeIXreQ&s",
    titulo: "Vodka Premium",
    descripcion: "Sabor neutro y suave.",
    precio: "$85,000",
    quantity: 1
  },
  {
    src: "https://muttsmousers.ca/media/catalog/product/cache/6ab565c3c7e8d6f3f386bd0dc87c9acc/d/o/dog_perignon_gift_set2_grande2.jpg",
    titulo: "Dom Pérignon",
    descripcion: "Champagne de lujo.",
    precio: "$450,000",
    quantity: 1
  }
])

const selectedItem = ref(null)
const displayedItems = computed(() => selectedItem.value ? [selectedItem.value] : cartItems.value)

// Información del usuario
const userInfo = ref({
  fullName: '',
  address: '',
  phone: ''
})

// Método de pago
const paymentMethod = ref('')
const isLoading = ref(false)
const showCartModal = ref(false)

// Alerta personalizada
const showAlert = ref(false)
const estimatedDeliveryDate = ref('')

// Verificar autenticación
function checkAuthStatus() {
  try {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      isAuthenticated.value = true
      const userData = JSON.parse(user)
      userName.value = userData.name || userData.email || 'Usuario'
      userRole.value = userData.role || ROLES.USER
      userInfo.value.fullName = userData.name || ''
      userBalance.value = userData.balance || 0
    } else {
      isAuthenticated.value = false
      userName.value = ''
      userRole.value = ''
      userBalance.value = 0
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    isAuthenticated.value = false
    userBalance.value = 0
  }
}

// Precio según rol
function getItemPrice(item) {
  try {
    const numericPrice = parseInt(item.precio.replace(/[$,]/g, ''))
    if (isNaN(numericPrice)) return item.precio
    
    if (userRole.value === ROLES.VIP) {
      return `$${Math.round(numericPrice * 0.85).toLocaleString('es-CO')}`
    } else if (userRole.value === ROLES.PREMIUM || userRole.value === ROLES.ADMIN) {
      return `$${Math.round(numericPrice * 0.75).toLocaleString('es-CO')}`
    }
    return item.precio
  } catch (error) {
    console.error('Error calculando precio:', error)
    return item.precio
  }
}

// Total del carrito completo (para modal)
const getCartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const numericPrice = parseInt(item.precio.replace(/[$,]/g, ''))
    let price = numericPrice
    if (userRole.value === ROLES.VIP) {
      price = Math.round(numericPrice * 0.85)
    } else if (userRole.value === ROLES.PREMIUM || userRole.value === ROLES.ADMIN) {
      price = Math.round(numericPrice * 0.75)
    }
    return total + (price * item.quantity)
  }, 0).toLocaleString('es-CO')
})

// Total para la compra (basado en displayedItems)
const getTotalPrice = computed(() => {
  return displayedItems.value.reduce((total, item) => {
    const numericPrice = parseInt(item.precio.replace(/[$,]/g, ''))
    let price = numericPrice
    if (userRole.value === ROLES.VIP) {
      price = Math.round(numericPrice * 0.85)
    } else if (userRole.value === ROLES.PREMIUM || userRole.value === ROLES.ADMIN) {
      price = Math.round(numericPrice * 0.75)
    }
    return total + (price * item.quantity)
  }, 0).toLocaleString('es-CO')
})

// Total numérico sin formato
const getTotalPriceNumeric = computed(() => {
  return displayedItems.value.reduce((total, item) => {
    const numericPrice = parseInt(item.precio.replace(/[$,]/g, ''))
    let price = numericPrice
    if (userRole.value === ROLES.VIP) {
      price = Math.round(numericPrice * 0.85)
    } else if (userRole.value === ROLES.PREMIUM || userRole.value === ROLES.ADMIN) {
      price = Math.round(numericPrice * 0.75)
    }
    return total + (price * item.quantity)
  }, 0)
})

// Funciones del carrito
function increaseQuantity(item) {
  item.quantity++
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--
  }
}

function removeItem(item) {
  if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
    const idx = cartItems.value.indexOf(item)
    if (idx !== -1) {
      cartItems.value.splice(idx, 1)
    }
    if (selectedItem.value === item) {
      selectedItem.value = null
    }
  }
}

// Procesar compra
async function handleCheckout() {
  if (!paymentMethod.value) {
    alert('Por favor, selecciona un método de pago.');
    return;
  }

  if (!userInfo.value.fullName || !userInfo.value.address || !userInfo.value.phone) {
    alert('Por favor, completa toda tu información de envío.');
    return;
  }

  isLoading.value = true;
  try {
    // Simulación de procesamiento de compra
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (paymentMethod.value === 'saldo') {
      if (userBalance.value >= getTotalPriceNumeric.value) {
        userBalance.value -= getTotalPriceNumeric.value;
        updateUserData();
      } else {
        alert('Saldo insuficiente.');
        isLoading.value = false;
        return;
      }
    }
    
    // Calcular fecha estimada de entrega
    const currentDate = new Date();
    const estimatedDays = Math.floor(Math.random() * 5) + 3; // 3 a 7 días
    const estimatedDate = new Date(currentDate);
    estimatedDate.setDate(currentDate.getDate() + estimatedDays);
    estimatedDeliveryDate.value = estimatedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    showAlert.value = true;
    
    // Limpiar carrito o item seleccionado
    if (selectedItem.value) {
      const idx = cartItems.value.indexOf(selectedItem.value);
      if (idx !== -1) {
        cartItems.value.splice(idx, 1);
      }
      selectedItem.value = null;
    } else {
      cartItems.value = [];
    }
    paymentMethod.value = '';
    
    // Redirigir al inicio después de un tiempo
    setTimeout(() => {
      router.push('/');
    }, 5000); // Redirige después de 5 segundos para que el usuario vea la alerta
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    alert('Ocurrió un error al procesar la compra. Por favor, intenta de nuevo.');
  } finally {
    isLoading.value = false;
  }
}

// Actualizar datos del usuario en localStorage
function updateUserData() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    user.balance = userBalance.value;
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Obtener texto del método de pago
function getPaymentMethodText() {
  const methods = {
    'credit-card': 'Tarjeta de Crédito/Débito',
    'paypal': 'PayPal',
    'bank-transfer': 'Transferencia Bancaria',
    'saldo': 'Saldo Disponible'
  };
  return methods[paymentMethod.value] || paymentMethod.value;
}

// Funciones del modal del carrito
function toggleCartView() {
  showCartModal.value = !showCartModal.value;
  if (showCartModal.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeCartView() {
  showCartModal.value = false;
  document.body.style.overflow = '';
}

function scrollToCheckout() {
  const checkoutContent = document.querySelector('.checkout-content');
  if (checkoutContent) {
    checkoutContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function checkoutAll() {
  selectedItem.value = null;
  closeCartView();
  scrollToCheckout();
}

function checkoutItem(item) {
  selectedItem.value = item;
  closeCartView();
  scrollToCheckout();
}

// Cerrar alerta
function closeAlert() {
  showAlert.value = false;
  router.push('/');
}

onMounted(() => {
  checkAuthStatus();
});
</script>

<style scoped>
/* Layout principal - ALTURA FIJA */
.checkout-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #3d3d3d 75%, #1a1a1a 100%);
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

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

/* Header - FIJO en la parte superior */
.checkout-header {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.5rem 2rem;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-title {
  color: #FFD700;
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  background: linear-gradient(135deg, #FFD700, #FF4500);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-link {
  color: #FFD700;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.back-icon {
  font-size: 1.1rem;
}

/* Botón del carrito */
.cart-button {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.cart-button:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.cart-icon {
  font-size: 1.2rem;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.5);
}

/* Modal del carrito */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.cart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.cart-modal {
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.close-modal-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal-btn:hover {
  background: rgba(229, 62, 62, 0.8);
  border-color: #e53e3e;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  
  /* Scrollbar personalizado */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.5) rgba(20, 20, 20, 0.3);
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.3);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.7);
}

.modal-cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modal-cart-item:hover {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.3);
}

.modal-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.modal-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.modal-item-title {
  color: #FFD700;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.modal-item-price {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.modal-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.modal-qty-btn {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-qty-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.1);
}

.modal-qty {
  color: #FFD700;
  font-weight: 600;
  min-width: 25px;
  text-align: center;
}

.modal-remove-btn {
  background: rgba(229, 62, 62, 0.1);
  border: 1px solid rgba(229, 62, 62, 0.3);
  color: #e53e3e;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
}

.modal-remove-btn:hover {
  background: rgba(229, 62, 62, 0.8);
  border-color: #e53e3e;
  transform: scale(1.1);
}

.modal-item-checkout-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  align-self: center;
}

.modal-item-checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
  background: linear-gradient(135deg, #FFA500, #FF8C00);
}

.modal-empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.modal-empty-cart p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.modal-catalog-link {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  display: inline-block;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-catalog-link:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-total-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-total-amount {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.modal-checkout-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.modal-checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
  background: linear-gradient(135deg, #FFA500, #FF8C00);
}

.modal-checkout-btn:disabled {
  background: rgba(255, 215, 0, 0.3);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Contenido principal - ÁREA CON SCROLL */
.checkout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem;
  position: relative;
  z-index: 2;
  
  /* Estilos personalizados del scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.5) rgba(20, 20, 20, 0.3);
}

.checkout-content::-webkit-scrollbar {
  width: 12px;
}

.checkout-content::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.5);
  border-radius: 10px;
  margin: 10px 0;
}

.checkout-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.6), rgba(255, 165, 0, 0.6));
  border-radius: 10px;
  border: 2px solid rgba(20, 20, 20, 0.5);
  transition: all 0.3s ease;
}

.checkout-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.8), rgba(255, 165, 0, 0.8));
  border-color: rgba(20, 20, 20, 0.7);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  color: #FFD700;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #FF4500);
  margin: 0 auto;
  border-radius: 2px;
}

/* Resumen del carrito */
.cart-summary {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.cart-summary:hover {
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: rgba(255, 215, 0, 0.05);
  border-radius: 10px;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image {
  transform: scale(1.1);
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-title {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.item-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

.item-pricing {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.price-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.price-value {
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.original-price {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  text-decoration: line-through;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-btn {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.quantity {
  color: #FFD700;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.remove-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.5);
  background: linear-gradient(135deg, #c53030, #a02828);
}

.remove-icon {
  font-size: 0.9rem;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.catalog-link {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.catalog-link:hover {
  text-decoration: underline;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.cart-total {
  text-align: right;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 215, 0, 0.3);
}

.cart-total h3 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  margin: 0;
}

.total-amount {
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

/* Información del usuario */
.user-info-section {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.user-info-section:hover {
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #FFD700;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.form-group input:disabled {
  background: rgba(255, 255, 255, 0.02);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Opciones de pago */
.payment-section {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.payment-section:hover {
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-option:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateX(5px);
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #FFD700;
}

.payment-icon {
  font-size: 1.4rem;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
}

/* Botón de confirmación */
.confirmation-section {
  text-align: center;
  padding: 1rem 0;
}

.confirm-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
  background: linear-gradient(135deg, #FFA500, #FF8C00);
}

.confirm-btn:disabled {
  background: rgba(255, 215, 0, 0.3);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

/* Login prompt */
.login-prompt-section {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.login-prompt-section p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.login-prompt-btn {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  text-decoration: none;
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.login-prompt-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.lock-icon {
  font-size: 1.2rem;
}

/* Footer - FIJO en la parte inferior - VERSIÓN COMPACTA */
.footer {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1rem 1.5rem;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD700, #FF4500, #8B4513, #FFD700);
  background-size: 400% 400%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-header {
  text-align: center;
  margin-bottom: 0.8rem;
}

.footer-title {
  color: #FFD700;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.contact-item {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.contact-item:hover {
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.contact-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
}

.contact-details h4 {
  color: #FFD700;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.contact-details address,
.contact-details a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-style: normal;
  font-size: 0.85rem;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.contact-details a:hover {
  color: #FFD700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

/* Alerta personalizada */
.custom-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 2rem;
  z-index: 2000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  animation: alertSlideIn 0.3s ease;
}

@keyframes alertSlideIn {
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.alert-content {
  text-align: center;
  position: relative;
}

.alert-title {
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.alert-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.alert-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -15px;
  right: -15px;
}

.alert-close-btn:hover {
  background: rgba(229, 62, 62, 0.8);
  border-color: #e53e3e;
  transform: rotate(90deg);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .checkout-content {
    padding: 2rem 1rem;
  }

  .content-container {
    gap: 2rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .checkout-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .brand-title {
    font-size: 1.8rem;
    text-align: center;
    width: 100%;
  }

  .back-link,
  .cart-button {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }

  .cart-text {
    display: none;
  }

  .cart-badge {
    top: -8px;
    right: -8px;
  }

  .checkout-content {
    padding: 1.5rem 1rem;
  }

  .cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cart-item-image {
    width: 120px;
    height: 120px;
  }

  .cart-item-details {
    align-items: center;
  }

  .item-quantity {
    justify-content: center;
  }

  .remove-btn {
    align-self: center;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .cart-summary,
  .user-info-section,
  .payment-section {
    padding: 1.5rem;
  }

  .custom-alert {
    width: 90%;
    padding: 1.5rem;
  }

  .alert-title {
    font-size: 1.5rem;
  }

  .alert-message {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .checkout-header {
    padding: 0.8rem;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .back-link {
    font-size: 0.85rem;
    padding: 0.5rem 0.8rem;
  }

  .cart-button {
    padding: 0.5rem 0.8rem;
  }

  .cart-icon {
    font-size: 1.1rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-item-image {
    width: 100px;
    height: 100px;
  }

  .modal-item-info {
    align-items: center;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .cart-item-details {
    gap: 0.3rem;
  }

  .item-title {
    font-size: 1.1rem;
  }

  .item-description {
    font-size: 0.85rem;
  }

  .price-value {
    font-size: 1.1rem;
  }

  .confirm-btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .footer {
    padding: 1rem 0.8rem;
  }

  .footer-title {
    font-size: 1rem;
  }

  .contact-icon {
    font-size: 1.3rem;
  }

  .contact-details h4 {
    font-size: 0.85rem;
  }

  .contact-details address,
  .contact-details a {
    font-size: 0.8rem;
  }
  
  .cart-summary,
  .user-info-section,
  .payment-section,
  .login-prompt-section {
    padding: 1.2rem;
  }

  .custom-alert {
    width: 85%;
    padding: 1rem;
  }

  .alert-title {
    font-size: 1.2rem;
  }

  .alert-message {
    font-size: 0.9rem;
  }

  .alert-close-btn {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
    top: -10px;
    right: -10px;
  }
}

/* Animación suave al hacer scroll */
@media (prefers-reduced-motion: no-preference) {
  .checkout-content {
    scroll-behavior: smooth;
  }
}
</style>