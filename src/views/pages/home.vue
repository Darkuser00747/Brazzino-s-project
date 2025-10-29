<template>
  <!-- Layout para páginas de autenticación (solo el componente de login) -->
  <div v-if="isAuthPage" class="auth-layout">
    <router-view />
  </div>

  <!-- Layout principal de BRAZZINO'S -->
  <div v-else class="main-layout">
    <!-- Fondo animado con efectos -->
    <div class="background-overlay"></div>
    
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="brand-title">BRAZZINO'S</h1>
        <div class="nav-section">
          <div class="nav-links">
            <router-link to="/catalogo" class="nav-link">
              <span class="nav-icon">📋</span>
              Catálogo
            </router-link>
            <router-link to='/promociones' class="nav-link">
              <span class="nav-icon">🎯</span>
              Promociones
            </router-link>
            <a href='#contactanos' class="nav-link">
              <span class="nav-icon">📞</span>
              Contáctanos
            </a>
            <!-- AGREGAR ESTE BOTÓN JUNTO A LOS DEMÁS BOTONES PRINCIPALES (ej: Inicio, Catálogo, Política, etc.) -->
             <a href="#terminos" class="main-nav-btn terms-btn">
  <span class="btn-icon">⚖️</span>
  <span class="btn-text">Términos</span>
  <div class="btn-glow"></div>
</a>
            <!-- Enlaces adicionales para administradores -->
            <router-link v-if="userRole === 'admin'" to="/dashboard" class="nav-link admin-link">
              <span class="nav-icon">⚙️</span>
              Dashboard
            </router-link>
          </div>
          
          <!-- Botón de logout para usuarios autenticados -->
          <div v-if="isAuthenticated" class="user-menu">
            <div class="user-welcome" @click="showUserModal = true">
              <span class="welcome-icon">{{ getRoleIcon() }}</span>
              <div class="user-info">
                <span class="welcome-text">Hola, {{ userName }}!</span>
                <span class="user-role">{{ getRoleText() }}</span>
              </div>
            </div>
            <button @click="logout" class="logout-btn main-nav-btn">
  <span class="btn-icon">🔓</span>
  <span class="btn-text">Cerrar Sesión</span>
  <div class="btn-glow"></div>
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

    <!-- Modal de información del usuario -->
    <div v-if="showUserModal" class="user-modal-overlay" @click.self="showUserModal = false">
      <Transition name="modal">
        <div class="user-modal">
          <div class="modal-header">
            <h2 class="modal-title">Información del Usuario</h2>
            <button class="close-btn" @click="showUserModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Perfil editable -->
            <Transition name="fade">
              <div v-if="activeSection === 'profile' || !activeSection" key="profile" class="user-section">
                <h3 class="section-title" @click="toggleSection('profile')">
                  🏠 Perfil y Dirección
                  <span class="toggle-icon" :class="{ 'rotated': expandedSections.profile }">▼</span>
                </h3>
                <div v-show="expandedSections.profile" class="section-content">
                  <div class="profile-form">
                    <div class="form-group">
                      <label>Calle / Dirección:</label>
                      <input v-model="userData.address.street" placeholder="Ej: Calle 123 #45-67" />
                    </div>
                    <div class="form-group">
                      <label>Ciudad:</label>
                      <input v-model="userData.address.city" placeholder="Ej: Bogotá" />
                    </div>
                    <div class="form-group">
                      <label>Código Postal:</label>
                      <input v-model="userData.address.zip" placeholder="Ej: 11001" />
                    </div>
                    <div class="form-group">
                      <label>Teléfono:</label>
                      <input v-model="userData.address.phone" placeholder="Ej: +57 300 123 4567" />
                    </div>
                    <button @click="saveProfile" class="save-profile-btn">Guardar Cambios</button>
                  </div>
                  <div v-if="showProfilePrompt" class="profile-prompt">
                    <p>Por favor, completa tu dirección para continuar con la compra.</p>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Detalles personales -->
            <Transition name="fade">
              <div v-if="activeSection === 'personal' || !activeSection" key="personal" class="user-section">
                <h3 class="section-title" @click="toggleSection('personal')">
                  👤 Detalles Personales
                  <span class="toggle-icon" :class="{ 'rotated': expandedSections.personal }">▼</span>
                </h3>
                <div v-show="expandedSections.personal" class="section-content">
                  <div class="user-details">
                    <p><strong>Nombre:</strong> {{ userData?.name || 'N/A' }}</p>
                    <p><strong>Email:</strong> {{ userData?.email || 'N/A' }}</p>
                    <p><strong>Rol:</strong> {{ getRoleText() }}</p>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Historial de pedidos -->
            <Transition name="fade">
              <div v-if="activeSection === 'orders' || !activeSection" key="orders" class="user-section">
                <h3 class="section-title" @click="toggleSection('orders')">
                  📦 Historial de Pedidos
                  <span class="toggle-icon" :class="{ 'rotated': expandedSections.orders }">▼</span>
                </h3>
                <div v-show="expandedSections.orders" class="section-content">
                  <div v-if="userData?.orders && userData.orders.length > 0" class="orders-list">
                    <div v-for="(order, index) in userData.orders.slice(0, showAllOrders ? undefined : 5)" :key="index" class="order-item">
                      <div class="order-header">
                        <span class="order-date">{{ order.date }}</span>
                        <span class="order-product">{{ order.product }}</span>
                      </div>
                      <div class="order-amount">Monto: {{ order.amount }}</div>
                    </div>
                    <div v-if="!showAllOrders && userData.orders.length > 5" class="more-orders">
                      <button @click="showAllOrders = true" class="expand-btn">Ver todos los pedidos</button>
                    </div>
                  </div>
                  <div v-else class="no-orders">No hay pedidos anteriores.</div>
                </div>
              </div>
            </Transition>

            <!-- Gastos y saldo -->
            <Transition name="fade">
              <div v-if="activeSection === 'financial' || !activeSection" key="financial" class="user-section">
                <h3 class="section-title" @click="toggleSection('financial')">
                  💰 Gastos y Saldo
                  <span class="toggle-icon" :class="{ 'rotated': expandedSections.financial }">▼</span>
                </h3>
                <div v-show="expandedSections.financial" class="section-content">
                  <div class="financial-details">
                    <p><strong>Total Gastado:</strong> {{ userData?.totalSpent ? `$${userData.totalSpent.toLocaleString()}` : '$0' }}</p>
                    <p><strong>Saldo Restante:</strong> {{ userData?.balance ? `$${userData.balance.toLocaleString()}` : '$0' }}</p>
                  </div>
                  <div class="financial-actions">
                    <button @click="showRechargeModal = true" class="recharge-btn">Recargar Saldo</button>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Navegación entre secciones -->
            <div class="section-nav" v-if="activeSection">
              <button @click="activeSection = null" class="nav-btn">Todas las Secciones</button>
              <button @click="activeSection = 'profile'" :class="['nav-btn', { active: activeSection === 'profile' }]">Perfil</button>
              <button @click="activeSection = 'personal'" :class="['nav-btn', { active: activeSection === 'personal' }]">Personales</button>
              <button @click="activeSection = 'orders'" :class="['nav-btn', { active: activeSection === 'orders' }]">Pedidos</button>
              <button @click="activeSection = 'financial'" :class="['nav-btn', { active: activeSection === 'financial' }]">Finanzas</button>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showUserModal = false" class="close-modal-btn">Cerrar</button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Modal de Recarga de Saldo -->
    <div v-if="showRechargeModal" class="user-modal-overlay" @click.self="showRechargeModal = false">
      <Transition name="modal">
        <div class="recharge-modal">
          <div class="modal-header">
            <h2 class="modal-title">Recargar Saldo</h2>
            <button class="close-btn" @click="showRechargeModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="recharge-amount">
              <label for="amount">Monto a recargar:</label>
              <input type="number" id="amount" v-model="rechargeAmount" min="10000" placeholder="Ej: 50000" />
            </div>
            <div class="payment-methods">
              <h3>Métodos de Pago</h3>
              <div class="method-option" @click="selectPaymentMethod('card')">
                <span class="method-icon">💳</span>
                <div class="method-info">
                  <h4>Tarjeta de Crédito/Débito</h4>
                  <p>Visa, Mastercard, etc.</p>
                </div>
                <input type="radio" v-model="selectedPaymentMethod" value="card" hidden />
              </div>
              <div class="method-option" @click="selectPaymentMethod('paypal')">
                <span class="method-icon">💰</span>
                <div class="method-info">
                  <h4>PayPal</h4>
                  <p>Pago seguro con PayPal</p>
                </div>
                <input type="radio" v-model="selectedPaymentMethod" value="paypal" hidden />
              </div>
              <div class="method-option" @click="selectPaymentMethod('transfer')">
                <span class="method-icon">🏦</span>
                <div class="method-info">
                  <h4>Transferencia Bancaria</h4>
                  <p>Bancolombia - Cuenta: 123456789</p>
                </div>
                <input type="radio" v-model="selectedPaymentMethod" value="transfer" hidden />
              </div>
            </div>
            <button @click="processRecharge" class="confirm-recharge-btn" :disabled="!rechargeAmount || !selectedPaymentMethod">Confirmar Recarga</button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Carrusel Hero -->
    <div class="hero-carousel">
      <div class="carousel-container">
        <div
          v-for="(img, index) in imagenes"
          :key="index"
          :class="['carousel-slide', { active: index === actual }]"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <h2 class="slide-title">BRAZZINO'S</h2>
            <p class="slide-subtitle">Experiencia Premium en Bebidas</p>
          </div>
        </div>
        
        <div class="carousel-controls">
          <button @click="anterior" class="carousel-btn prev">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="siguiente" class="carousel-btn next">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="carousel-indicators">
          <button
            v-for="(img, index) in imagenes"
            :key="index"
            @click="actual = index"
            :class="['indicator', { active: index === actual }]"
          ></button>
        </div>
      </div>
    </div>

    <!-- Secciones de información -->
    <div class="content-sections">
      <div class="info-card">
        <div class="card-header">
          <h2 class="card-title">🥃 Sobre Nosotros</h2>
        </div>
        <div class="card-content">
          <p>
            En <strong>BRAZZINO'S</strong> nos apasiona ofrecer una experiencia única en bebidas. 
            Nuestro catálogo está cuidadosamente seleccionado para complacer a los paladares más exigentes.
          </p>
          <p>
            Explora nuestra amplia variedad y descubre tu nueva favorita. <em>¡Salud!</em>
          </p>
        </div>
      </div>

      <div class="info-card">
        <div class="card-header">
          <h2 class="card-title">🎯 ¿Cuál es nuestra misión?</h2>
        </div>
        <div class="card-content">
          <p>
            En <strong>BRAZZINO'S</strong> tenemos como misión garantizar un excelente servicio en el ámbito 
            de las ventas económicas en este tipo de industrias al contar con una disponibilidad estable.
          </p>
          <p>
            Con mucho gusto colaboraremos con diversas empresas famosas referentes a estos servicios 
            para poder así garantizar un crecimiento exponencial mutuo para ambas partes.
          </p>
        </div>
      </div>
    </div>

    <!-- Vista previa del catálogo -->
    <div id="catalogo-preview" class="catalog-section">
      <div class="section-header">
        <h2 class="section-title">✨ Nuestros Productos Destacados</h2>
        <div class="title-underline"></div>
      </div>
      
      <div class="products-grid">
        <div class="product-card" v-for="(img, index) in imagenesCatalogo.slice(0, 3)" :key="index">
          <div class="card-image-container">
            <div v-if="hasDiscountAccess()" class="discount-badge">
              {{ getDiscountText() }}
            </div>
            <img :src="img.src" :alt="img.alt" class="product-image" />
            <div class="image-overlay"></div>
          </div>
          
          <div class="product-info">
            <h3 class="product-title">{{ img.titulo }}</h3>
            <p class="product-description">{{ img.descripcion }}</p>
            
            <!-- Vista para usuarios NO autenticados -->
            <div v-if="!isAuthenticated" class="login-prompt">
              <router-link to="/login" class="login-prompt-btn">
                <span class="lock-icon">🔒</span>
                <span>Inicia sesión para ver precios</span>
              </router-link>
            </div>
            
            <!-- Vista para usuarios autenticados -->
            <div v-else class="authenticated-user-view">
              <div class="price-display">
                <div v-if="userRole === 'vip'" class="discounted-price">
                  <span class="price-label">Precio VIP (15% dto):</span>
                  <span class="price-value vip">{{ getVipPrice(img.precio) }}</span>
                </div>
                <div v-else-if="userRole === 'premium'" class="discounted-price">
                  <span class="price-label">Precio Premium (25% dto):</span>
                  <span class="price-value premium">{{ getPremiumPrice(img.precio) }}</span>
                </div>
                <div v-else class="price-display">
                  <span class="price-label">Precio:</span>
                  <span class="price-value">{{ img.precio }}</span>
                </div>
              </div>
              <div class="product-actions">
                <button class="buy-now-btn" @click="buyNow(img)">
                  <span class="buy-icon">⚡</span>
                  <span>Comprar Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="catalog-footer">
        <router-link to="/catalogo" class="view-catalog-btn">
          <span class="catalog-icon">📖</span>
          <span>Ver Catálogo Completo</span>
        </router-link>
      </div>
    </div>
