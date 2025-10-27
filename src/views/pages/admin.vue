<template>
  <!-- Loading Overlay -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
    <p>Cargando...</p>
  </div>
  <!-- Layout principal para la página de administrador -->
  <div class="main-layout" :class="{ 'light-mode': isLightMode }">
    <!-- Fondo animado -->
    <div class="background-overlay"></div>

    <!-- Barra de navegación simplificada -->
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="brand-title">BRAZZINO'S - Admin</h1>
        <div class="nav-section">
          <div class="nav-links">
            <a href="#notifications" class="nav-link">
              <span class="notification-icon">🔔</span>
              <span v-if="unreadNotifications.length" class="notification-badge animate-pulse">{{ unreadNotifications.length }}</span>
            </a>
            <a href="#theme-toggle" class="nav-link" @click.prevent="toggleTheme">
              <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
            </a>
          </div>
          <div v-if="isAuthenticated" class="user-menu">
            <div class="user-welcome">
              <span class="welcome-icon">👑</span>
              <div class="user-info">
                <span class="welcome-text">Hola, {{ userName }}!</span>
                <span class="user-role">Administrador</span>
              </div>
            </div>
            <button @click="logout" class="logout-btn">
              <span class="logout-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenedor con scroll -->
    <div class="content-scroll">
      <!-- Dashboard de Estadísticas -->
      <div id="dashboard" class="catalog-section">
        <!-- Gráficos de Estadísticas -->
        <div class="charts-section">
          <div class="chart-card">
            <h3>Ventas por Mes</h3>
            <canvas ref="salesChart"></canvas>
          </div>
          <div class="chart-card">
            <h3>Stock por Categoría</h3>
            <canvas ref="stockChart"></canvas>
          </div>
          <div class="chart-card">
            <h3>Usuarios Activos vs Inactivos</h3>
            <canvas ref="userChart"></canvas>
          </div>
        </div>
        <div class="section-header">
          <h2 class="section-title">📊 Dashboard</h2>
          <div class="title-underline"></div>
        </div>
        <div class="dashboard-grid">
          <div class="stat-card">
            <h3>Total Productos</h3>
            <p>{{ products.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Pedidos</h3>
            <p>{{ orders.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Ventas</h3>
            <p>{{ totalSales }}</p>
          </div>
          <div class="stat-card">
            <h3>Usuarios Activos</h3>
            <p>{{ activeUsers }}</p>
          </div>
          <div class="stat-card">
            <h3>Pedidos Pendientes</h3>
            <p>{{ pendingOrders }}</p>
          </div>
          <div class="stat-card">
            <h3>Productos con Bajo Stock</h3>
            <p>{{ lowStockProducts }}</p>
          </div>
          <div class="stat-card">
            <h3>Ticket Abiertos</h3>
            <p>{{ openTickets }}</p>
          </div>
        </div>
      </div>
      <!-- Sidebar de Filtros -->
      <div class="filters-sidebar" :class="{ 'active': showFilters }">
        <button @click="showFilters = !showFilters" class="filters-toggle">
          🔧 Filtros
        </button>
        <div v-if="showFilters" class="filters-content">
          <h3>Filtrar Productos</h3>
          
          <div class="filter-group">
            <label>Rango de Precio</label>
            <input v-model="priceRange.min" type="number" placeholder="Mín">
            <input v-model="priceRange.max" type="number" placeholder="Máx">
          </div>
          
          <div class="filter-group">
            <label>Stock</label>
            <select v-model="stockFilter">
              <option value="">Todos</option>
              <option value="low">Bajo stock</option>
              <option value="out">Sin stock</option>
              <option value="good">Stock bueno</option>
            </select>
          </div>
          
          <button @click="applyFilters" class="apply-filters-btn">
            Aplicar Filtros
          </button>
          <button @click="clearFilters" class="clear-filters-btn">
            Limpiar
          </button>
        </div>
      </div>

      <!-- Gestión de Productos -->
      <div id="products" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">🛍️ Gestión de Productos e Inventario</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="productSearchQuery" placeholder="🔍 Buscar productos por nombre..." />
          <select v-model="stockFilter">
            <option value="">Todos los stocks</option>
            <option value="low">Bajo stock (menos de 10)</option>
            <option value="out">Sin stock</option>
          </select>
          <button @click="openProductModal(null)" class="add-btn">➕ Agregar Producto</button>
          <button @click="exportProducts" class="export-btn">📥 Exportar Productos a CSV</button>
          <button @click="exportProductsPDF" class="export-btn">📥 Exportar a PDF</button>
        </div>
        <div class="products-grid">
          <div class="product-card" v-for="(product, index) in filteredProducts" :key="index">
            <div class="card-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="image-overlay"></div>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <p class="product-description">Stock: {{ product.stock }} unidades</p>
              <p class="product-description">Categoría: {{ product.category }}</p>
              <div class="admin-user-view">
                <div class="admin-controls">
                  <div class="price-display admin-price">
                    <span class="price-label">Precio:</span>
                    <span class="price-value admin">{{ product.price }}</span>
                  </div>
                  <div class="admin-actions">
                    <button class="edit-product-btn" @click="openProductModal(product)">
                      <span class="edit-icon">✏️</span>
                      Editar
                    </button>
                    <button class="delete-btn" @click="deleteProduct(index)">
                      <span class="delete-icon">🗑️</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Gestión de Categorías -->
<div id="categories" class="catalog-section">
  <div class="section-header">
    <h2 class="section-title">📋 Gestión de Categorías</h2>
    <div class="title-underline"></div>
  </div>
  <div class="search-bar">
    <input v-model="categorySearchQuery" placeholder="🔍 Buscar categorías..." />
    <button @click="openCategoryModal(null)" class="add-btn">➕ Agregar Categoría</button>
  </div>
  <div class="categories-grid" v-if="filteredCategories.length > 0">
    <draggable v-model="filteredCategories" @end="saveCategoryOrder" item-key="name">
      <template #item="{ element }">
        <div class="category-card">
          <h3 class="category-title">{{ element.name }}</h3>
          <p class="category-description">Productos: {{ element.productCount }}</p>
          <div class="admin-actions">
            <button class="edit-product-btn" @click="openCategoryModal(element)">
              <span class="edit-icon">✏️</span> Editar
            </button>
            <button class="delete-btn" @click="deleteCategory(categories.indexOf(element))">
              <span class="delete-icon">🗑️</span> Eliminar
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
  <p v-else>No hay categorías registradas.</p>
</div>
      <!-- Gestión de Pedidos -->
      <div id="orders" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">📦 Gestión de Pedidos</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="orderSearchQuery" placeholder="🔍 Buscar pedidos por nombre..." />
          <select v-model="orderStatusFilter">
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
          <button @click="exportOrders" class="export-btn">📥 Exportar Pedidos a CSV</button>
          <button @click="exportOrdersPDF" class="export-btn">📥 Exportar a PDF</button>
        </div>
        <div class="products-grid">
          <div class="product-card" v-for="(order, index) in filteredOrders" :key="index">
            <div class="card-image-container">
              <img :src="order.productImage" :alt="order.productName" class="product-image" />
              <div class="image-overlay"></div>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ order.productName }}</h3>
              <p class="product-description">Usuario: {{ order.userName }} | Estado: {{ order.status }}</p>
              <p class="product-description">Cantidad: {{ order.quantity }}</p>
              <div class="admin-user-view">
                <div class="admin-controls">
                  <div class="price-display admin-price">
                    <span class="price-label">Total:</span>
                    <span class="price-value admin">{{ order.total }}</span>
                  </div>
                  <div class="admin-actions">
                    <button class="edit-product-btn" @click="openOrderUpdateModal(order)">
                      <span class="edit-icon">✏️</span>
                      Actualizar Estado
                    </button>
                    <button class="view-stats-btn" @click="openOrderDetailsModal(order)">
                      <span class="stats-icon">📋</span>
                      Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Gestión de Usuarios -->
      <div id="users" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">👥 Gestión de Usuarios</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="userSearchQuery" placeholder="🔍 Buscar usuarios por nombre..." />
          <select v-model="userRoleFilter">
            <option value="">Todos los roles</option>
            <option value="Cliente">Cliente</option>
            <option value="Administrador">Administrador</option>
          </select>
          <button @click="openUserModal(null)" class="add-btn">➕ Agregar Usuario</button>
          <button @click="exportUsers" class="export-btn">📥 Exportar Usuarios a CSV</button>
          <button @click="exportUsersPDF" class="export-btn">📥 Exportar a PDF</button>
        </div>
        <div class="users-grid">
          <div class="user-card" v-for="(user, index) in filteredUsers" :key="index">
            <div class="user-info">
              <h3 class="product-title">{{ user.name }}</h3>
              <p class="product-description">Email: {{ user.email }} | Rol: {{ user.role }}</p>
              <p class="product-description">Estado: {{ user.status }}</p>
              <div class="admin-user-view">
                <div class="admin-controls">
                  <div class="admin-actions">
                    <button class="edit-product-btn" @click="openUserModal(user)">
                      <span class="edit-icon">✏️</span>
                      Editar
                    </button>
                    <button class="view-stats-btn" @click="toggleUserStatus(user)">
                      <span class="stats-icon">{{ user.status === 'Activo' ? '🔴' : '🟢' }}</span>
                      {{ user.status === 'Activo' ? 'Desactivar' : 'Activar' }}
                    </button>
                    <button class="delete-btn" @click="deleteUser(index)">
                      <span class="delete-icon">🗑️</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Gestión de Promociones -->
      <div id="promotions" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">🎉 Gestión de Promociones</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="promotionSearchQuery" placeholder="🔍 Buscar promociones..." />
          <button @click="openPromotionModal(null)" class="add-btn">➕ Agregar Promoción</button>
        </div>
        <div class="promotions-grid">
          <div class="promotion-card" v-for="(promotion, index) in filteredPromotions" :key="index">
            <h3 class="promotion-title">{{ promotion.name }}</h3>
            <p class="promotion-description">Descuento: {{ promotion.discount }}% | Válido hasta: {{ formatDate(promotion.endDate) }}</p>
            <div class="admin-actions">
              <button class="edit-product-btn" @click="openPromotionModal(promotion)">
                <span class="edit-icon">✏️</span>
                Editar
              </button>
              <button class="delete-btn" @click="deletePromotion(index)">
                <span class="delete-icon">🗑️</span>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Gestión de Notificaciones -->
      <div id="notifications" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">🔔 Notificaciones</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="notificationSearchQuery" placeholder="🔍 Buscar notificaciones..." />
          <select v-model="notificationFilter">
            <option value="">Todas las notificaciones</option>
            <option value="unread">No leídas</option>
            <option value="read">Leídas</option>
          </select>
          <button @click="markAllAsRead" class="add-btn">✅ Marcar todas como leídas</button>
          <button @click="clearAllNotifications" class="delete-btn">🗑️ Eliminar todas</button>
        </div>
        <div class="notifications-grid">
          <div class="notification-card" v-for="(notification, index) in filteredNotifications" :key="index" :class="{ 'unread': !notification.read }" :data-notification-id="notification.id">
            <div class="notification-info">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-message">{{ notification.message }}</p>
              <p class="notification-date">{{ formatDate(notification.timestamp) }}</p>
              <div class="notification-actions">
                <button v-if="!notification.read" @click="markAsRead(index)" class="mark-read-btn">✅ Marcar como leída</button>
                <button @click="deleteNotification(index)" class="delete-notification-btn">🗑️ Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Gestión de Tickets -->
      <div id="tickets" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">💬 Soporte al Cliente</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="ticketSearchQuery" placeholder="🔍 Buscar tickets..." />
          <select v-model="ticketStatusFilter">
            <option value="">Todos los estados</option>
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <div class="tickets-grid">
          <div class="ticket-card" v-for="(ticket, index) in filteredTickets" :key="index">
            <h3 class="ticket-title">{{ ticket.subject }}</h3>
            <p class="ticket-description">Usuario: {{ ticket.userName }} | Estado: {{ ticket.status }}</p>
            <p class="ticket-description">Fecha: {{ formatDate(ticket.createdAt) }}</p>
            <div class="ticket-actions">
              <button class="view-stats-btn" @click="openTicketChat(ticket)">
                <span class="stats-icon">💬</span>
                Ver Chat
              </button>
              <button :class="['status-btn', { 'open': ticket.status === 'Abierto' }]" @click="toggleTicketStatus(ticket, index)">
                {{ ticket.status === 'Abierto' ? 'Cerrar' : 'Abrir' }}
              </button>
            </div>
          </div>
        </div>
      </div>
     <!-- Logs de Actividad -->
      <div id="logs" class="catalog-section">
         <div class="section-header">
          <h2 class="section-title">📜 Logs de Actividad</h2>
          <div class="title-underline"></div>
        </div>
        <div class="search-bar">
          <input v-model="logSearchQuery" placeholder="🔍 Buscar logs..." />
          <select v-model="logFilter">
            <option value="">Todos</option>
            <option value="login">Inicios de Sesión</option>
            <option value="edit">Ediciones</option>
            <option value="delete">Eliminaciones</option>
          </select>
        </div>
        <div class="logs-grid">
          <div class="log-card" v-for="(log, index) in filteredLogs" :key="index" :class="{ 'critical': log.type === 'delete' }">
            <p class="log-message">{{ log.message }}</p>
            <p class="log-date">{{ formatDate(log.timestamp) }} | {{ log.user }}</p>
          </div>
        </div>
      </div>
      <!-- Métodos de Pago -->
      <div id="payment-methods" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">💳 Métodos de Pago</h2>
          <div class="title-underline"></div>
        </div>
        <div class="payment-form">
          <div class="form-group">
            <label>Stripe API Key</label>
            <input v-model="paymentConfig.stripeKey" type="password" placeholder="Clave API Stripe" />
          </div>
          <div class="form-group">
            <label>PayPal Client ID</label>
            <input v-model="paymentConfig.paypalId" type="password" placeholder="ID Cliente PayPal" />
          </div>
          <button @click="savePaymentConfig" class="save-btn">Guardar Configuración</button>
        </div>
      </div>
      <!-- Backup y Restore -->
      <div id="backup" class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">💾 Backup y Restore</h2>
          <div class="title-underline"></div>
        </div>
        <div class="backup-actions">
          <button @click="exportBackup" class="export-btn">📥 Exportar Backup</button>
          <input type="file" ref="backupFile" @change="importBackup" accept=".json" />
          <button @click="$refs.backupFile.click()" class="add-btn">📤 Importar Backup</button>
          <div v-if="backupProgress" class="progress-bar">
            <div :style="{ width: backupProgress + '%' }" class="progress"></div>
          </div>
        </div>
      </div>
<!-- Modal para Detalles de Pedido -->
  <div v-if="showOrderDetailsModal" class="modal-overlay">
    <div class="modal-content order-details-modal">
      <h2>Detalles del Pedido</h2>
      <div class="order-details">
        <img :src="currentOrderForDetails.productImage" :alt="currentOrderForDetails.productName" class="detail-image" />
        <p><strong>Producto:</strong> {{ currentOrderForDetails.productName }}</p>
        <p><strong>Usuario:</strong> {{ currentOrderForDetails.userName }}</p>
        <p><strong>Estado:</strong> {{ currentOrderForDetails.status }}</p>
        <p><strong>Cantidad:</strong> {{ currentOrderForDetails.quantity }}</p>
        <p><strong>Total:</strong> {{ currentOrderForDetails.total }}</p>
      </div>
      <div class="modal-actions">
        <button type="button" @click="closeOrderDetailsModal" class="cancel-btn">Cerrar</button>
      </div>
    </div>
  </div>
      <!-- Modal para Productos -->
      <div v-if="showProductModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>{{ currentProduct ? 'Editar Producto' : 'Agregar Producto' }}</h2>
          <form @submit.prevent="saveProduct">
            <input v-model="productForm.name" placeholder="Nombre del producto" required />
            <input v-model="productForm.image" placeholder="URL de la imagen" required />
            <input v-model="productForm.price" placeholder="Precio (ej: $85,000)" required />
            <input v-model="productForm.stock" type="number" placeholder="Stock inicial" required />
            <select v-model="productForm.category" required>
              <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
              <option value="">Sin categoría</option>
            </select>
            <textarea v-model="productForm.description" placeholder="Descripción" required></textarea>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closeProductModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Categorías -->
      <div v-if="showCategoryModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>{{ currentCategory ? 'Editar Categoría' : 'Agregar Categoría' }}</h2>
          <form @submit.prevent="saveCategory">
            <input v-model="categoryForm.name" placeholder="Nombre de la categoría" required />
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closeCategoryModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Usuarios -->
      <div v-if="showUserModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>{{ currentUser ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
          <form @submit.prevent="saveUser">
            <input v-model="userForm.name" placeholder="Nombre" required />
            <input v-model="userForm.email" placeholder="Email" type="email" required />
            <select v-model="userForm.role" required>
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
            <select v-model="userForm.status" required>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closeUserModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Promociones -->
      <div v-if="showPromotionModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>{{ currentPromotion ? 'Editar Promoción' : 'Agregar Promoción' }}</h2>
          <form @submit.prevent="savePromotion">
            <input v-model="promotionForm.name" placeholder="Nombre de la promoción" required />
            <input v-model.number="promotionForm.discount" type="number" placeholder="Descuento (%)" required />
            <input v-model="promotionForm.startDate" type="date" required />
            <input v-model="promotionForm.endDate" type="date" required />
            <select v-model="promotionForm.products" multiple required>
              <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }}</option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closePromotionModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Detalles de Pedido -->
      <div v-if="showOrderDetailsModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>Detalles del Pedido</h2>
          <div class="order-details">
            <img :src="currentOrderForDetails.productImage" :alt="currentOrderForDetails.productName" class="detail-image" />
            <p><strong>Producto:</strong> {{ currentOrderForDetails.productName }}</p>
            <p><strong>Usuario:</strong> {{ currentOrderForDetails.userName }}</p>
            <p><strong>Estado:</strong> {{ currentOrderForDetails.status }}</p>
            <p><strong>Cantidad:</strong> {{ currentOrderForDetails.quantity }}</p>
            <p><strong>Total:</strong> {{ currentOrderForDetails.total }}</p>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeOrderDetailsModal" class="cancel-btn">Cerrar</button>
          </div>
        </div>
      </div>

      <!-- Modal para Actualizar Estado de Pedido -->
      <div v-if="showOrderUpdateModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>Actualizar Estado del Pedido</h2>
          <form @submit.prevent="saveOrderStatus">
            <p><strong>Producto:</strong> {{ orderForm.productName }}</p>
            <p><strong>Estado Actual:</strong> {{ orderForm.status }}</p>
            <select v-model="orderForm.newStatus" required>
              <option value="Pendiente">Pendiente</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closeOrderUpdateModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <!-- Modal para Chat de Ticket -->
      <div v-if="showTicketChatModal" class="modal-overlay">
        <div class="modal-content large-modal">
          <h2>Chat del Ticket: {{ currentTicket.subject }}</h2>
          <div class="chat-container">
            <div class="chat-messages" ref="chatMessages">
              <div v-for="(message, index) in currentTicket.messages" :key="index" :class="['chat-message', { 'sent': message.sentBy === userName }]">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ formatDate(message.timestamp) }}</span>
              </div>
            </div>
            <div class="chat-input">
              <input v-model="newMessage" placeholder="Escribe un mensaje..." @keyup.enter="sendMessage" />
              <button @click="sendMessage" class="send-btn">Enviar</button>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeTicketChatModal" class="cancel-btn">Cerrar</button>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import draggable from 'vuedraggable';