<!-- AGREGAR ESTA SECCIÓN DESPUÉS DEL CATÁLOGO Y ANTES DEL FOOTER -->
<div id="politica" class="policy-section">
  <Transition name="policy-header" appear>
    <div class="section-header">
      <h2 class="section-title">📜 Política de Nuestra Empresa</h2>
      <div class="title-underline"></div>
    </div>
  </Transition>
  
  <div class="policy-content">
    <TransitionGroup name="policy-card" tag="div" appear>
      <div key="1" class="policy-card">
        <h3 class="policy-subtitle">1. Introducción</h3>
        <div class="policy-text-container">
          <p class="policy-text">
            En BRAZZINO'S, nos comprometemos a proteger la privacidad y los derechos de nuestros usuarios. Esta política describe cómo recopilamos, usamos, compartimos y protegemos su información personal al utilizar nuestro sitio web y servicios.
          </p>
          <p class="policy-text">
            Esta política se aplica a todos los usuarios, incluyendo visitantes no registrados, clientes autenticados y administradores. Nos reservamos el derecho de actualizar esta política en cualquier momento.
          </p>
        </div>
      </div>

      <div key="2" class="policy-card">
        <h3 class="policy-subtitle">2. Recopilación de Información</h3>
        <div class="policy-text-container">
          <p class="policy-text">Recopilamos información personal que usted nos proporciona directamente, como nombre, correo electrónico, dirección y detalles de pago.</p>
          <p class="policy-text highlight">
            Para usuarios menores de edad: Nuestro sitio vende productos alcohólicos y está restringido a mayores de 18 años. No recopilamos información de menores.
          </p>
        </div>
      </div>

      <div key="3" class="policy-card">
        <h3 class="policy-subtitle">3. Uso de la Información</h3>
        <div class="policy-text-container">
          <p class="policy-text">Utilizamos su información para procesar pedidos, gestionar cuentas, enviar notificaciones y mejorar nuestros servicios.</p>
          <p class="policy-text important">No usamos su información para fines no relacionados sin su consentimiento explícito.</p>
        </div>
      </div>

      <div key="4" class="policy-card">
        <h3 class="policy-subtitle">4. Seguridad</h3>
        <div class="policy-text-container">
          <p class="policy-text">Implementamos encriptación SSL, firewalls y controles de acceso para proteger su información contra accesos no autorizados.</p>
          <div class="security-badge">
            <span class="badge-icon">🔒</span>
            <span>SSL Encriptado - Datos Seguros</span>
          </div>
        </div>
      </div>

      <div key="5" class="policy-card">
        <h3 class="policy-subtitle">5. Derechos del Usuario</h3>
        <div class="policy-text-container">
          <p class="policy-text">Usted tiene derecho a acceder, corregir y eliminar su información personal en cualquier momento.</p>
          <div class="rights-list">
            <div class="right-item">✅ Acceso a sus datos</div>
            <div class="right-item">✅ Corrección de información</div>
            <div class="right-item">✅ Eliminación de datos</div>
          </div>
        </div>
      </div>

      <div key="6" class="policy-card contact-card">
        <h3 class="policy-subtitle">6. Contacto</h3>
        <div class="policy-text-container">
          <p class="policy-text">Para preguntas sobre esta política: 
            <a href="mailto:privacidad@brazzinos.com" class="contact-link">privacidad@brazzinos.com</a>
          </p>
          <p class="policy-date">Última actualización: <span class="date-highlight">17 de octubre de 2025</span></p>
        </div>
        <div class="contact-actions">
        </div>
      </div>
    </TransitionGroup>
  </div>
</div>
<!-- AGREGAR ESTA SECCIÓN DESPUÉS DE LA POLÍTICA Y ANTES DEL FOOTER -->
<div id="terminos" class="terms-section">
  <Transition name="terms-header" appear>
    <div class="section-header">
      <h2 class="section-title">⚖️ Términos y Condiciones</h2>
      <div class="title-underline"></div>
    </div>
  </Transition>
  
  <div class="terms-content">
    <TransitionGroup name="terms-card" tag="div" appear>
      <div key="1" class="terms-card">
        <h3 class="terms-subtitle">1. Aceptación de Términos</h3>
        <div class="terms-text-container">
          <p class="terms-text">
            Al acceder o utilizar el sitio web de BRAZZINO'S, usted acepta estar sujeto a estos Términos y Condiciones, así como a nuestra <a href="#politica" class="internal-link">Política de Privacidad</a>. Si no está de acuerdo, por favor no use nuestros servicios.
          </p>
          <p class="terms-text important">
            Estos términos constituyen un contrato legal vinculante entre usted y BRAZZINO'S. Nos reservamos el derecho de modificarlos en cualquier momento, notificando los cambios en el sitio web.
          </p>
          <div class="acceptance-badge">
            <span class="badge-icon">✅</span>
            <span>Aceptación Contractual</span>
          </div>
        </div>
      </div>

      <div key="2" class="terms-card">
        <h3 class="terms-subtitle">2. Elegibilidad y Edad</h3>
        <div class="terms-text-container">
          <p class="terms-text">Debe tener al menos 18 años (o la edad legal en su jurisdicción) para usar nuestros servicios y comprar productos alcohólicos.</p>
          <p class="terms-text highlight">
            Verificamos la edad durante el registro y compra. Cualquier intento de falsificar la edad resultará en la suspensión permanente de la cuenta.
          </p>
          <div class="age-restriction">
            <span class="restriction-icon">🚫</span>
            <span><strong>Restricción Legal:</strong> Solo mayores de 18 años</span>
          </div>
        </div>
      </div>

      <div key="3" class="terms-card">
        <h3 class="terms-subtitle">3. Cuenta de Usuario</h3>
        <div class="terms-text-container">
          <p class="terms-text">Para acceder a funciones completas, debe crear una cuenta proporcionando información precisa y actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales.</p>
          <div class="account-rules">
            <div class="rule-item">🔐 Mantenga su contraseña segura</div>
            <div class="rule-item">📧 Use información verídica</div>
            <div class="rule-item">🚫 No comparta su cuenta</div>
            <div class="rule-item">⚠️ Reporte actividad actividad sospechosa</div>
          </div>
        </div>
      </div>

      <div key="4" class="terms-card">
        <h3 class="terms-subtitle">4. Pedidos y Pagos</h3>
        <div class="terms-text-container">
          <p class="terms-text">Todos los pedidos están sujetos a disponibilidad y aprobación. Los precios mostrados incluyen impuestos aplicables. Aceptamos múltiples métodos de pago seguros.</p>
          <p class="terms-text">Los pagos son procesados inmediatamente. No se procesan reembolsos excepto en casos de productos defectuosos o errores de envío.</p>
          <div class="payment-methods">
            <div class="method-item">💳 Tarjetas de Crédito/Débito</div>
            <div class="method-item">💰 PayPal</div>
            <div class="method-item">🏦 Transferencia Bancaria</div>
          </div>
        </div>
      </div>

      <div key="5" class="terms-card">
        <h3 class="terms-subtitle">5. Envíos y Entregas</h3>
        <div class="terms-text-container">
          <p class="terms-text">Los tiempos de entrega varían según la ubicación. Requiere firma del receptor mayor de edad para productos alcohólicos. No entregamos a direcciones sin supervisión adulta.</p>
          <p class="terms-text important">En caso de ausencia del receptor, el paquete será devuelto y se aplicarán costos adicionales de reenvío.</p>
          <div class="delivery-badge">
            <span class="badge-icon">📦</span>
            <span>Entrega con Verificación de Edad</span>
          </div>
        </div>
      </div>

      <div key="6" class="terms-card">
        <h3 class="terms-subtitle">6. Cancelaciones y Reembolsos</h3>
        <div class="terms-text-container">
          <p class="terms-text">Puede cancelar pedidos dentro de 2 horas posteriores a la compra, antes del procesamiento. Después de procesado, no se aceptan cancelaciones.</p>
          <p class="terms-text">Reembolsos completos solo para productos no entregados o defectuosos. El proceso toma 5-10 días hábiles.</p>
          <div class="refund-policy">
            <div class="policy-item success">✅ Productos defectuosos</div>
            <div class="policy-item success">✅ No entregados</div>
            <div class="policy-item denied">❌ Cambio de opinión</div>
            <div class="policy-item denied">❌ Después del envío</div>
          </div>
        </div>
      </div>

      <div key="7" class="terms-card">
        <h3 class="terms-subtitle">7. Consumo Responsable</h3>
        <div class="terms-text-container">
          <p class="terms-text highlight">Promovemos el consumo responsable de alcohol. No alentamos el abuso ni la compra para terceros no autorizados.</p>
          <p class="terms-text">Violaciones a leyes de control de alcohol resultan en suspensión de cuenta y posible reporte a autoridades.</p>
          <div class="responsibility-warning">
            <span class="warning-icon">⚠️</span>
            <span>Consuma con responsabilidad - No abuse del alcohol</span>
          </div>
        </div>
      </div>

      <div key="8" class="terms-card">
        <h3 class="terms-subtitle">8. Propiedad Intelectual</h3>
        <div class="terms-text-container">
          <p class="terms-text">Todo el contenido del sitio (imágenes, textos, marcas) es propiedad de BRAZZINO'S o sus licenciantes. Prohibida la reproducción sin autorización.</p>
          <p class="terms-text">Las marcas registradas no pueden usarse sin permiso expreso por escrito.</p>
          <div class="ip-badge">
            <span class="badge-icon">©</span>
            <span>Todos los derechos reservados</span>
          </div>
        </div>
      </div>

      <div key="9" class="terms-card final-card">
        <h3 class="terms-subtitle">9. Limitación de Responsabilidad</h3>
        <div class="terms-text-container">
          <p class="terms-text">BRAZZINO'S no se responsabiliza por daños indirectos, pérdidas de datos o uso indebido de productos. Máxima responsabilidad limitada al valor del pedido.</p>
          <p class="terms-text important">
            No garantizamos disponibilidad constante del sitio ni interrupciones técnicas ocasionales.
          </p>
        </div>
      </div>

      <div key="10" class="terms-card contact-card">
        <h3 class="terms-subtitle">10. Contacto y Ley Aplicable</h3>
        <div class="terms-text-container">
          <p class="terms-text">Estos términos se rigen por las leyes de Colombia. Cualquier disputa se resolverá en tribunales de Bogotá.</p>
          <p class="terms-text">Para consultas: <a href="mailto:legal@brazzinos.com" class="contact-link">legal@brazzinos.com</a></p>
          <p class="terms-date">Última actualización: <span class="date-highlight">17 de octubre de 2025</span></p>
        </div>
        <div class="contact-actions">
          <button class="policy-btn" @click="scrollToPolicy">
            📜 Ver Política de Privacidad
          </button>
        </div>
      </div>
    </TransitionGroup>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// AGREGAR AL <script setup>