Chart.register(...registerables);

const showFilters = ref(false);
const priceRange = ref({ min: 0, max: 1000000 });
const isLoading = ref(false);
const isDarkMode = ref(true);
const backupProgress = ref(0);

function applyFilters() {
  showToast('Filtros aplicados', 'info');
}

function clearFilters() {
  priceRange.value = { min: 0, max: 1000000 };
  stockFilter.value = '';
  showToast('Filtros limpiados', 'info');
}
const salesChart = ref(null);
const stockChart = ref(null);
const userChart = ref(null);
const salesChartInstance = ref(null);
const stockChartInstance = ref(null);
const userChartInstance = ref(null);

function destroyCharts() {
  if (salesChartInstance.value) salesChartInstance.value.destroy();
  if (stockChartInstance.value) stockChartInstance.value.destroy();
  if (userChartInstance.value) userChartInstance.value.destroy();
}

function initCharts() {
  destroyCharts();

  const textColor = isDarkMode.value ? '#e0e0e0' : '#333333';
  const gridColor = isDarkMode.value ? 'rgba(224, 224, 224, 0.1)' : 'rgba(51, 51, 51, 0.1)';
  const tooltipBg = isDarkMode.value ? '#2d2d2d' : '#ffffff';
  const tooltipColor = isDarkMode.value ? '#e0e0e0' : '#333333';

  // Gráfico de ventas
  salesChartInstance.value = new Chart(salesChart.value, {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Ventas',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: isDarkMode.value ? '#FFD700' : '#FF4500',
        backgroundColor: isDarkMode.value ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 69, 0, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipColor,
          bodyColor: tooltipColor
        }
      },
      scales: {
        y: { 
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        x: { 
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    }
  });

  // Gráfico de stock
  stockChartInstance.value = new Chart(stockChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Licores', 'Champagne', 'Whisky'],
      datasets: [{
        data: [30, 20, 50],
        backgroundColor: isDarkMode.value ? ['#FFD700', '#FF4500', '#8B4513'] : ['#FF4500', '#FFD700', '#A0522D']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipColor,
          bodyColor: tooltipColor
        }
      }
    }
  });

  // Gráfico de usuarios
  userChartInstance.value = new Chart(userChart.value, {
    type: 'pie',
    data: {
      labels: ['Activos', 'Inactivos'],
      datasets: [{
        data: [activeUsers.value, users.value.length - activeUsers.value],
        backgroundColor: ['#48bb78', '#e53e3e']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipColor,
          bodyColor: tooltipColor
        }
      }
    }
  });
}