// Función para scroll a política
const scrollToPolicy = () => {
  document.getElementById('politica')?.scrollIntoView({ 
    behavior: 'smooth', block: 'start' 
  })
}

// Observer para animaciones al scroll (agregar si no existe)
onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined') {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    }, observerOptions)
    
    const termsCards = document.querySelectorAll('.terms-card')
    termsCards.forEach(card => observer.observe(card))
  }
})
// AGREGAR ESTAS FUNCIONES AL <script setup>

// Función para scroll suave al footer
const scrollToContact = () => {
  document.getElementById('contactanos')?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}

// Opcional: Observer para animaciones al scroll
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate')
      }
    })
  }, observerOptions)
  
  // Observar todas las policy-cards
  const policyCards = document.querySelectorAll('.policy-card')
  policyCards.forEach(card => observer.observe(card))
})
const route = useRoute()
const router = useRouter()

const imagenes = [
  "https://capasdelatierra.win/wp-content/uploads/bebidas-alcoholicas.jpg",
  "https://www.blasbermejo.com/wp-content/uploads/2022/12/clasificacion-bebidas-alcoholicas.jpg",
  "https://images.squarespace-cdn.com/content/v1/66e9d7dd116b1a1677dd8758/17c60a9d-89eb-44f9-9484-8989deefa378/PNG+image.jpeg"
]

const imagenesCatalogo = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4sJIOk7YAVvCtg_lR47hL-AWJWmxCeIXreQ&s",
    alt: "Bebida 1",
    titulo: "Vodka Premium",
    descripcion: "Tiene un sabor neutro y suave, aunque algunas variedades pueden tener un sabor ligeramente dulce o herbal.",
    precio: "$85,000"
  },
  {
    src: "https://muttsmousers.ca/media/catalog/product/cache/6ab565c3c7e8d6f3f386bd0dc87c9acc/d/o/dog_perignon_gift_set2_grande2.jpg",
    alt: "Bebida 2",
    titulo: "Dom Pérignon",
    descripcion: "Se produce a partir de una selección de las mejores uvas de la región de Champagne, Francia, y se elabora utilizando métodos tradicionales y una atención meticulosa al detalle.",
    precio: "$450,000"
  },
  {
    src: "https://static.wixstatic.com/media/477dc5_b15de143c3884b26843471907ffe9fc8~mv2.png/v1/fill/w_560,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/477dc5_b15de143c3884b26843471907ffe9fc8~mv2.png",
    alt: "Bebida 3",
    titulo: "Buchanan's 12 Años",
    descripcion: "Buchanan's es un whisky escocés de mezcla, lo que significa que se produce a partir de una combinación de whiskies de diferentes edades y estilos",
    precio: "$120,000"
  },
  {
    src: "https://lacaretalicores.com/cdn/shop/files/WhatsAppImage2024-05-21at4.36.34PM.jpg?v=1716330847",
    alt: "Bebida 4",
    titulo: "Buchanan's 18 Años",
    descripcion: "Buchanan's es un whisky escocés de mezcla, lo que significa que se produce a partir de una combinación de whiskies de diferentes edades y estilos",
    precio: "$180,000"
  },
]

// Estado del carrusel
const actual = ref(0)
let intervalo = null

// Estado de autenticación y roles
const isAuthenticated = ref(false)
const userName = ref('')
const userRole = ref('') // 'user', 'vip', 'premium', 'admin'
const userData = ref(null)
const showUserModal = ref(false)

// Estados para dinámica del modal
const activeSection = ref(null)
const expandedSections = ref({
  profile: true,
  personal: true,
  orders: true,
  financial: true
})
const showAllOrders = ref(false)
const showProfilePrompt = ref(false)

// Estados para recarga de saldo
const showRechargeModal = ref(false)
const rechargeAmount = ref(0)
const selectedPaymentMethod = ref('')

// Estado para producto actual (para navegación a /compra)
const currentProduct = ref(null)
const currentProductPrice = ref('')

// Estados para notificación
const showNotification = ref(false)
const notificationMessage = ref('')

// Computed para verificar si es página de auth
const isAuthPage = computed(() => {
  return route.meta?.hideNavigation || route.name === 'login' || route.name === 'catalogo'
})

// Funciones del carrusel
function siguiente() {
  actual.value = (actual.value + 1) % imagenes.length
}

function anterior() {
  actual.value = (actual.value - 1 + imagenes.length) % imagenes.length
}

// Función para generar datos mock de pedidos si no existen
function generateMockOrders(userEmail) {
  const mockOrders = [
    { product: 'Vodka Premium', date: '2025-09-15', amount: '$85,000' },
    { product: "Buchanan's 12 Años", date: '2025-08-20', amount: '$120,000' },
    { product: 'Dom Pérignon', date: '2025-07-10', amount: '$450,000' },
    { product: "Buchanan's 18 Años", date: '2025-06-05', amount: '$180,000' },
    { product: 'Vodka Premium', date: '2025-05-12', amount: '$85,000' },
    { product: "Buchanan's 12 Años", date: '2025-04-18', amount: '$120,000' }
  ]
  const totalSpent = mockOrders.reduce((sum, order) => sum + parseInt(order.amount.replace(/[$,]/g, '')), 0)
  const initialBalance = 2000000 // Saldo inicial mock de $2,000,000
  const balance = initialBalance - totalSpent

  return {
    orders: mockOrders,
    totalSpent,
    balance: Math.max(0, balance) // No saldo negativo
  }
}

// Función para verificar autenticación y roles
function checkAuthStatus() {
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  
  if (token && user) {
    isAuthenticated.value = true
    userData.value = JSON.parse(user)
    userName.value = userData.value.name || userData.value.email || 'Usuario'
    userRole.value = userData.value.role || 'user' // Por defecto 'user'

    // Inicializar address si no existe
    if (!userData.value.address) {
      userData.value.address = { street: '', city: '', zip: '', phone: '' }
    }

    // Añadir datos mock de pedidos si no existen
    if (!userData.value.orders) {
      const mockData = generateMockOrders(userData.value.email)
      userData.value.orders = mockData.orders
      userData.value.totalSpent = mockData.totalSpent
      userData.value.balance = mockData.balance
      localStorage.setItem('user', JSON.stringify(userData.value))
    }
  } else {
    isAuthenticated.value = false
    userName.value = ''
    userRole.value = ''
    userData.value = null
  }
}

// Funciones para roles
function getRoleIcon() {
  const roleIcons = {
    'user': '👤',
    'vip': '⭐',
    'premium': '💎',
    'admin': '👑'
  }
  return roleIcons[userRole.value] || '👤'
}

function getRoleText() {
  const roleTexts = {
    'user': 'Usuario Básico',
    'vip': 'Usuario VIP',
    'premium': 'Usuario Premium',
    'admin': 'Administrador'
  }
  return roleTexts[userRole.value] || 'Usuario'
}

function hasDiscountAccess() {
  return ['vip', 'premium', 'admin'].includes(userRole.value)
}

function getDiscountText() {
  if (userRole.value === 'vip') return '15% dto'
  if (userRole.value === 'premium') return '25% dto'
  if (userRole.value === 'admin') return 'Admin'
  return '20% dto'
}

// Funciones de precios
function getVipPrice(precio) {
  const numericPrice = parseInt(precio.replace(/[$,]/g, ''))
  const discountedPrice = numericPrice * 0.85
  return `$${discountedPrice.toLocaleString()}`
}

function getPremiumPrice(precio) {
  const numericPrice = parseInt(precio.replace(/[$,]/g, ''))
  const discountedPrice = numericPrice * 0.75
  return `$${discountedPrice.toLocaleString()}`
}

// Funciones para dinámica del modal
function toggleSection(section) {
  expandedSections.value[section] = !expandedSections.value[section]
}

function saveProfile() {
  if (!userData.value.address.street || !userData.value.address.city) {
    notificationMessage.value = 'Por favor, completa al menos la dirección y ciudad.'
    showNotification.value = true
    setTimeout(() => showNotification.value = false, 3000)
    return
  }
  localStorage.setItem('user', JSON.stringify(userData.value))
  notificationMessage.value = 'Perfil actualizado exitosamente.'
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 3000)
  showProfilePrompt.value = false
  if (currentProduct.value) {
    // Continuar directamente a página de compra
    navigateToPurchasePage()
    showUserModal.value = false
  }
}

// Función para navegar a la página de compra
function navigateToPurchasePage() {
  if (!currentProduct.value) return
  const productId = currentProduct.value.titulo.replace(/\s+/g, '-').toLowerCase()
  router.push({
    path: '/compra',
    query: {
      productoId: productId,
      titulo: currentProduct.value.titulo,
      precio: currentProductPrice.value,
      role: userRole.value
    }
  })
  // Resetear estado
  currentProduct.value = null
  currentProductPrice.value = ''
}

// Funciones para recarga
function selectPaymentMethod(method) {
  selectedPaymentMethod.value = method
}

function processRecharge() {
  if (!rechargeAmount.value || !selectedPaymentMethod.value) return
  const amount = parseInt(rechargeAmount.value)
  if (isNaN(amount) || amount < 10000) {
    notificationMessage.value = 'Monto mínimo $10,000'
    showNotification.value = true
    setTimeout(() => showNotification.value = false, 3000)
    return
  }
  // Simular procesamiento de pago
  setTimeout(() => {
    userData.value.balance += amount
    localStorage.setItem('user', JSON.stringify(userData.value))
    notificationMessage.value = `¡Recarga exitosa por $${amount.toLocaleString()} con ${selectedPaymentMethod.value}! Nuevo saldo: $${userData.value.balance.toLocaleString()}`
    showNotification.value = true
    setTimeout(() => showNotification.value = false, 3000)
    showRechargeModal.value = false
    rechargeAmount.value = 0
    selectedPaymentMethod.value = ''
  }, 1000)
}

// Función de logout
function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  userName.value = ''
  userRole.value = ''
  userData.value = null
  showUserModal.value = false
  activeSection.value = null
  expandedSections.value = { profile: true, personal: true, orders: true, financial: true }
  showAllOrders.value = false
  showRechargeModal.value = false
  showProfilePrompt.value = false
  rechargeAmount.value = 0
  selectedPaymentMethod.value = ''
  currentProduct.value = null
  currentProductPrice.value = ''
  router.push('/login')
}

// Funciones de acciones de productos
function addToCart(producto) {
  const roleActions = {
    'user': () => alert(`Contacta con nosotros para adquirir ${producto.titulo}`),
    'vip': () => alert(`${producto.titulo} agregado al carrito VIP con 15% descuento!`),
    'premium': () => alert(`${producto.titulo} agregado al carrito Premium con 25% descuento!`),
    'admin': () => alert(`Producto ${producto.titulo} - Vista de administrador`)
  }
  
  const action = roleActions[userRole.value] || roleActions['user']
  action()
}

function buyNow(producto) {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  // Verificar si la dirección está completa
  if (!userData.value.address || !userData.value.address.street || !userData.value.address.city) {
    showProfilePrompt.value = true
    activeSection.value = 'profile'
    showUserModal.value = true
    currentProduct.value = producto
    currentProductPrice.value = userRole.value === 'vip' ? getVipPrice(producto.precio) : userRole.value === 'premium' ? getPremiumPrice(producto.precio) : producto.precio
    return
  }
  // Si todo está listo, navegar directamente a /compra
  currentProduct.value = producto
  currentProductPrice.value = userRole.value === 'vip' ? getVipPrice(producto.precio) : userRole.value === 'premium' ? getPremiumPrice(producto.precio) : producto.precio
  navigateToPurchasePage()
}

function editProduct(producto) {
  alert(`Editando producto: ${producto.titulo} - Funcionalidad de administrador`)
}

function viewStats(producto) {
  alert(`Viendo estadísticas de: ${producto.titulo} - Funcionalidad de administrador`)
}

// Watchers y lifecycle
watch(() => route.path, () => {
  checkAuthStatus()
}, { immediate: true })