const isLightMode = computed(() => !isDarkMode.value);

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
}

watch(isDarkMode, () => {
  initCharts();
});

// Llamar en onMounted después de checkAuthStatus()
onMounted(() => {
  checkAuthStatus();
  checkLowStock();
  setTimeout(initCharts, 500); // Esperar a que el DOM esté listo
});

// Estado de autenticación
const isAuthenticated = ref(false);
const userName = ref('');
const router = useRouter();

// Datos de ejemplo para productos
const products = ref([
  {
    id: 1,
    name: 'Vodka Premium',
    image: 'https://bottleengraving.com/cdn/shop/products/belvedere-super-premium-vodka-808216.jpg?v=1689877745&width=1000',
    price: '$85,000',
    description: 'Vodka de alta calidad importado.',
    stock: 50,
    category: 'Licores'
  },
  {
    id: 2,
    name: 'Dom Pérignon',
    image: 'https://merchantofwine.com/cdn/shop/files/Dom-Perignon-Brut-Champagne-France-2013.jpg?v=1757424322',
    price: '$450,000',
    description: 'Champagne premium para ocasiones especiales.',
    stock: 20,
    category: 'Champagne'
  },
  {
    id: 3,
    name: "Buchanan's 12 Años",
    image: 'http://crownwineandspirits.com/cdn/shop/products/buchanan-s-scotch-buchanan-s-deluxe-aged-12-years-blended-scotch-whisky-750ml-31515759870045.jpg?v=1664304151',
    price: '$120,000',
    description: 'Whisky escocés añejado 12 años.',
    stock: 5,
    category: 'Whisky'
  },
]);

// Datos de ejemplo para categorías
const categories = ref([
  { name: 'Licores', productCount: 1 },
  { name: 'Champagne', productCount: 1 },
  { name: 'Whisky', productCount: 1 }
]);

const categorySearchQuery = ref('');

const filteredCategories = computed(() => 
  categories.value.filter(cat => 
    cat.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
  )
);

// Datos de ejemplo para notificaciones
const notifications = ref([
  {
    id: 1,
    title: 'Producto con bajo stock',
    message: "El producto 'Buchanan's 12 Años' tiene solo 5 unidades en stock.",
    timestamp: new Date('2025-10-16T10:00:00'),
    read: false,
  },
  {
    id: 2,
    title: 'Nuevo pedido recibido',
    message: "Se ha recibido un nuevo pedido de 'Vodka Premium' por Juan Pérez.",
    timestamp: new Date('2025-10-16T12:30:00'),
    read: false,
  },
  {
    id: 3,
    title: 'Usuario registrado',
    message: 'Un nuevo usuario, Carlos López, se ha registrado en el sistema.',
    timestamp: new Date('2025-10-15T09:15:00'),
    read: true,
  },
]);

// Búsqueda y filtro para productos
const productSearchQuery = ref('');
const stockFilter = ref('');
const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => 
    product.name.toLowerCase().includes(productSearchQuery.value.toLowerCase())
  );

  if (stockFilter.value === 'low') {
    filtered = filtered.filter(product => product.stock > 0 && product.stock < 10);
  } else if (stockFilter.value === 'out') {
    filtered = filtered.filter(product => product.stock === 0);
  }

  return filtered;
});

// Búsqueda y filtro para notificaciones
const notificationSearchQuery = ref('');
const notificationFilter = ref('');
const filteredNotifications = computed(() => {
  let filtered = notifications.value.filter(notification =>
    notification.title.toLowerCase().includes(notificationSearchQuery.value.toLowerCase()) ||
    notification.message.toLowerCase().includes(notificationSearchQuery.value.toLowerCase())
  );

  if (notificationFilter.value === 'unread') {
    filtered = filtered.filter(notification => !notification.read);
  } else if (notificationFilter.value === 'read') {
    filtered = filtered.filter(notification => notification.read);
  }

  return filtered;
});

const unreadNotifications = computed(() => 
  notifications.value.filter(notification => !notification.read)
);

// Modal para productos
const showProductModal = ref(false);
const currentProduct = ref(null);
const productForm = ref({
  name: '',
  image: '',
  price: '',
  stock: 0,
  description: '',
  category: ''
});

// Datos de ejemplo para pedidos
const orders = ref([
  {
    id: 1,
    productId: 1,
    productName: 'Vodka Premium',
    productImage: 'https://bottleengraving.com/cdn/shop/products/belvedere-super-premium-vodka-808216.jpg?v=1689877745&width=1000',
    userName: 'Juan Pérez',
    status: 'Pendiente',
    quantity: 1,
    total: '$85,000',
  },
  {
    id: 2,
    productId: 2,
    productName: 'Dom Pérignon',
    productImage: 'https://merchantofwine.com/cdn/shop/files/Dom-Perignon-Brut-Champagne-France-2013.jpg?v=1757424322',
    userName: 'María Gómez',
    status: 'Enviado',
    quantity: 2,
    total: '$900,000',
  },
  {
    id: 3,
    productId: 3,
    productName: "Buchanan's 12 Años",
    productImage: 'http://crownwineandspirits.com/cdn/shop/products/buchanan-s-scotch-buchanan-s-deluxe-aged-12-years-blended-scotch-whisky-750ml-31515759870045.jpg?v=1664304151',
    userName: 'Carlos López',
    status: 'Entregado',
    quantity: 1,
    total: '$120,000',
  },
]);

// Modal para detalles de pedido
const showOrderDetailsModal = ref(false);
const currentOrderForDetails = ref(null);

// Modal para actualizar estado de pedido
const showOrderUpdateModal = ref(false);
const currentOrderForUpdate = ref(null);
const orderForm = ref({
  productName: '',
  status: '',
  newStatus: ''
});

// Datos de ejemplo para usuarios
const users = ref([
  {
    name: 'Juan Pérez',
    email: 'juan.perez@brazzinos.com',
    role: 'Cliente',
    status: 'Activo',
  },
  {
    name: 'María Gómez',
    email: 'maria.gomez@brazzinos.com',
    role: 'Administrador',
    status: 'Activo',
  },
  {
    name: 'Carlos López',
    email: 'carlos.lopez@brazzinos.com',
    role: 'Cliente',
    status: 'Inactivo',
  },
]);

// Modal para usuarios
const showUserModal = ref(false);
const currentUser = ref(null);
const userForm = ref({
  name: '',
  email: '',
  role: 'Cliente',
  status: 'Activo',
});

// Búsqueda y filtros para pedidos
const orderSearchQuery = ref('');
const orderStatusFilter = ref('');
const filteredOrders = computed(() => 
  orders.value.filter(order => 
    order.productName.toLowerCase().includes(orderSearchQuery.value.toLowerCase()) &&
    (orderStatusFilter.value === '' || order.status === orderStatusFilter.value)
  )
);

// Búsqueda y filtros para usuarios
const userSearchQuery = ref('');
const userRoleFilter = ref('');
const filteredUsers = computed(() => 
  users.value.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) &&
    (userRoleFilter.value === '' || user.role === userRoleFilter.value)
  )
);

// Estadísticas del dashboard
const totalSales = computed(() => {
  return orders.value.reduce((sum, order) => {
    const value = parseFloat(order.total.replace(/[^0-9.-]+/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
});

const activeUsers = computed(() => 
  users.value.filter(user => user.status === 'Activo').length
);

const pendingOrders = computed(() => 
  orders.value.filter(order => order.status === 'Pendiente').length
);

const lowStockProducts = computed(() => 
  products.value.filter(product => product.stock < 10).length
);

const openTickets = computed(() => 
  tickets.value.filter(ticket => ticket.status === 'Abierto').length
);

// Verificar autenticación
function checkAuthStatus() {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  if (adminToken && adminUser) {
    isAuthenticated.value = true;
    const userData = JSON.parse(adminUser);
    userName.value = userData.name || userData.email || 'Administrador';
  } else {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      router.push('/login');
    } else {
      router.push('/login');
    }
  }
}

// Función de logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  isAuthenticated.value = false;
  userName.value = '';
  router.push('/login');
}

// Acciones para productos
function openProductModal(product) {
  if (product) {
    currentProduct.value = product;
    productForm.value = { ...product };
  } else {
    currentProduct.value = null;
    productForm.value = { name: '', image: '', price: '', stock: 0, description: '', category: '' };
  }
  showProductModal.value = true;
}

function closeProductModal() {
  showProductModal.value = false;
}

function saveProduct() {
  if (currentProduct.value) {
    Object.assign(currentProduct.value, productForm.value);
    const category = categories.value.find(cat => cat.name === productForm.value.category);
    if (category) category.productCount++;
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Producto actualizado',
      message: `El producto ${productForm.value.name} ha sido actualizado.`,
      timestamp: new Date(),
      read: false,
    });
  } else {
    const newId = products.value.length + 1;
    products.value.push({ id: newId, ...productForm.value });
    const category = categories.value.find(cat => cat.name === productForm.value.category) || { name: productForm.value.category, productCount: 0 };
    if (!categories.value.some(cat => cat.name === productForm.value.category)) {
      categories.value.push(category);
    }
    category.productCount++;
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Producto añadido',
      message: `Se ha añadido un nuevo producto: ${productForm.value.name}`,
      timestamp: new Date(),
      read: false,
    });
  }
  checkLowStock();
  closeProductModal();
}

function deleteProduct(index) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    const productName = products.value[index].name;
    const category = categories.value.find(cat => cat.name === products.value[index].category);
    if (category) category.productCount--;
    products.value.splice(index, 1);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Producto eliminado',
      message: `El producto ${productName} ha sido eliminado.`,
      timestamp: new Date(),
      read: false,
    });
  }
}

// Acciones para categorías
const showCategoryModal = ref(false);
const currentCategory = ref(null);
const categoryForm = ref({ name: '' });

function openCategoryModal(category) {
  if (category) {
    currentCategory.value = category;
    categoryForm.value = { ...category };
  } else {
    currentCategory.value = null;
    categoryForm.value = { name: '' };
  }
  showCategoryModal.value = true;
}

function closeCategoryModal() {
  showCategoryModal.value = false;
}

function saveCategory() {
  if (!categoryForm.value.name.trim()) {
    alert('El nombre de la categoría no puede estar vacío.');
    return;
  }
  if (categories.value.some(cat => cat.name === categoryForm.value.name && cat !== currentCategory.value)) {
    alert('Esta categoría ya existe.');
    return;
  }
  if (currentCategory.value) {
    Object.assign(currentCategory.value, categoryForm.value);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Categoría actualizada',
      message: `La categoría ${categoryForm.value.name} ha sido actualizada.`,
      timestamp: new Date(),
      read: false,
    });
  } else {
    categories.value.push({ name: categoryForm.value.name, productCount: 0 });
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Categoría añadida',
      message: `Se ha añadido una nueva categoría: ${categoryForm.value.name}`,
      timestamp: new Date(),
      read: false,
    });
  }
  closeCategoryModal();
}

function deleteCategory(index) {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    const categoryName = categories.value[index].name;
    products.value = products.value.map(p => 
      p.category === categoryName ? { ...p, category: 'Sin categoría' } : p
    );
    categories.value.splice(index, 1);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Categoría eliminada',
      message: `La categoría ${categoryName} ha sido eliminada.`,
      timestamp: new Date(),
      read: false,
    });
  }
}

function saveCategoryOrder() {
  console.log('Order updated:', categories.value);
  notifications.value.push({
    id: notifications.value.length + 1,
    title: 'Orden de categorías actualizado',
    message: 'El orden de las categorías ha sido guardado.',
    timestamp: new Date(),
    read: false,
  });
}

// Acciones para usuarios
function openUserModal(user) {
  if (user) {
    currentUser.value = user;
    userForm.value = { ...user };
  } else {
    currentUser.value = null;
    userForm.value = { name: '', email: '', role: 'Cliente', status: 'Activo' };
  }
  showUserModal.value = true;
}

function closeUserModal() {
  showUserModal.value = false;
}