onMounted(() => {
  checkAuthStatus()
  
  // Simular diferentes tipos de usuarios para testing
  // Puedes eliminar esto en producción
  const mockUsers = {
    'admin@test.com': { 
      name: 'Admin User', 
      email: 'admin@test.com', 
      role: 'admin',
      address: { street: 'Calle Admin 123', city: 'Bogotá', zip: '11001', phone: '+57 300 000 000' }
    },
    'vip@test.com': { 
      name: 'VIP User', 
      email: 'vip@test.com', 
      role: 'vip',
      address: { street: 'Calle VIP 456', city: 'Medellín', zip: '05001', phone: '+57 300 111 111' }
    },
    'premium@test.com': { 
      name: 'Premium User', 
      email: 'premium@test.com', 
      role: 'premium',
      address: { street: 'Calle Premium 789', city: 'Cali', zip: '76001', phone: '+57 300 222 222' }
    },
    'user@test.com': { 
      name: 'Basic User', 
      email: 'user@test.com', 
      role: 'user',
      address: { street: '', city: '', zip: '', phone: '' }
    }
  }
  
  // Para testing, puedes setear un user mock
  // localStorage.setItem('authToken', 'mock-token')
  // localStorage.setItem('user', JSON.stringify(mockUsers['user@test.com']))
  
  if (!isAuthPage.value) {
    intervalo = setInterval(siguiente, 5000)
  }
})

onUnmounted(() => {
  if (intervalo) {
    clearInterval(intervalo)
  }
})

watch(isAuthPage, (newValue) => {
  if (newValue && intervalo) {
    clearInterval(intervalo)
    intervalo = null
  } else if (!newValue && !intervalo) {
    intervalo = setInterval(siguiente, 5000)
  }
})
</script>

<style scoped>
/* AGREGAR ESTOS ESTILOS AL <style scoped> */

/* BOTÓN PRINCIPAL DE TÉRMINOS */
.terms-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(255, 215, 0, 0.1));
  color: #FFD700;
  text-decoration: none;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.terms-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
  transition: left 0.6s ease;
  z-index: -1;
}

.terms-btn:hover::before {
  left: 100%;
}

.terms-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(139, 69, 19, 0.9));
  border-color: #FFD700;
  color: #1a1a1a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 12px 30px rgba(255, 215, 0, 0.4),
    0 0 25px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.terms-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.terms-btn:hover .btn-icon {
  transform: rotate(10deg) scale(1.1);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #FFD700, #FF4500, #FFD700);
  border-radius: 14px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
  filter: blur(8px);
}

.terms-btn:hover .btn-glow {
  opacity: 1;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
}

/* EFECTO DE RIPPLE AL CLICK */
.terms-btn {
  position: relative;
  overflow: hidden;
}

.terms-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  z-index: -1;
}

.terms-btn:active::after {
  width: 300px;
  height: 300px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .terms-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
    gap: 0.5rem;
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
}

/* ANIMACIÓN DE ENTRADA */
.terms-btn {
  animation: btn-slide-in 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes btn-slide-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* AGREGAR AL <style scoped> */

/* ANIMACIONES DE TRANSICIÓN */
.terms-header-enter-active,
.terms-header-appear-active {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.terms-header-enter-from,
.terms-header-appear-from {
  opacity: 0;
  transform: translateY(-60px) scale(0.95);
}

.terms-card-enter-active,
.terms-card-appear-active {
  transition: all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.terms-card-enter-from,
.terms-card-appear-from {
  opacity: 0;
  transform: translateX(-120px) rotateY(-15deg);
}

.terms-card-enter-to,
.terms-card-appear-to {
  opacity: 1;
  transform: translateX(0) rotateY(0deg);
}

/* ESTILOS BASE */
.terms-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
  background: rgba(15, 15, 15, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.15);
  backdrop-filter: blur(25px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
}

.terms-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FFD700, #8B4513, #FF4500, #FFD700);
  animation: terms-glow 4s ease-in-out infinite;
}

@keyframes terms-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  color: #FFD700;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
}

.title-underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #8B4513);
  margin: 0 auto;
  border-radius: 2px;
  animation: underline-pulse 2s ease-in-out infinite;
}

@keyframes underline-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.8); }
}

.terms-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem;
}

.terms-card {
  background: rgba(25, 25, 25, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 18px;
  padding: 2.5rem;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(60px);
}

.terms-card.animate {
  opacity: 1;
  transform: translateY(0);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.terms-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.08), transparent);
  transition: left 0.8s ease;
}

.terms-card:hover::before {
  left: 100%;
}

.terms-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 20px 50px rgba(255, 215, 0, 0.2),
    0 0 40px rgba(255, 215, 0, 0.1);
}

.terms-card.contact-card,
.terms-card.final-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.06), rgba(139, 69, 19, 0.06));
  border-color: rgba(255, 215, 0, 0.3);
  animation: important-pulse 3s ease-in-out infinite alternate;
}

@keyframes important-pulse {
  0% { border-color: rgba(255, 215, 0, 0.3); }
  100% { border-color: rgba(255, 215, 0, 0.5); }
}

.terms-subtitle {
  color: #FFD700;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-left: 5px solid #8B4513;
  padding-left: 1.2rem;
  position: relative;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.terms-subtitle::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #FFD700, #8B4513);
  transition: width 0.5s ease;
}

.terms-card:hover .terms-subtitle::after {
  width: 80%;
}

.terms-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.2rem;
  animation: text-slide 0.7s ease forwards;
}

@keyframes text-slide {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.terms-text.important {
  color: #FFD700;
  font-weight: 600;
  background: rgba(255, 215, 0, 0.05);
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #8B4513;
}

.terms-text.highlight {
  background: rgba(139, 69, 19, 0.1);
  border-left: 4px solid #FFD700;
  padding: 1.2rem;
  border-radius: 10px;
  margin: 1.5rem 0;
  animation: highlight-shine 3s ease-in-out infinite;
}

@keyframes highlight-shine {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
}

/* ELEMENTOS ESPECIALES */
.acceptance-badge,
.age-restriction,
.account-rules,
.payment-methods,
.delivery-badge,
.refund-policy,
.responsibility-warning,
.ip-badge {
  margin-top: 1.5rem;
  animation: slide-up-special 0.9s ease forwards;
}

@keyframes slide-up-special {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.acceptance-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(46, 125, 50, 0.15));
  padding: 1.2rem;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.4);
  color: #4CAF50;
  font-weight: 700;
}

.age-restriction {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.2));
  padding: 1.2rem;
  border-radius: 12px;
  border: 2px solid rgba(244, 67, 54, 0.5);
  color: #f44336;
  font-weight: 700;
  animation: restriction-shake 3s ease-in-out infinite;
}

@keyframes restriction-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.account-rules,
.payment-methods,
.refund-policy {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.rule-item,
.method-item,
.policy-item {
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #FFD700;
  background: rgba(255, 215, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.rule-item:hover,
.method-item:hover {
  background: rgba(255, 215, 0, 0.1);
  transform: translateX(8px);
}

.policy-item.success {
  border-left-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.policy-item.denied {
  border-left-color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.delivery-badge,
.ip-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(33, 150, 243, 0.15);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(33, 150, 243, 0.4);
  color: #2196F3;
  font-weight: 600;
}

.responsibility-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 87, 34, 0.2));
  padding: 1.2rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 152, 0, 0.5);
  color: #FF9800;
  font-weight: 700;
  animation: warning-pulse 2.5s ease-in-out infinite;
}

@keyframes warning-pulse {
  0% { border-color: rgba(255, 152, 0, 0.3); }
  100% { border-color: rgba(255, 152, 0, 0.6); }
}

.internal-link,
.contact-link {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
}

.internal-link::after,
.contact-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD700, #8B4513);
  transition: width 0.4s ease;
}

.internal-link:hover::after,
.contact-link:hover::after {
  width: 100%;
}

.terms-date {
  color: rgba(255, 215, 0, 0.7);
  font-style: italic;
  margin-top: 1.5rem;
  text-align: right;
}