function saveUser() {
  if (currentUser.value) {
    Object.assign(currentUser.value, userForm.value);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Usuario actualizado',
      message: `El usuario ${userForm.value.name} ha sido actualizado.`,
      timestamp: new Date(),
      read: false,
    });
  } else {
    users.value.push({ ...userForm.value });
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Usuario añadido',
      message: `Se ha añadido un nuevo usuario: ${userForm.value.name}`,
      timestamp: new Date(),
      read: false,
    });
  }
  closeUserModal();
}

function deleteUser(index) {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    const userName = users.value[index].name;
    users.value.splice(index, 1);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Usuario eliminado',
      message: `El usuario ${userName} ha sido eliminado.`,
      timestamp: new Date(),
      read: false,
    });
  }
}

function toggleUserStatus(user) {
  user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
  notifications.value.push({
    id: notifications.value.length + 1,
    title: 'Estado de usuario actualizado',
    message: `El estado del usuario ${user.name} ha sido cambiado a ${user.status}.`,
    timestamp: new Date(),
    read: false,
  });
}

// Acciones para pedidos
function openOrderDetailsModal(order) {
  currentOrderForDetails.value = order;
  showOrderDetailsModal.value = true;
}

function closeOrderDetailsModal() {
  showOrderDetailsModal.value = false;
}

function openOrderUpdateModal(order) {
  currentOrderForUpdate.value = order;
  orderForm.value = {
    productName: order.productName,
    status: order.status,
    newStatus: order.status,
  };
  showOrderUpdateModal.value = true;
}

function closeOrderUpdateModal() {
  showOrderUpdateModal.value = false;
}

function saveOrderStatus() {
  const oldStatus = currentOrderForUpdate.value.status;
  const newStatus = orderForm.value.newStatus;

  if (newStatus !== oldStatus && newStatus === 'Enviado') {
    const product = products.value.find(p => p.id === currentOrderForUpdate.value.productId);
    if (product && product.stock >= currentOrderForUpdate.value.quantity) {
      product.stock -= currentOrderForUpdate.value.quantity;
      currentOrderForUpdate.value.status = newStatus;
      notifications.value.push({
        id: notifications.value.length + 1,
        title: 'Estado de pedido actualizado',
        message: `El pedido de ${orderForm.value.productName} ha sido actualizado a ${newStatus}. Stock actualizado.`,
        timestamp: new Date(),
        read: false,
      });
      checkLowStock();
    } else {
      notifications.value.push({
        id: notifications.value.length + 1,
        title: 'Error en pedido',
        message: `No hay suficiente stock para enviar el pedido de ${orderForm.value.productName}.`,
        timestamp: new Date(),
        read: false,
      });
      return;
    }
  } else {
    currentOrderForUpdate.value.status = newStatus;
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Estado de pedido actualizado',
      message: `El pedido de ${orderForm.value.productName} ha sido actualizado a ${newStatus}.`,
      timestamp: new Date(),
      read: false,
    });
  }
  closeOrderUpdateModal();
}

// Acciones para promociones
const showPromotionModal = ref(false);
const currentPromotion = ref(null);
const promotionForm = ref({
  name: '',
  discount: 0,
  startDate: '',
  endDate: '',
  products: []
});
const promotions = ref([
  { name: 'Oferta de Halloween', discount: 20, startDate: '2025-10-25', endDate: '2025-10-31', products: [1, 2] }
]);

function openPromotionModal(promotion) {
  if (promotion) {
    currentPromotion.value = promotion;
    promotionForm.value = { ...promotion };
  } else {
    currentPromotion.value = null;
    promotionForm.value = { name: '', discount: 0, startDate: '', endDate: '', products: [] };
  }
  showPromotionModal.value = true;
}

function closePromotionModal() {
  showPromotionModal.value = false;
}

function savePromotion() {
  if (currentPromotion.value) {
    Object.assign(currentPromotion.value, promotionForm.value);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Promoción actualizada',
      message: `La promoción ${promotionForm.value.name} ha sido actualizada.`,
      timestamp: new Date(),
      read: false,
    });
  } else {
    promotions.value.push({ ...promotionForm.value });
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Promoción añadida',
      message: `Se ha añadido una nueva promoción: ${promotionForm.value.name}`,
      timestamp: new Date(),
      read: false,
    });
  }
  closePromotionModal();
}

function deletePromotion(index) {
  if (confirm('¿Estás seguro de eliminar esta promoción?')) {
    const promotionName = promotions.value[index].name;
    promotions.value.splice(index, 1);
    notifications.value.push({
      id: notifications.value.length + 1,
      title: 'Promoción eliminada',
      message: `La promoción ${promotionName} ha sido eliminada.`,
      timestamp: new Date(),
      read: false,
    });
  }
}

const filteredPromotions = computed(() =>
  promotions.value.filter(promo =>
    promo.name.toLowerCase().includes(promotionSearchQuery.value.toLowerCase())
  )
);
const promotionSearchQuery = ref('');

// Acciones para notificaciones
function markAsRead(index) {
  notifications.value[index].read = true;
}

function markAllAsRead() {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
}

function deleteNotification(index) {
  notifications.value.splice(index, 1);
}

function clearAllNotifications() {
  if (confirm('¿Estás seguro de eliminar todas las notificaciones?')) {
    notifications.value = [];
  }
}

// Acciones para tickets
const showTicketChatModal = ref(false);
const currentTicket = ref(null);
const newMessage = ref('');
const tickets = ref([
  { subject: 'Problema con pedido', userName: 'Juan Pérez', status: 'Abierto', createdAt: new Date(), messages: [{ text: 'No recibí mi pedido', timestamp: new Date(), sentBy: 'Juan Pérez' }] }
]);

function openTicketChat(ticket) {
  currentTicket.value = { ...ticket, messages: [...ticket.messages] };
  showTicketChatModal.value = true;
  setTimeout(() => {
    $refs.chatMessages.scrollTop = $refs.chatMessages.scrollHeight;
  }, 100);
}

function closeTicketChatModal() {
  showTicketChatModal.value = false;
}

function sendMessage() {
  if (newMessage.value.trim()) {
    currentTicket.value.messages.push({ text: newMessage.value, timestamp: new Date(), sentBy: userName.value });
    newMessage.value = '';
    setTimeout(() => {
      $refs.chatMessages.scrollTop = $refs.chatMessages.scrollHeight;
    }, 100);
  }
}

function toggleTicketStatus(ticket, index) {
  ticket.status = ticket.status === 'Abierto' ? 'Cerrado' : 'Abierto';
  notifications.value.push({
    id: notifications.value.length + 1,
    title: 'Estado de ticket actualizado',
    message: `El ticket de ${ticket.userName} ha sido cambiado a ${ticket.status}.`,
    timestamp: new Date(),
    read: false,
  });
}

const ticketSearchQuery = ref('');
const ticketStatusFilter = ref('');
const filteredTickets = computed(() =>
  tickets.value.filter(ticket =>
    ticket.subject.toLowerCase().includes(ticketSearchQuery.value.toLowerCase()) &&
    (ticketStatusFilter.value === '' || ticket.status === ticketStatusFilter.value)
  )
);

// Acciones para logs
const logs = ref([
  { message: 'Usuario Juan Pérez inició sesión', timestamp: new Date('2025-10-21T06:00:00'), user: 'Juan Pérez', type: 'login' },
  { message: 'Producto Vodka Premium editado', timestamp: new Date('2025-10-21T06:10:00'), user: 'María Gómez', type: 'edit' },
  { message: 'Usuario Carlos López eliminado', timestamp: new Date('2025-10-21T06:20:00'), user: 'María Gómez', type: 'delete' }
]);
const logSearchQuery = ref('');
const logFilter = ref('');
const filteredLogs = computed(() =>
  logs.value.filter(log =>
    log.message.toLowerCase().includes(logSearchQuery.value.toLowerCase()) &&
    (logFilter.value === '' || log.type === logFilter.value)
  )
);
// Acciones para métodos de pago
const paymentConfig = ref({
  stripeKey: '',
  paypalId: ''
});

function savePaymentConfig() {
  notifications.value.push({
    id: notifications.value.length + 1,
    title: 'Configuración de pago guardada',
    message: 'Los métodos de pago han sido configurados.',
    timestamp: new Date(),
    read: false,
  });
}

// Acciones para backup
const backupFile = ref(null);

function exportBackup() {
  isLoading.value = true;
  const data = { products: products.value, orders: orders.value, users: users.value, categories: categories.value, promotions: promotions.value, tickets: tickets.value, logs: logs.value };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'brazzinos_backup.json';
  link.click();
  isLoading.value = false;
}

function importBackup(event) {
  const file = event.target.files[0];
  if (file) {
    isLoading.value = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      products.value = data.products || [];
      orders.value = data.orders || [];
      users.value = data.users || [];
      categories.value = data.categories || [];
      promotions.value = data.promotions || [];
      tickets.value = data.tickets || [];
      logs.value = data.logs || [];
      isLoading.value = false;
      notifications.value.push({
        id: notifications.value.length + 1,
        title: 'Backup importado',
        message: 'Los datos han sido restaurados desde el backup.',
        timestamp: new Date(),
        read: false,
      });
    };
    reader.readAsText(file);
  }
}

// Exportar a PDF (simulación básica con jsPDF)
function exportProductsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Reporte de Productos - Brazzino\'s', 10, 10);
  products.value.forEach((prod, index) => {
    doc.text(`${index + 1}. ${prod.name} - ${prod.price} - Stock: ${prod.stock}`, 10, 20 + (index * 10));
  });
  doc.save('productos.pdf');
}

function exportOrdersPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Reporte de Pedidos - Brazzino\'s', 10, 10);
  orders.value.forEach((order, index) => {
    doc.text(`${index + 1}. ${order.productName} - ${order.total} - Estado: ${order.status}`, 10, 20 + (index * 10));
  });
  doc.save('pedidos.pdf');
}

function exportUsersPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Reporte de Usuarios - Brazzino\'s', 10, 10);
  users.value.forEach((user, index) => {
    doc.text(`${index + 1}. ${user.name} - ${user.email} - ${user.role}`, 10, 20 + (index * 10));
  });
  doc.save('usuarios.pdf');
}

// Exportar a CSV
function exportProducts() {
  const csvData = products.value.map(product => ({
    ID: product.id,
    Nombre: product.name,
    Imagen: product.image,
    Precio: product.price,
    Stock: product.stock,
    Descripcion: product.description,
    Categoría: product.category
  }));
  const headers = Object.keys(csvData[0]).join(',');
  const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'productos.csv';
  link.click();
}

function exportOrders() {
  const csvData = orders.value.map(order => ({
    ID: order.id,
    Producto: order.productName,
    Usuario: order.userName,
    Estado: order.status,
    Cantidad: order.quantity,
    Total: order.total,
  }));
  const headers = Object.keys(csvData[0]).join(',');
  const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'pedidos.csv';
  link.click();
}

function exportUsers() {
  const csvData = users.value.map(user => ({
    Nombre: user.name,
    Email: user.email,
    Rol: user.role,
    Estado: user.status,
  }));
  const headers = Object.keys(csvData[0]).join(',');
  const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'usuarios.csv';
  link.click();
}

// Lifecycle hook
onMounted(() => {
  checkAuthStatus();
  checkLowStock();
});
function formatDate(date) {
  return new Date(date).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Verificar stock bajo
function checkLowStock() {
  products.value.forEach(product => {
    if (product.stock < 10 && !notifications.value.some(n => n.message.includes(`El producto '${product.name}' tiene solo ${product.stock} unidades en stock.`))) {
      notifications.value.push({
        id: notifications.value.length + 1,
        title: 'Producto con bajo stock',
        message: `El producto '${product.name}' tiene solo ${product.stock} unidades en stock.`,
        timestamp: new Date(),
        read: false,
      });
    }
  });
}

function showToast(message, type) {
  console.log(`${type}: ${message}`);
}
</script>

<style scoped>
/* Layout principal */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #3d3d2d 75%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e0e0e0;
  transition: background 0.3s ease, color 0.3s ease;
  font-size: 1.1rem;
}

.main-layout.light-mode {
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #f0f0f0 50%, #e0e0e0 75%, #f0f0f0 100%);
  color: #333;
}

.main-layout .background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.5" fill="%23ffffff" opacity="0.02"/><circle cx="80" cy="80" r="0.3" fill="%23ffffff" opacity="0.015"/><circle cx="40" cy="60" r="0.4" fill="%23ffffff" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.main-layout.light-mode .background-overlay {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.5" fill="%23000000" opacity="0.02"/><circle cx="80" cy="80" r="0.3" fill="%23000000" opacity="0.015"/><circle cx="40" cy="60" r="0.4" fill="%23000000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

/* Navbar simplificada */
.main-layout .navbar {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease, border-bottom 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .navbar {
  background: rgba(240, 240, 240, 0.95);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-layout .navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.main-layout .brand-title {
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
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.main-layout.light-mode .brand-title {
  color: #FF4500;
  text-shadow: none;
  background: none;
  -webkit-text-fill-color: #FF4500;
}

.main-layout .nav-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.main-layout .nav-links {
  display: flex;
  gap: 1.5rem;
}

.main-layout .nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-layout.light-mode .nav-link {
  color: #333;
}

.main-layout .nav-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  animation: bounce 0.5s ease;
}

.main-layout.light-mode .nav-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #FF4500;
  animation: bounce 0.5s ease;
}

.main-layout .notification-icon, .main-layout .theme-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.main-layout .nav-link:hover .notification-icon,
.main-layout .nav-link:hover .theme-icon {
  transform: scale(1.2) rotate(15deg);
}

.main-layout .notification-badge {
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  position: absolute;
  top: -5px;
  right: -5px;
}

.main-layout .animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7);
  }
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(229, 62, 62, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(229, 62, 62, 0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Usuario autenticado */
.main-layout .user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-layout.light-mode .user-menu {
  color: #333;
}

.main-layout .user-welcome {
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
  transition: color 0.3s ease, background 0.3s ease, border 0.3s ease;
}

.main-layout.light-mode .user-welcome {
  color: #FF4500;
  background: rgba(255, 69, 0, 0.1);
  border-color: rgba(255, 69, 0, 0.2);
}

.main-layout .user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-layout .user-role {
  font-size: 0.7rem;
  color: rgba(255, 215, 0, 0.7);
  font-weight: 400;
  transition: color 0.3s ease;
}

.main-layout.light-mode .user-role {
  color: rgba(255, 69, 0, 0.7);
}

.main-layout .welcome-icon {
  font-size: 1.1rem;
  margin-right: 0.2rem;
}

.main-layout .logout-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.main-layout .logout-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.5);
  animation: pulseEffect 0.5s ease;
}

.main-layout .logout-icon {
  font-size: 1rem;
}

@keyframes pulseEffect {
  0% { transform: translateY(-2px) scale(1.05); }
  50% { transform: translateY(-4px) scale(1.1); }
  100% { transform: translateY(-2px) scale(1.05); }
}

/* Contenedor con scroll */
.main-layout .content-scroll {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 2rem 3rem;
  scrollbar-width: thin;
  scrollbar-color: #FFD700 rgba(255, 255, 255, 0.1);
  transition: scrollbar-color 0.3s ease;
}

.main-layout.light-mode .content-scroll {
  scrollbar-color: #FF4500 rgba(0, 0, 0, 0.1);
}

.main-layout .content-scroll::-webkit-scrollbar {
  width: 8px;
}

.main-layout .content-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.main-layout.light-mode .content-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.main-layout .content-scroll::-webkit-scrollbar-thumb {
  background: #FFD700;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.main-layout.light-mode .content-scroll::-webkit-scrollbar-thumb {
  background: #FF4500;
}