.date-highlight {
  color: #FFED4E;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 237, 78, 0.5);
}

.contact-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.contact-btn,
.policy-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  border: none;
  font-size: 1rem;
  animation: btn-glow 2.5s ease-in-out infinite alternate;
}

.contact-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.3);
}

.policy-btn {
  background: linear-gradient(135deg, #FFD700, #8B4513);
  color: #1a1a1a;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

@keyframes btn-glow {
  0% { box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3); }
  100% { box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4); }
}

.contact-btn:hover,
.policy-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.5);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .terms-section {
    padding: 3rem 1rem;
    margin: 0 1rem 2rem;
  }
  
  .terms-card {
    padding: 2rem 1.5rem;
  }
  
  .terms-subtitle {
    font-size: 1.25rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .contact-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .account-rules,
  .payment-methods,
  .refund-policy {
    gap: 0.5rem;
  }
}
/* AGREGAR AL <style scoped> */

/* ANIMACIONES DE TRANSICIÓN */
.policy-header-enter-active,
.policy-header-appear-active {
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.policy-header-enter-from,
.policy-header-appear-from {
  opacity: 0;
  transform: translateY(-50px) scale(0.9);
}

.policy-card-enter-active,
.policy-card-appear-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.policy-card-enter-from,
.policy-card-appear-from {
  opacity: 0;
  transform: translateX(-100px);
}

.policy-card-enter-to,
.policy-card-appear-to {
  opacity: 1;
  transform: translateX(0);
}

/* ESTILOS BASE DE LA SECCIÓN */
.policy-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
  background: rgba(20, 20, 20, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.policy-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFD700, #FF4500, transparent);
  animation: policy-glow 3s ease-in-out infinite alternate;
}

@keyframes policy-glow {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  color: #FFD700;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #FF4500);
  margin: 0 auto;
  border-radius: 2px;
}

.policy-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.policy-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 15px;
  padding: 2.5rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
}

.policy-card.animate {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.policy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  transition: left 0.6s ease;
}

.policy-card:hover::before {
  left: 100%;
}

.policy-card:hover {
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.15);
}

.policy-card.contact-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 69, 0, 0.08));
  border-color: rgba(255, 215, 0, 0.4);
  animation: contact-pulse 2s ease-in-out infinite alternate;
}

@keyframes contact-pulse {
  0% { box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4); }
}

.policy-subtitle {
  color: #FFD700;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-left: 4px solid #FFD700;
  padding-left: 1rem;
  position: relative;
}

.policy-subtitle::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFD700;
  transition: width 0.4s ease;
}

.policy-card:hover .policy-subtitle::after {
  width: 100%;
}

.policy-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1rem;
  animation: text-reveal 0.6s ease forwards;
}

@keyframes text-reveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.policy-text.highlight {
  background: rgba(255, 215, 0, 0.1);
  border-left: 3px solid #FFD700;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  animation: highlight-glow 2s ease-in-out infinite alternate;
}

@keyframes highlight-glow {
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
}

.policy-text.important {
  color: #FFD700;
  font-weight: 600;
}

/* ELEMENTOS ESPECIALES */
.security-badge {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(76, 175, 80, 0.2);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #4CAF50;
  font-weight: 600;
  margin-top: 1rem;
  animation: slide-up 0.8s ease 0.3s both;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.badge-icon {
  font-size: 1.2rem;
  animation: lock-bounce 2s ease-in-out infinite;
}

@keyframes lock-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.rights-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  animation: slide-up 0.8s ease 0.4s both;
}

.right-item {
  background: rgba(255, 215, 0, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  border-left: 3px solid #FFD700;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  cursor: pointer;
}

.right-item:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateX(10px);
}

.contact-link {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
  position: relative;
}

.contact-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFD700;
  transition: width 0.3s ease;
}

.contact-link:hover::after {
  width: 100%;
}

.policy-date {
  color: rgba(255, 215, 0, 0.8);
  font-style: italic;
  margin-top: 1rem;
}

.date-highlight {
  color: #FFED4E;
  font-weight: 700;
}

.contact-actions {
  margin-top: 2rem;
  text-align: center;
}

.contact-btn {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #1a1a1a;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  animation: btn-glow 2s ease-in-out infinite alternate;
}

@keyframes btn-glow {
  0% { box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 5px 25px rgba(255, 215, 0, 0.5); }
}

.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .policy-section {
    padding: 3rem 1rem;
    margin: 0 1rem 2rem;
  }
  
  .policy-card {
    padding: 2rem 1.5rem;
  }
  
  .policy-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
/* Layout de autenticación */
.auth-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Layout principal */
.main-layout {
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

/* Navbar */
.navbar {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.5rem 2rem;
  position: relative;
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
  text-shadow: 
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.3);
  background: linear-gradient(135deg, #FFD700, #FF4500);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.admin-link {
  background: rgba(139, 69, 19, 0.2);
  border-color: rgba(139, 69, 19, 0.3);
}

.admin-link:hover {
  background: rgba(139, 69, 19, 0.3);
  border-color: #8B4513;
  color: #D2691E;
}

.nav-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 5px currentColor);
}

/* Usuario autenticado */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-welcome:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-role {
  font-size: 0.7rem;
  color: rgba(255, 215, 0, 0.7);
  font-weight: 400;
}

.welcome-icon {
  font-size: 1.1rem;
  margin-right: 0.2rem;
}

.logout-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.5);
}

.logout-icon {
  font-size: 1rem;
}

/* Botón de login */
.login-link {
  color: rgba(255, 255, 255, 0.9) !important;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.login-link:hover {
  color: #FFD700 !important;
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.login-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 5px currentColor);
}