/* Sección del catálogo */
.main-layout .catalog-section {
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .catalog-section {
  background: rgba(240, 240, 240, 0.95);
  border-color: rgba(255, 69, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.main-layout .section-title {
  color: #FFD700;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin: 0;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.main-layout.light-mode .section-title {
  color: #FF4500;
  text-shadow: none;
}

.main-layout .title-underline {
  width: 100px;
  height: 3px;
  background: #FFD700;
  margin: 0.5rem auto;
  transition: background 0.3s ease;
}

.main-layout.light-mode .title-underline {
  background: #FF4500;
}

/* Dashboard */
.main-layout .dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.main-layout .stat-card {
  background: rgba(50, 50, 50, 0.9);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .stat-card {
  background: rgba(220, 220, 220, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .stat-card:hover {
  transform: translateY(-5px);
}

.main-layout .stat-card h3 {
  color: #e0e0e0;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .stat-card h3 {
  color: #333;
}

.main-layout .stat-card p {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.main-layout.light-mode .stat-card p {
  color: #FF4500;
}

/* Charts */
.main-layout .charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.main-layout .chart-card {
  background: rgba(40, 40, 40, 0.9);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .chart-card {
  background: rgba(230, 230, 230, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .chart-card h3 {
  color: #FFD700;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .chart-card h3 {
  color: #FF4500;
}

/* Filtros Sidebar */
.main-layout .filters-sidebar {
  position: fixed;
  right: -350px;
  top: 100px;
  width: 350px;
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 15px 0 0 15px;
  padding: 1.5rem;
  z-index: 90;
  transition: right 0.3s ease, background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
}

.main-layout.light-mode .filters-sidebar {
  background: rgba(240, 240, 240, 0.95);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.main-layout .filters-sidebar.active {
  right: 0;
}

.main-layout .filters-toggle {
  position: absolute;
  left: -60px;
  top: 20px;
  background: #FFD700;
  color: #1a1a1a;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.main-layout.light-mode .filters-toggle {
  background: #FF4500;
  color: white;
}

.main-layout .filters-toggle:hover {
  transform: scale(1.05) translateX(-2px);
  animation: slideIn 0.5s ease;
}

.main-layout .filters-content h3 {
  color: #FFD700;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .filters-content h3 {
  color: #FF4500;
}

.main-layout .filter-group {
  margin-bottom: 1.5rem;
}

.main-layout .filter-group label {
  color: #e0e0e0;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: block;
  transition: color 0.3s ease;
}

.main-layout.light-mode .filter-group label {
  color: #333;
}

.main-layout .filter-group input,
.main-layout .filter-group select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(40, 40, 40, 0.5);
  color: #e0e0e0;
  transition: border 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.main-layout.light-mode .filter-group input,
.main-layout.light-mode .filter-group select {
  border-color: rgba(255, 69, 0, 0.2);
  background: rgba(230, 230, 230, 0.5);
  color: #333;
}

.main-layout .apply-filters-btn,
.main-layout .clear-filters-btn {
  width: 100%;
  padding: 0.8rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-layout .apply-filters-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
}

.main-layout .clear-filters-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
}

.main-layout .apply-filters-btn:hover,
.main-layout .clear-filters-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: bounce 0.5s ease;
}

@keyframes slideIn {
  0% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

/* Search Bar */
.main-layout .search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.main-layout .search-bar input,
.main-layout .search-bar select {
  flex: 1;
  min-width: 200px;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(40, 40, 40, 0.5);
  color: #e0e0e0;
  transition: border 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.main-layout.light-mode .search-bar input,
.main-layout.light-mode .search-bar select {
  border-color: rgba(255, 69, 0, 0.2);
  background: rgba(230, 230, 230, 0.5);
  color: #333;
}

.main-layout .add-btn,
.main-layout .export-btn {
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-layout .add-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
}

.main-layout .export-btn {
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  color: white;
}

.main-layout .add-btn:hover,
.main-layout .export-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: bounce 0.5s ease;
}

/* Grillas */
.main-layout .products-grid,
.main-layout .categories-grid,
.main-layout .promotions-grid,
.main-layout .notifications-grid,
.main-layout .tickets-grid,
.main-layout .users-grid,
.main-layout .logs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.main-layout .product-card,
.main-layout .category-card,
.main-layout .promotion-card,
.main-layout .notification-card,
.main-layout .ticket-card,
.main-layout .user-card,
.main-layout .log-card {
  background: rgba(40, 40, 40, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .product-card,
.main-layout.light-mode .category-card,
.main-layout.light-mode .promotion-card,
.main-layout.light-mode .notification-card,
.main-layout.light-mode .ticket-card,
.main-layout.light-mode .user-card,
.main-layout.light-mode .log-card {
  background: rgba(230, 230, 230, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .product-card:hover,
.main-layout .category-card:hover,
.main-layout .promotion-card:hover,
.main-layout .notification-card:hover,
.main-layout .ticket-card:hover,
.main-layout .user-card:hover,
.main-layout .log-card:hover {
  transform: translateY(-5px);
}

.main-layout .card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.main-layout .product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-layout .product-card:hover .product-image {
  transform: scale(1.08);
}

.main-layout .image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
  transition: background 0.3s ease;
}

.main-layout.light-mode .image-overlay {
  background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.5) 100%);
}

.main-layout .product-info,
.main-layout .category-info,
.main-layout .promotion-info,
.main-layout .notification-info,
.main-layout .ticket-info,
.main-layout .user-info,
.main-layout .log-info {
  padding: 1.5rem;
}

.main-layout .product-title,
.main-layout .category-title,
.main-layout .promotion-title,
.main-layout .notification-title,
.main-layout .ticket-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e0e0e0;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .product-title,
.main-layout.light-mode .category-title,
.main-layout.light-mode .promotion-title,
.main-layout.light-mode .notification-title,
.main-layout.light-mode .ticket-title {
  color: #333;
}

.main-layout .product-description,
.main-layout .category-description,
.main-layout .promotion-description,
.main-layout .notification-message,
.main-layout .ticket-description,
.main-layout .log-message {
  font-size: 1.1rem;
  color: #b0b0b0;
  margin-bottom: 1rem;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.main-layout.light-mode .product-description,
.main-layout.light-mode .category-description,
.main-layout.light-mode .promotion-description,
.main-layout.light-mode .notification-message,
.main-layout.light-mode .ticket-description,
.main-layout.light-mode .log-message {
  color: #666;
}

/* Admin Actions */
.main-layout .admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-evenly;
}

.main-layout .edit-product-btn,
.main-layout .view-stats-btn,
.main-layout .status-btn,
.main-layout .mark-read-btn,
.main-layout .send-btn,
.main-layout .save-btn,
.main-layout .cancel-btn {
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
}

.main-layout .edit-product-btn:hover,
.main-layout .view-stats-btn:hover,
.main-layout .status-btn:hover,
.main-layout .mark-read-btn:hover,
.main-layout .send-btn:hover,
.main-layout .save-btn:hover,
.main-layout .cancel-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(49, 130, 206, 0.5);
  animation: bounce 0.5s ease;
}

.main-layout .delete-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.main-layout .delete-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.5);
  animation: pulseDelete 0.5s ease;
}

.main-layout .status-btn.open {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.main-layout .status-btn.open:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.5);
  animation: bounce 0.5s ease;
}

@keyframes pulseDelete {
  0% { transform: translateY(-2px) scale(1.05); }
  50% { transform: translateY(-4px) scale(1.1); }
  100% { transform: translateY(-2px) scale(1.05); }
}

/* Notification Cards */
.main-layout .notification-card {
  background: rgba(40, 40, 40, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.main-layout.light-mode .notification-card {
  background: rgba(230, 230, 230, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .notification-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.main-layout .notification-card.unread {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.2), rgba(0, 0, 0, 0.2));
  border: 2px solid #48bb78;
  animation: glow 1.5s ease-in-out infinite alternate;
}

.main-layout.light-mode .notification-card.unread {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.2), rgba(255, 255, 255, 0.2));
  border-color: #48bb78;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(72, 187, 120, 0.2);
  }
  to {
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
  }
}

.main-layout .notification-title {
  font-size: 1.4rem;
  color: #FFD700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-title {
  color: #FF4500;
}

.main-layout .notification-message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #b0b0b0;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-message {
  color: #666;
}

.main-layout .notification-date {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-top: 1rem;
  text-align: right;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-date {
  color: #666;
}

.main-layout .notification-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: space-between;
}

.main-layout .mark-read-btn,
.main-layout .delete-notification-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-layout .mark-read-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
}

.main-layout .mark-read-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(72, 187, 120, 0.5);
  animation: bounce 0.5s ease;
}

.main-layout .delete-notification-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
}

.main-layout .delete-notification-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(229, 62, 62, 0.5);
  animation: pulseDelete 0.5s ease;
}

/* Modal */
.main-layout .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  transition: background 0.3s ease;
}

.main-layout.light-mode .modal-overlay {
  background: rgba(255, 255, 255, 0.8);
}