/* Modal de usuario */
.user-modal-overlay {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.user-modal, .recharge-modal {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.recharge-modal {
  max-width: 500px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.modal-title {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
}

.modal-body {
  padding: 0 2rem 2rem;
}

/* Estilos para perfil */
.profile-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #FFD700;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.save-profile-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.profile-prompt {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid #FFD700;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
}

.profile-prompt p {
  color: #FFD700;
  margin: 0;
}

/* Estilos para recarga */
.recharge-amount {
  margin-bottom: 2rem;
}

.recharge-amount label {
  display: block;
  color: #FFD700;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.recharge-amount input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.recharge-amount input::placeholder {
  color: rgba(255, 255, 0.5);
}

.payment-methods h3 {
  color: #FFD700;
  margin-bottom: 1rem;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.method-option:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

.method-icon {
  font-size: 1.5rem;
}

.method-info h4 {
  color: #FFD700;
  margin: 0 0 0.3rem;
}

.method-info p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
}

.confirm-recharge-btn {
  width: 100%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.confirm-recharge-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.confirm-recharge-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Estilos compartidos para modales de usuario */
.user-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
}

.user-section:hover {
  background: rgba(255, 215, 0, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin: 0 -1rem 2rem;
}

.user-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.3s ease;
}

.section-title:hover {
  color: #FFED4E;
}

.toggle-icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.section-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.user-details,
.financial-details {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
}

.user-details:hover,
.financial-details:hover {
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1);
}

.user-details p,
.financial-details p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.user-details strong,
.financial-details strong {
  color: #FFD700;
}

.orders-list {
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 3px solid #FFD700;
  transition: all 0.3s ease;
  cursor: pointer;
}

.order-item:hover {
  background: rgba(255, 215, 0, 0.05);
  transform: translateX(5px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.order-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.order-product {
  color: #FFD700;
  font-weight: 600;
}

.order-amount {
  color: rgba(255, 215, 0, 0.8);
  font-size: 0.95rem;
  text-align: right;
}

.more-orders {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-style: italic;
}

.expand-btn {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.expand-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.05);
}

.no-orders {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
}

.financial-actions {
  margin-top: 1rem;
  text-align: center;
}

.recharge-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.recharge-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.section-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.nav-btn {
  background: rgba(255, 215, 0, 0.1);
  color: rgba(255, 215, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.nav-btn:hover,
.nav-btn.active {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border-color: #FFD700;
  transform: translateY(-1px);
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.close-modal-btn {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 69, 0, 0.1));
  color: #FFD700;
  border: 2px solid rgba(255, 215, 0, 0.3);
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-modal-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* Hero Carousel */
.hero-carousel {
  position: relative;
  height: 80vh;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: all 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(139, 69, 19, 0.3) 25%,
    rgba(255, 69, 0, 0.2) 50%,
    rgba(255, 215, 0, 0.1) 75%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.slide-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #FFD700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  letter-spacing: 4px;
}

.slide-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

/* Controles del carrusel */
.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  transform: translateY(-50%);
  z-index: 3;
}

.carousel-btn {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
}

/* Indicadores */
.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
}

/* Secciones de contenido */
.content-sections {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 3rem;
}

.info-card {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.info-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}

.card-header {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 69, 0, 0.1));
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.card-title {
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.card-content {
  padding: 2rem;
}

.card-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.card-content p:last-child {
  margin-bottom: 0;
}

/* Sección del catálogo */
.catalog-section {
  padding: 5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  color: #FFD700;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #FF4500);
  margin: 0 auto;
  border-radius: 2px;
}

/* Grid de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.product-card {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

.product-info {
  padding: 2rem;
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

/* Estilos específicos por rol */

/* Login prompt - usuarios no autenticados */
.login-prompt {
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding-top: 1.5rem;
  text-align: center;
}

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

/* Vista usuario autenticado */
.authenticated-user-view {
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding-top: 1.5rem;
}

.price-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.discounted-price {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.price-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.price-value {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.price-value.vip {
  color: #FFD700;
  font-size: 1.4rem;
  font-weight: 800;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
}

.price-value.premium {
  color: #E6E6FA;
  font-size: 1.4rem;
  font-weight: 800;
  text-shadow: 0 0 15px rgba(230, 230, 250, 0.7);
}

.product-actions {
  display: flex;
  justify-content: center;
}

.buy-now-btn {
  background: linear-gradient(135deg, #FF6B6B, #EE5A52);
  color: white;
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
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.buy-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
  background: linear-gradient(135deg, #EE5A52, #DC3545);
}

.buy-icon {
  font-size: 1rem;
}

/* Footer del catálogo */
.catalog-footer {
  text-align: center;
}

.view-catalog-btn {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 69, 0, 0.1));
  backdrop-filter: blur(20px);
  color: #FFD700;
  text-decoration: none;
  padding: 1.5rem 3rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.view-catalog-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 69, 0, 0.2));
  border-color: #FFD700;
  color: #FFD700;
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
}

.catalog-icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

/* Footer */
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
  .navbar-content {
    padding: 0 1rem;
  }
  
  .brand-title {
    font-size: 2.5rem;
  }
  
  .content-sections {
    grid-template-columns: 1fr;
    padding: 3rem 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
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
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
  
  .brand-title {
    font-size: 2rem;
    text-align: center;
    width: 100%;
  }
  
  .hero-carousel {
    height: 60vh;
  }
  
  .slide-title {
    font-size: 2.5rem;
  }
  
  .slide-subtitle {
    font-size: 1.2rem;
  }
  
  .carousel-controls {
    padding: 0 1rem;
  }
  
  .carousel-btn {
    width: 50px;
    height: 50px;
  }
  
  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
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
  
  .product-actions {
    flex-direction: column;
  }
  
  .contact-methods {
    flex-direction: column;
    align-items: center;
  }

  .user-modal, .recharge-modal {
    width: 95%;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem 1.5rem 0.5rem;
  }

  .modal-body {
    padding: 0 1.5rem 1.5rem;
  }

  .modal-footer {
    padding: 0.5rem 1.5rem 1.5rem;
  }

  .user-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .orders-list {
    max-height: 150px;
  }

  .order-item {
    padding: 0.6rem;
  }

  .section-nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .method-option {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .recharge-amount input {
    font-size: 1.1rem;
  }

  .profile-form {
    grid-template-columns: 1fr;
  }

  .form-group input {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.8rem;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .nav-link,
  .login-link {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
  
  .hero-carousel {
    height: 50vh;
  }
  
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-subtitle {
    font-size: 1rem;
  }
  
  .info-card {
    margin: 0 0.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .product-info {
    padding: 1.5rem;
  }
  
  .view-catalog-btn {
    padding: 1.2rem 2rem;
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
  
  .user-info {
    align-items: center;
    text-align: center;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .user-details p,
  .financial-details p {
    font-size: 0.95rem;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-amount {
    text-align: left;
  }

  .toggle-icon {
    font-size: 0.7rem;
  }

  .profile-prompt p {
    font-size: 0.9rem;
  }
}
/* BOTÓN PRINCIPAL DE TÉRMINOS Y LOGOUT */
.main-nav-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(255, 215, 0, 0.1));
  color: #FFD700;
  text-decoration: none;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.main-nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
  transition: left 0.6s ease;
  z-index: -1;
}

.main-nav-btn:hover::before {
  left: 100%;
}

.main-nav-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(139, 69, 19, 0.9));
  border-color: #FFD700;
  color: #1a1a1a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 12px 30px rgba(255, 215, 0, 0.4),
    0 0 25px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.main-nav-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.main-nav-btn:hover .btn-icon {
  transform: rotate(10deg) scale(1.1);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #FFD700, #FF4500, #FFD700);
  border-radius: 14px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
  filter: blur(8px);
}

.main-nav-btn:hover .btn-glow {
  opacity: 1;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
}

/* EFECTO DE RIPPLE AL CLICK */
.main-nav-btn {
  position: relative;
  overflow: hidden;
}

.main-nav-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  z-index: -1;
}

.main-nav-btn:active::after {
  width: 300px;
  height: 300px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .main-nav-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
    gap: 0.5rem;
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
}

/* ANIMACIÓN DE ENTRADA */
.main-nav-btn {
  animation: btn-slide-in 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes btn-slide-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ESTILOS ESPECÍFICOS PARA LOGOUT */
.logout-btn.main-nav-btn {
  background: linear-gradient(135deg, rgba(178, 34, 34, 0.9), rgba(255, 69, 0, 0.1));
  border: 2px solid rgba(255, 69, 0, 0.3);
  box-shadow: 
    0 5px 15px rgba(178, 34, 34, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.logout-btn.main-nav-btn:hover {
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(178, 34, 34, 0.9));
  border-color: #FF4500;
  color: #ffffff;
  box-shadow: 
    0 12px 30px rgba(255, 69, 0, 0.4),
    0 0 25px rgba(255, 69, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.logout-btn.main-nav-btn .btn-glow {
  background: linear-gradient(45deg, #FF4500, #FFD700, #FF4500);
}

/* Estilos para la notificación */
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

.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>