.main-layout .modal-content {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.main-layout.light-mode .modal-content {
  background: rgba(245, 245, 245, 0.95);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.main-layout .large-modal {
  max-width: 800px;
}

.main-layout .modal-content h2 {
  color: #FFD700;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .modal-content h2 {
  color: #FF4500;
}

.main-layout .modal-content form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-layout .modal-content input,
.main-layout .modal-content select,
.main-layout .modal-content textarea {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(40, 40, 40, 0.5);
  color: #e0e0e0;
  transition: border 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.main-layout.light-mode .modal-content input,
.main-layout.light-mode .modal-content select,
.main-layout.light-mode .modal-content textarea {
  border-color: rgba(255, 69, 0, 0.2);
  background: rgba(230, 230, 230, 0.5);
  color: #333;
}

.main-layout .modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.main-layout .cancel-btn {
  background: linear-gradient(135deg, #a0aec0, #718096);
  border-radius: 25px;
  color: white;
}

.main-layout .cancel-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(160, 174, 192, 0.5);
  animation: bounce 0.5s ease;
}

.main-layout .chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.main-layout .chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(40, 40, 40, 0.9);
  border-radius: 5px;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
}

.main-layout.light-mode .chat-messages {
  background: rgba(230, 230, 230, 0.9);
}

.main-layout .chat-message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  max-width: 70%;
}

.main-layout .chat-message.sent {
  background: #3182ce;
  margin-left: auto;
  color: white;
}

.main-layout .chat-message p {
  margin: 0;
}

.main-layout .message-time {
  font-size: 0.7rem;
  color: #b0b0b0;
  display: block;
  text-align: right;
  transition: color 0.3s ease;
}

.main-layout.light-mode .message-time {
  color: #666;
}

.main-layout .chat-input {
  display: flex;
  gap: 0.5rem;
}

.main-layout .chat-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 5px;
  background: rgba(40, 40, 40, 0.5);
  color: #e0e0e0;
  transition: border 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.main-layout.light-mode .chat-input input {
  border-color: rgba(255, 69, 0, 0.2);
  background: rgba(230, 230, 230, 0.5);
  color: #333;
}

.main-layout .order-details img {
  max-width: 100%;
  border-radius: 5px;
  margin-bottom: 1rem;
}

/* Footer */
.main-layout .footer {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  padding: 3rem 2rem 4rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: background 0.3s ease, border-top 0.3s ease;
}

.main-layout.light-mode .footer {
  background: rgba(245, 245, 245, 0.95);
  border-top: 1px solid rgba(255, 69, 0, 0.2);
}

.main-layout .footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FFD700, #FF4500, #8B4513, #FFD700);
  background-size: 400% 400%;
  animation: shimmer 3s ease-in-out infinite;
  transition: background 0.3s ease;
}

.main-layout.light-mode .footer::before {
  background: linear-gradient(90deg, #FF4500, #FFD700, #A0522D, #FF4500);
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.main-layout .footer-content {
  max-width: 1600px; /* Increased max-width for a wider footer */
  margin: 0 auto;
  width: 100%;
  padding: 0 3rem; /* Increased padding for better edge spacing */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-layout .footer-header {
  text-align: center;
  margin-bottom: 3rem;
}

.main-layout .footer-title {
  color: #FFD700;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.main-layout.light-mode .footer-title {
  color: #FF4500;
  text-shadow: none;
}

.main-layout .contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
  width: 100%;
  max-width: 1400px; /* Increased max-width for wider grid */
}

.main-layout .contact-item {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease, background 0.3s ease, border 0.3s ease;
  box-sizing: border-box;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-layout.light-mode .contact-item {
  background: rgba(240, 240, 240, 0.8);
  border-color: rgba(255, 69, 0, 0.2);
}

.main-layout .contact-item:hover {
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.main-layout.light-mode .contact-item:hover {
  border-color: rgba(255, 69, 0, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.main-layout .contact-icon {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  transition: filter 0.3s ease;
}

.main-layout.light-mode .contact-icon {
  filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.5));
}

.main-layout .contact-details h4 {
  color: #FFD700;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .contact-details h4 {
  color: #FF4500;
}

.main-layout .contact-details address,
.main-layout .contact-details a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-style: normal;
  line-height: 1.6;
  transition: color 0.3s ease;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
}

.main-layout.light-mode .contact-details address,
.main-layout.light-mode .contact-details a {
  color: rgba(0, 0, 0, 0.8);
}

.main-layout .contact-details a:hover {
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.main-layout.light-mode .contact-details a:hover {
  color: #FF4500;
  text-shadow: none;
}

/* Loading Overlay */
.main-layout .loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: background 0.3s ease;
}

.main-layout.light-mode .loading-overlay {
  background: rgba(255, 255, 255, 0.7);
}

.main-layout .loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transition: border-top 0.3s ease;
}

.main-layout.light-mode .loading-spinner {
  border: 5px solid #333333;
  border-top: 5px solid #FF4500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.main-layout .loading-overlay p {
  color: #e0e0e0;
  margin-top: 1rem;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .loading-overlay p {
  color: #333;
}

/* Progress Bar */
.main-layout .progress-bar {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.main-layout.light-mode .progress-bar {
  background: rgba(0, 0, 0, 0.1);
}

.main-layout .progress {
  height: 10px;
  background: #FFD700;
  transition: width 0.3s ease, background 0.3s ease;
}

.main-layout.light-mode .progress {
  background: #FF4500;
}

.main-layout .notification-card.unread {
  background: rgba(72, 187, 120, 0.1);
  border-left: 4px solid #48bb78;
  transition: background 0.3s ease, border-left 0.3s ease;
}

.main-layout.light-mode .notification-card.unread {
  background: rgba(72, 187, 120, 0.1);
  border-left-color: #48bb78;
}

.main-layout .log-card.critical {
  background: rgba(229, 62, 62, 0.1);
  border-left: 4px solid #e53e3e;
  transition: background 0.3s ease, border-left 0.3s ease;
}

.main-layout.light-mode .log-card.critical {
  background: rgba(229, 62, 62, 0.1);
  border-left-color: #e53e3e;
}

/* Improved Notification Styles */
.main-layout .notifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.main-layout .notification-card {
  background: rgba(40, 40, 40, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.main-layout.light-mode .notification-card {
  background: rgba(230, 230, 230, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.main-layout .notification-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.main-layout .notification-card.unread {
  border: 2px solid #48bb78;
  animation: glow 1.5s ease-in-out infinite alternate;
  transition: border 0.3s ease;
}

.main-layout.light-mode .notification-card.unread {
  border-color: #48bb78;
}

.main-layout .notification-title {
  font-size: 1.4rem;
  color: #FFD700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-title {
  color: #FF4500;
}

.main-layout .notification-message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #b0b0b0;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-message {
  color: #666;
}

.main-layout .notification-date {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-top: 1rem;
  text-align: right;
  transition: color 0.3s ease;
}

.main-layout.light-mode .notification-date {
  color: #666;
}

.main-layout .notification-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: space-between;
}

.main-layout .mark-read-btn,
.main-layout .delete-notification-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-layout .mark-read-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
}

.main-layout .mark-read-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(72, 187, 120, 0.5);
  animation: bounce 0.5s ease;
}

.main-layout .delete-notification-btn {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
}

.main-layout .delete-notification-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(229, 62, 62, 0.5);
  animation: pulseDelete 0.5s ease;
}
/* Métodos de Pago */
.main-layout .payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(40, 40, 40, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  transition: background 0.3s ease, border 0.3s ease;
}

.main-layout.light-mode .payment-form {
  background: rgba(230, 230, 230, 0.9);
  border-color: rgba(255, 69, 0, 0.1);
}

.main-layout .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-layout .form-group label {
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: left;
  transition: color 0.3s ease;
}

.main-layout.light-mode .form-group label {
  color: #333;
}

.main-layout .form-group input {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(50, 50, 50, 0.5);
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.main-layout.light-mode .form-group input {
  border-color: rgba(255, 69, 0, 0.2);
  background: rgba(220, 220, 220, 0.5);
  color: #333;
}

.main-layout .form-group input:focus {
  border-color: #FFD700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}

.main-layout.light-mode .form-group input:focus {
  border-color: #FF4500;
  box-shadow: 0 0 5px rgba(255, 69, 0, 0.5);
}

.main-layout .save-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(72, 187, 120, 0.3);
  align-self: flex-end;
}

.main-layout .save-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(72, 187, 120, 0.5);
  animation: bounce 0.5s ease;
}

/* Backup y Restore */
.main-layout .backup-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.main-layout .backup-actions .export-btn,
.main-layout .backup-actions .add-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-layout .backup-actions .export-btn {
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  color: white;
}

.main-layout .backup-actions .add-btn {
  background: linear-gradient(135deg, #48bb78, #2f855a);
  color: white;
}

.main-layout .backup-actions .export-btn:hover,
.main-layout .backup-actions .add-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: bounce 0.5s ease;
}

.main-layout .backup-actions input[type="file"] {
  display: none;
}
/* ... (otros estilos permanecen iguales) ... */

.order-details-modal {
  max-width: 500px; /* Reducido de 800px a 500px */
  padding: 1.5rem; /* Reducido de 2rem a 1.5rem */
}

.order-details img {
  max-width: 100%;
  border-radius: 5px;
  margin-bottom: 1rem;
  max-height: 150px; /* Añadido para controlar la altura de la imagen */
  object-fit: cover;
}

.order-details p {
  margin: 0.5rem 0; /* Reducido de 1rem a 0.5rem */
  font-size: 1rem; /* Ajustado para mejor legibilidad en tamaño reducido */
}
</style>

Prueba cambiando el tema con el botón (☀️ o 🌙), y verás que ahora todo se adapta correctamente: fondos claros, textos oscuros, gráficos con colores visibles. Si aún ves problemas, comparte más detalles o una captura del modo claro. ¡Avísame si necesitas más ajustes!