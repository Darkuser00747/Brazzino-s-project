<template>
  <div class="auth-container">
    <!-- Botones de navegación -->
    <div class="nav-buttons">
      <button @click="goHome" class="nav-btn home-btn" title="Volver al inicio">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Inicio</span>
      </button>
      
      <button @click="goToAdminPanel" class="nav-btn admin-btn" title="Panel de Administrador">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Admin</span>
      </button>
    </div>

    <!-- Modal de Recuperación de Contraseña -->
    <div v-if="showForgotPasswordModal" class="modal-overlay" @click="closeForgotPasswordModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>{{ currentStep === 'email' ? 'Recuperar Contraseña' : currentStep === 'code' ? 'Verificar Código' : 'Nueva Contraseña' }}</h3>
          <button @click="closeForgotPasswordModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Paso 1: Solicitar Email -->
        <div v-if="currentStep === 'email'" class="modal-content">
          <div class="modal-info">
            <div class="info-icon">📧</div>
            <p>Ingresa tu dirección de email y te enviaremos un código de verificación para restablecer tu contraseña</p>
          </div>
          
          <form @submit.prevent="sendResetCode" class="modal-form">
            <div class="form-group">
              <label for="reset-email">Dirección de Email:</label>
              <input
                type="email"
                id="reset-email"
                v-model="forgotPasswordData.email"
                placeholder="ejemplo@correo.com"
                required
                :disabled="isProcessing"
                autocomplete="email"
              />
            </div>
            
            <button type="submit" class="modal-btn primary" :disabled="isProcessing || !forgotPasswordData.email">
              <span v-if="isProcessing" class="spinner"></span>
              {{ isProcessing ? 'Enviando...' : 'Enviar Código' }}
            </button>
          </form>
        </div>

        <!-- Paso 2: Verificar Código -->
        <div v-if="currentStep === 'code'" class="modal-content">
          <div class="modal-info">
            <div class="info-icon">🔐</div>
            <p>Hemos enviado un código de 6 dígitos a <strong>{{ maskedEmail }}</strong></p>
            <p class="email-info">Revisa tu bandeja de entrada y carpeta de spam</p>
          </div>
          
          <form @submit.prevent="verifyResetCode" class="modal-form">
            <div class="form-group">
              <label for="verification-code">Código de Verificación:</label>
              <div class="code-input-container">
                <input
                  v-for="(digit, index) in verificationCode"
                  :key="index"
                  :ref="'codeInput' + index"
                  type="text"
                  maxlength="1"
                  v-model="verificationCode[index]"
                  @input="handleCodeInput(index, $event)"
                  @keydown="handleCodeKeydown(index, $event)"
                  @paste="handleCodePaste($event)"
                  class="code-digit"
                  :disabled="isProcessing"
                />
              </div>
            </div>

            <div class="code-timer">
              <span v-if="codeTimer > 0" class="timer-text">
                Código válido por {{ Math.floor(codeTimer / 60) }}:{{ (codeTimer % 60).toString().padStart(2, '0') }}
              </span>
              <button 
                v-else 
                type="button" 
                @click="resendCode" 
                class="resend-btn"
                :disabled="isProcessing"
              >
                Reenviar código
              </button>
            </div>
            
            <button type="submit" class="modal-btn primary" :disabled="isProcessing || !isCodeComplete">
              <span v-if="isProcessing" class="spinner"></span>
              {{ isProcessing ? 'Verificando...' : 'Verificar Código' }}
            </button>
          </form>
        </div>

        <!-- Paso 3: Nueva Contraseña -->
        <div v-if="currentStep === 'reset'" class="modal-content">
          <div class="modal-info">
            <div class="info-icon">🔑</div>
            <p>Crea una nueva contraseña segura para tu cuenta</p>
          </div>
          
          <form @submit.prevent="resetPassword" class="modal-form">
            <div class="form-group">
              <label for="new-password-reset">Nueva Contraseña:</label>
              <div class="password-input-container">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  id="new-password-reset"
                  v-model="forgotPasswordData.newPassword"
                  required
                  placeholder="Mínimo 8 caracteres"
                  :disabled="isProcessing"
                  minlength="8"
                  autocomplete="new-password"
                  @input="validateNewPassword"
                />
                <button 
                  type="button" 
                  @click="toggleNewPasswordVisibility" 
                  class="password-toggle-btn"
                  :disabled="isProcessing"
                >
                  <svg v-if="showNewPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 2 12 2 12C2.62125 10.6892 3.51445 9.50484 4.62 8.52M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 22 12 22 12C21.393 13.1356 20.6081 14.1992 19.68 15.15M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1749 15.0074 10.8016 14.8565C10.4283 14.7056 10.0887 14.481 9.80385 14.1962C9.51900 13.9113 9.29440 13.5717 9.14351 13.1984C8.99262 12.8251 8.91851 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <!-- Indicador de fortaleza -->
              <div v-if="forgotPasswordData.newPassword" class="password-strength">
                <div class="strength-bar">
                  <div 
                    class="strength-fill" 
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrengthWidth + '%' }"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrengthClass">
                  {{ passwordStrengthText }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirm-password-reset">Confirmar Nueva Contraseña:</label>
              <div class="password-input-container">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirm-password-reset"
                  v-model="forgotPasswordData.confirmPassword"
                  required
                  placeholder="Repite tu nueva contraseña"
                  :disabled="isProcessing"
                  autocomplete="new-password"
                />
                <button 
                  type="button" 
                  @click="toggleConfirmPasswordVisibility" 
                  class="password-toggle-btn"
                  :disabled="isProcessing"
                >
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 2 12 2 12C2.62125 10.6892 3.51445 9.50484 4.62 8.52M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 22 12 22 12C21.393 13.1356 20.6081 14.1992 19.68 15.15M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1749 15.0074 10.8016 14.8565C10.4283 14.7056 10.0887 14.481 9.80385 14.1962C9.51900 13.9113 9.29440 13.5717 9.14351 13.1984C8.99262 12.8251 8.91851 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <!-- Indicador de coincidencia -->
              <div v-if="forgotPasswordData.confirmPassword" class="password-match">
                <span v-if="passwordsMatch" class="match-success">✓ Las contraseñas coinciden</span>
                <span v-else class="match-error">✗ Las contraseñas no coinciden</span>
              </div>
            </div>
            
            <button type="submit" class="modal-btn primary" :disabled="isProcessing || !isResetFormValid">
              <span v-if="isProcessing" class="spinner"></span>
              {{ isProcessing ? 'Actualizando...' : 'Restablecer Contraseña' }}
            </button>
          </form>
        </div>

        <!-- Mensajes del modal -->
        <div v-if="modalError" class="message error-message">
          <i class="message-icon">⚠</i>
          {{ modalError }}
        </div>

        <div v-if="modalSuccess" class="message success-message">
          <i class="message-icon">✅</i>
          {{ modalSuccess }}
        </div>
      </div>
    </div>

    <!-- Componente de Login Principal -->
    <div v-if="currentView !== 'admin'" class="auth-card">
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: currentView === 'login' }"
          @click="switchView('login')"
        >
          Iniciar Sesión
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentView === 'register' }"
          @click="switchView('register')"
        >
          Registrarse
        </button>
      </div>

      <!-- Vista de Login -->
      <div v-if="currentView === 'login'" class="auth-view">
        <div class="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de vuelta</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-email">Email:</label>
            <input
              type="email"
              id="login-email"
              v-model="loginData.email"
              required
              placeholder="ejemplo@correo.com"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="login-password">Contraseña:</label>
            <input
              type="password"
              id="login-password"
              v-model="loginData.password"
              required
              placeholder="Tu contraseña"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              Recordarme
            </label>
            <!-- ENLACE MODIFICADO PARA ABRIR EL MODAL -->
            <button 
              type="button" 
              @click="openForgotPasswordModal" 
              class="forgot-password-btn"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          
          <button type="submit" class="auth-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>

      <!-- Vista de Registro -->
      <div v-if="currentView === 'register'" class="auth-view">
        <div class="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a nuestra plataforma</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="register-name">Nombre:</label>
            <input
              type="text"
              id="register-name"
              v-model="registerData.name"
              required
              placeholder="Tu nombre"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="register-email">Email:</label>
            <input
              type="email"
              id="register-email"
              v-model="registerData.email"
              required
              placeholder="ejemplo@correo.com"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="register-password">Contraseña:</label>
            <input
              type="password"
              id="register-password"
              v-model="registerData.password"
              required
              placeholder="Mínimo 6 caracteres"
              :disabled="isLoading"
              minlength="6"
            />
          </div>

          <div class="form-group">
            <label for="register-confirm-password">Confirmar Contraseña:</label>
            <input
              type="password"
              id="register-confirm-password"
              v-model="registerData.confirmPassword"
              required
              placeholder="Repite tu contraseña"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="register-phone">Teléfono (opcional):</label>
            <input
              type="tel"
              id="register-phone"
              v-model="registerData.phone"
              placeholder="Ej: +57 300 123 4567"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptTerms" required>
              <span class="checkmark"></span>
              Acepto los <a href="#" class="terms-link">términos y condiciones</a>
            </label>
          </div>
          
          <button type="submit" class="auth-btn" :disabled="isLoading || !acceptTerms">
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>
      </div>
      
      <!-- Mensajes de error y éxito -->
      <div v-if="error" class="message error-message">
        <i class="message-icon">⚠</i>
        {{ error }}
      </div>

      <div v-if="successMessage" class="message success-message">
        <i class="message-icon">✅</i>
        {{ successMessage }}
      </div>
    </div>

    <!-- VISTA DE ADMIN SEPARADA - SIN TABS -->
    <div v-if="currentView === 'admin'" class="auth-card admin-card">
      <!-- Botón para volver al login normal -->
      <button @click="backToUserLogin" class="back-to-login-btn" title="Volver al login de usuarios">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Volver al Login</span>
      </button>

      <div class="auth-view admin-auth-view">
        <div class="auth-header">
          <h2>Panel de Administración</h2>
          <p>Inicia sesión como administrador</p>
        </div>
        
        <form @submit.prevent="handleAdminLogin" class="auth-form">
          <div class="form-group">
            <label for="admin-email">Correo Administrativo:</label>
            <input
              type="email"
              id="admin-email"
              v-model="adminLoginData.email"
              required
              placeholder="admin@correo.com"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="admin-password">Contraseña:</label>
            <input
              type="password"
              id="admin-password"
              v-model="adminLoginData.password"
              required
              placeholder="Contraseña de administrador"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              Mantener sesión iniciada
            </label>
          </div>
          
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>

      <!-- Mensajes de error y éxito del admin -->
      <div v-if="error" class="message error-message">
        <i class="message-icon">⚠</i>
        {{ error }}
      </div>

      <div v-if="successMessage" class="message success-message">
        <i class="message-icon">✅</i>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordAuthComponent',
  data() {
    return {
      currentView: 'login', // 'login' o 'register'
      loginData: {
        email: '',
        password: ''
      },
      registerData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      },
      adminLoginData: {
        email: '',
        password: ''
      },
      rememberMe: false,
      acceptTerms: false,
      isLoading: false,
      error: '',
      successMessage: '',

      // Sistema de recuperación de contraseña
      showForgotPasswordModal: false,
      currentStep: 'email', // 'email', 'code', 'reset'
      isProcessing: false,
      modalError: '',
      modalSuccess: '',
      
      forgotPasswordData: {
        email: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // Código de verificación
      verificationCode: ['', '', '', '', '', ''],
      generatedCode: '',
      codeTimer: 0,
      timerInterval: null,
      
      // Validación de contraseña
      passwordStrength: 0,
      showNewPassword: false,
      showConfirmPassword: false
    }
  },

  computed: {
    maskedEmail() {
      if (!this.forgotPasswordData.email) return '';
      const [username, domain] = this.forgotPasswordData.email.split('@');
      const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
      return `${maskedUsername}@${domain}`;
    },

    isCodeComplete() {
      return this.verificationCode.every(digit => digit !== '');
    },

    passwordsMatch() {
      return this.forgotPasswordData.newPassword === this.forgotPasswordData.confirmPassword;
    },

    passwordStrengthClass() {
      if (this.passwordStrength <= 1) return 'weak';
      if (this.passwordStrength <= 2) return 'fair';
      if (this.passwordStrength <= 3) return 'good';
      return 'strong';
    },

    passwordStrengthWidth() {
      return (this.passwordStrength / 4) * 100;
    },

    passwordStrengthText() {
      const texts = ['Muy Débil', 'Débil', 'Regular', 'Buena', 'Muy Fuerte'];
      return texts[this.passwordStrength] || 'Muy Débil';
    },

    isResetFormValid() {
      return (
        this.forgotPasswordData.newPassword &&
        this.forgotPasswordData.confirmPassword &&
        this.passwordsMatch &&
        this.passwordStrength >= 3
      );
    }
  },

  methods: {
  // Método para ir al inicio
    goHome() {
      if (this.$router) {
        this.$router.push('/');
      } else {
        window.location.href = '/';
      }
    },

    // Método para ir al panel de administrador
    goToAdminPanel() {
      // Cambiar a vista de admin
      this.currentView = 'admin';
      this.clearMessages();
      this.resetAdminData();
    },
    backToUserLogin() {
      this.currentView = 'login';
      this.clearMessages();
      this.resetForms();
    },
    switchView(view) {
      this.currentView = view;
      this.clearMessages();
      this.resetForms();
    },
    clearMessages() {
      this.error = '';
      this.successMessage = '';
    },

    
    // ==== MÉTODOS DE LOGIN DE ADMINISTRADOR ====

    // Resetear datos de admin
    resetAdminData() {
      this.adminLoginData = {
        email: '',
        password: '',
        accessCode: ''
      };
      this.showAdminPassword = false;
    },

    // Alternar visibilidad de contraseña de admin
    toggleAdminPasswordVisibility() {
      this.showAdminPassword = !this.showAdminPassword;
    },

    // Verificar credenciales de administrador
    verifyAdminCredentials(email, password, accessCode = '') {
      // Lista de administradores predefinidos
      const adminCredentials = [
        {
          email: 'admin@admin.com',
          password: 'admin123',
          name: 'Administrador Principal',
          level: 'super',
          accessCode: 'MASTER2024'
        },
        {
          email: 'administrador@sistema.com',
          password: 'seguro456',
          name: 'Administrador del Sistema',
          level: 'system',
          accessCode: 'SYS2024'
        },
        {
          email: 'admin@empresa.com',
          password: 'empresa789',
          name: 'Administrador Empresarial',
          level: 'business',
          accessCode: 'BIZ2024'
        }
      ];

      // Buscar admin por email y password
      const admin = adminCredentials.find(a => 
        a.email.toLowerCase() === email.toLowerCase() && 
        a.password === password
      );

      if (!admin) return null;

      // Verificar código de acceso si se proporciona
      if (accessCode && accessCode !== admin.accessCode) {
        return { ...admin, codeValid: false };
      }

      return { ...admin, codeValid: true };
    },

    // Manejar login de administrador
    async handleAdminLogin() {
      this.isAdminProcessing = true;
      this.clearMessages();

      try {
        // Validaciones básicas
        if (!this.adminLoginData.email || !this.adminLoginData.password) {
          throw new Error('Por favor completa todos los campos requeridos');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.adminLoginData.email)) {
          throw new Error('Por favor ingresa un email válido');
        }

        // Simular delay de verificación
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar credenciales
        const adminUser = this.verifyAdminCredentials(
          this.adminLoginData.email,
          this.adminLoginData.password,
          this.adminLoginData.accessCode
        );

        if (!adminUser) {
          throw new Error('Credenciales de administrador incorrectas');
        }

        // Verificar código de acceso si se proporcionó
        if (this.adminLoginData.accessCode && !adminUser.codeValid) {
          throw new Error('Código de acceso inválido');
        }

        // Generar token de admin
        const adminToken = 'admin-jwt-' + this.generateUserId();
        
        // Guardar sesión de admin
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('adminUser', JSON.stringify({
          id: adminUser.email,
          email: adminUser.email,
          name: adminUser.name,
          level: adminUser.level,
          loginTime: new Date().toISOString()
        }));

        this.successMessage = `¡Bienvenido, ${adminUser.name}! Accediendo al panel...`;
        
        // Redirigir al panel después de 2 segundos
        setTimeout(() => {
          if (this.$router) {
            this.$router.push('/admin');
          } else {
            window.location.href = '/admin';
          }
        }, 2000);

      } catch (error) {
        this.error = error.message;
      } finally {
        this.isAdminProcessing = false;
      }
    },
  
    // ==== MÉTODOS DE RECUPERACIÓN DE CONTRASEÑA ====

    // Abrir modal de recuperación
    openForgotPasswordModal() {
      this.showForgotPasswordModal = true;
      this.currentStep = 'email';
      this.clearModalMessages();
      this.resetForgotPasswordData();
    },

    // Cerrar modal de recuperación
    closeForgotPasswordModal() {
      this.showForgotPasswordModal = false;
      this.clearModalMessages();
      this.resetForgotPasswordData();
      this.stopTimer();
    },

    // Limpiar mensajes del modal
    clearModalMessages() {
      this.modalError = '';
      this.modalSuccess = '';
    },

    // Resetear datos de recuperación
    resetForgotPasswordData() {
      this.forgotPasswordData = {
        email: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.verificationCode = ['', '', '', '', '', ''];
      this.generatedCode = '';
      this.passwordStrength = 0;
    },

    // Generar código de verificación
    generateVerificationCode() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Obtener usuarios registrados
    getRegisteredUsers() {
      try {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
      }
    },

    // Verificar si existe un usuario con el email
    findUserByEmail(email) {
      const users = this.getRegisteredUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },

    // Enviar código de restablecimiento
    async sendResetCode() {
      this.isProcessing = true;
      this.clearModalMessages();

      try {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Verificar si el email existe
        const user = this.findUserByEmail(this.forgotPasswordData.email);
        if (!user) {
          throw new Error('No encontramos una cuenta asociada a este email');
        }

        // Generar código
        this.generatedCode = this.generateVerificationCode();
        
        // Simular envío de email
        console.log(`Código de verificación enviado a ${this.forgotPasswordData.email}: ${this.generatedCode}`);
        
        // Iniciar timer de 10 minutos
        this.codeTimer = 600;
        this.startTimer();

        this.modalSuccess = 'Código enviado exitosamente. Revisa tu email.';
        
        // Cambiar al siguiente paso después de 2 segundos
        setTimeout(() => {
          this.currentStep = 'code';
          this.clearModalMessages();
        }, 2000);

      } catch (error) {
        this.modalError = error.message;
      } finally {
        this.isProcessing = false;
      }
    },

    // Iniciar timer del código
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      this.timerInterval = setInterval(() => {
        this.codeTimer--;
        if (this.codeTimer <= 0) {
          this.stopTimer();
        }
      }, 1000);
    },

    // Detener timer del código
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    // Reenviar código
    async resendCode() {
      this.isProcessing = true;
      this.clearModalMessages();

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generar nuevo código
        this.generatedCode = this.generateVerificationCode();
        
        console.log(`Nuevo código enviado a ${this.forgotPasswordData.email}: ${this.generatedCode}`);
        
        // Reiniciar timer
        this.codeTimer = 600;
        this.startTimer();

        this.modalSuccess = 'Nuevo código enviado exitosamente.';
        setTimeout(() => this.clearModalMessages(), 3000);

      } catch (error) {
        this.modalError = 'Error al reenviar el código. Inténtalo de nuevo.';
      } finally {
        this.isProcessing = false;
      }
    },

    // Manejar entrada de código
    handleCodeInput(index, event) {
      const value = event.target.value;
      
      if (value && /^\d$/.test(value)) {
        this.verificationCode[index] = value;
        
        // Mover al siguiente campo
        if (index < 5) {
          const nextInput = this.$refs[`codeInput${index + 1}`][0];
          if (nextInput) {
            nextInput.focus();
          }
        }
      } else if (!value) {
        this.verificationCode[index] = '';
      }
    },

    // Manejar teclas en código
    handleCodeKeydown(index, event) {
      if (event.key === 'Backspace' && !this.verificationCode[index] && index > 0) {
        const prevInput = this.$refs[`codeInput${index - 1}`][0];
        if (prevInput) {
          prevInput.focus();
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        const prevInput = this.$refs[`codeInput${index - 1}`][0];
        if (prevInput) {
          prevInput.focus();
        }
      } else if (event.key === 'ArrowRight' && index < 5) {
        const nextInput = this.$refs[`codeInput${index + 1}`][0];
        if (nextInput) {
          nextInput.focus();
        }
      }
    },

    // Manejar pegado de código
    handleCodePaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').slice(0, 6);
      
      if (/^\d{6}$/.test(pastedData)) {
        for (let i = 0; i < 6; i++) {
          this.verificationCode[i] = pastedData[i];
        }
      }
    },

    // Verificar código de restablecimiento
    async verifyResetCode() {
      this.isProcessing = true;
      this.clearModalMessages();

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const enteredCode = this.verificationCode.join('');
        
        if (enteredCode !== this.generatedCode) {
          throw new Error('Código de verificación incorrecto');
        }

        if (this.codeTimer <= 0) {
          throw new Error('El código ha expirado. Solicita uno nuevo.');
        }

        this.modalSuccess = '¡Código verificado correctamente!';
        
        setTimeout(() => {
          this.currentStep = 'reset';
          this.clearModalMessages();
        }, 1500);

      } catch (error) {
        this.modalError = error.message;
      } finally {
        this.isProcessing = false;
      }
    },

    // Alternar visibilidad de contraseñas
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    // Validar fortaleza de la nueva contraseña
    validateNewPassword() {
      const password = this.forgotPasswordData.newPassword;
      
      // Calcular fortaleza basada en criterios
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

      this.passwordStrength = strength;
    },

    // Guardar usuarios actualizados
    saveUsers(users) {
      try {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return true;
      } catch (error) {
        console.error('Error al guardar usuarios:', error);
        return false;
      }
    },

    // Restablecer contraseña
    async resetPassword() {
      this.isProcessing = true;
      this.clearModalMessages();

      try {
        // Validaciones
        if (!this.forgotPasswordData.newPassword || !this.forgotPasswordData.confirmPassword) {
          throw new Error('Por favor completa todos los campos');
        }

        if (this.forgotPasswordData.newPassword.length < 8) {
          throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        if (!this.passwordsMatch) {
          throw new Error('Las contraseñas no coinciden');
        }

        if (this.passwordStrength < 3) {
          throw new Error('La contraseña no es lo suficientemente fuerte');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Buscar y actualizar usuario
        const users = this.getRegisteredUsers();
        const userIndex = users.findIndex(user => 
          user.email.toLowerCase() === this.forgotPasswordData.email.toLowerCase()
        );

        if (userIndex === -1) {
          throw new Error('Usuario no encontrado');
        }

        // Actualizar contraseña
        users[userIndex].password = this.forgotPasswordData.newPassword;
        users[userIndex].lastPasswordReset = new Date().toISOString();

        const saved = this.saveUsers(users);
        if (!saved) {
          throw new Error('Error al guardar la nueva contraseña');
        }

        // Detener timer
        this.stopTimer();

        this.modalSuccess = '¡Contraseña restablecida exitosamente! Ya puedes iniciar sesión.';
        
        // Cerrar modal y rellenar email en login después de 3 segundos
        setTimeout(() => {
          this.loginData.email = this.forgotPasswordData.email;
          this.closeForgotPasswordModal();
        }, 3000);

      } catch (error) {
        this.modalError = error.message;
      } finally {
        this.isProcessing = false;
      }
    },

    // ==== MÉTODOS ORIGINALES DE AUTENTICACIÓN ====

    switchView(view) {
      this.currentView = view;
      this.clearMessages();
      this.resetForms();
    },

    clearMessages() {
      this.error = '';
      this.successMessage = '';
    },

    resetForms() {
      this.loginData = { email: '', password: '' };
      this.registerData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      };
      this.acceptTerms = false;
      this.rememberMe = false;
    },

    getExistingUsers() {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    },

    generateUserId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    async handleRegister() {
      this.isLoading = true;
      this.clearMessages();
      
      try {
        if (!this.registerData.name.trim()) {
          throw new Error('El nombre es requerido');
        }

        if (!this.registerData.email || !this.registerData.password) {
          throw new Error('Por favor completa todos los campos obligatorios');
        }

        if (this.registerData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        if (this.registerData.password !== this.registerData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.registerData.email)) {
          throw new Error('Por favor ingresa un email válido');
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        const existingUsers = this.getExistingUsers();
        const emailExists = existingUsers.some(user => 
          user.email.toLowerCase() === this.registerData.email.toLowerCase()
        );

        if (emailExists) {
          throw new Error('Este email ya está registrado');
        }

        const newUser = {
          id: this.generateUserId(),
          name: this.registerData.name.trim(),
          email: this.registerData.email.toLowerCase(),
          password: this.registerData.password,
          phone: this.registerData.phone.trim() || null,
          createdAt: new Date().toISOString(),
          isActive: true
        };

        existingUsers.push(newUser);
        this.saveUsers(existingUsers);

        this.successMessage = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.';
        
        setTimeout(() => {
          this.switchView('login');
          this.loginData.email = newUser.email;
        }, 2000);
        
      } catch (err) {
        this.error = err.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
      } finally {
        this.isLoading = false;
      }
    },

    async handleLogin() {
      this.isLoading = true;
      this.clearMessages();
      
      try {
        if (!this.loginData.email || !this.loginData.password) {
          throw new Error('Por favor completa todos los campos');
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const registeredUsers = this.getExistingUsers();
        const user = registeredUsers.find(u => 
          u.email.toLowerCase() === this.loginData.email.toLowerCase() && 
          u.password === this.loginData.password &&
          u.isActive
        );

        if (user) {
          const authToken = 'jwt-' + this.generateUserId();
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone
          }));

          this.successMessage = `¡Bienvenido, ${user.name}!`;
          
          setTimeout(() => {
            if (this.$router) {
              this.$router.push('/');
            } else {
              window.location.href = '/';
            }
          }, 1000);
          
        } else {
          throw new Error('Credenciales incorrectas o cuenta inactiva');
        }
        
      } catch (err) {
        this.error = err.message || 'Error en la autenticación. Verifica tus credenciales.';
      } finally {
        this.isLoading = false;
      }
    }
  },

  // Limpiar timer al destruir el componente
  beforeDestroy() {
    this.stopTimer();
  },
  
 
}
</script>

<style scoped>
/* Estilos base heredados */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #3d3d3d 75%, #1a1a1a 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-y: auto;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.5" fill="%23ffffff" opacity="0.03"/><circle cx="80" cy="80" r="0.3" fill="%23ffffff" opacity="0.02"/><circle cx="40" cy="60" r="0.4" fill="%23ffffff" opacity="0.025"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.5;
  pointer-events: none;
}

/* Botones de navegación */
.nav-buttons {
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 1000;
}

.nav-btn {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 215, 0, 0.1);
  color: #FFD700;
}

.nav-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 
    0 12px 35px rgba(255, 215, 0, 0.4),
    inset 0 1px 0 rgba(255, 215, 0, 0.2);
}

.nav-btn:hover svg {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

/* =================================== */
/* ESTILOS DEL MODAL DE RECUPERACIÓN   */
/* =================================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    0 0 0 1px rgba(255, 215, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  position: relative;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #FF4500, #8B4513, #FFD700);
  background-size: 400% 400%;
  animation: shimmer 3s ease-in-out infinite;
  border-radius: 20px 20px 0 0;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #FFD700;
  font-size: 1.6rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: 1px solid rgba(255, 69, 0, 0.3);
  color: #FF4500;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.close-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.close-btn:hover {
  background: rgba(255, 69, 0, 0.1);
  border-color: #FF4500;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 69, 0, 0.4);
}

.modal-content {
  padding: 2rem;
}

.modal-info {
  text-align: center;
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.8));
    transform: scale(1.05);
  }
}

.modal-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}

.email-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #FFD700;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-group input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 
    0 0 0 3px rgba(255, 215, 0, 0.2),
    inset 0 0 15px rgba(255, 215, 0, 0.1);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

/* Entrada de código de verificación */
.code-input-container {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin: 1rem 0;
}

.code-digit {
  width: 50px !important;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 2px solid rgba(255, 215, 0, 0.3) !important;
  border-radius: 12px !important;
  background: rgba(0, 0, 0, 0.6) !important;
  color: #FFD700 !important;
  padding: 0 !important;
  transition: all 0.3s ease;
}

/* Timer del código */
.code-timer {
  text-align: center;
  margin: 1rem 0;
}

.timer-text {
  color: #FFD700;
  font-size: 0.9rem;
  font-weight: 600;
}

.resend-btn {
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.resend-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

/* Contenedor de contraseña con botón de mostrar/ocultar */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container input {
  width: 100%;
  padding-right: 3rem !important;
}

.password-toggle-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle-btn:hover:not(:disabled) {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-50%) scale(1.1);
}

.password-toggle-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

/* Indicador de fortaleza de contraseña */
.password-strength {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.weak {
  background: linear-gradient(90deg, #DC2626, #EF4444);
}

.strength-fill.fair {
  background: linear-gradient(90deg, #F59E0B, #FBBF24);
}

.strength-fill.good {
  background: linear-gradient(90deg, #10B981, #34D399);
}

.strength-fill.strong {
  background: linear-gradient(90deg, #059669, #10B981);
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
  text-align: center;
}

.strength-text.weak { color: #EF4444; }
.strength-text.fair { color: #FBBF24; }
.strength-text.good { color: #34D399; }
.strength-text.strong { color: #10B981; }

/* Indicador de coincidencia */
.password-match {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.match-success {
  color: #34D399;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.match-error {
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Botones del modal */
.modal-btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.modal-btn.primary {
  background: linear-gradient(135deg, #FFD700, #FF4500);
  color: #000000;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.modal-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ==================================== */
/* ESTILOS DEL COMPONENTE DE LOGIN      */
/* ==================================== */

.auth-card {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 0;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 215, 0, 0.1),
    0 0 0 1px rgba(255, 215, 0, 0.05);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #FF4500, #8B4513, #FFD700);
  background-size: 400% 400%;
  animation: shimmer 3s ease-in-out infinite;
}

.auth-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 1.2rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  position: relative;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-btn.active {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  border-bottom-color: #FFD700;
}

.tab-btn:hover:not(.active) {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}

.auth-view {
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  margin: 0 0 0.5rem 0;
  color: #FFD700;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  letter-spacing: 1px;
}

.auth-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-style: italic;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-form .form-group label {
  color: #FFD700;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;
}

.auth-form .form-group input {
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  backdrop-filter: blur(10px);
}

.auth-form .form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.auth-form .form-group input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 
    0 0 0 3px rgba(255, 215, 0, 0.2),
    inset 0 0 20px rgba(255, 215, 0, 0.1);
  transform: translateY(-1px);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
  gap: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 0.5rem;
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: #FFD700;
}

/* BOTÓN MODIFICADO PARA "¿OLVIDASTE TU CONTRASEÑA?" */
.forgot-password-btn {
  background: transparent;
  border: none;
  color: #FFD700;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  padding: 0;
  font-family: inherit;
}

.forgot-password-btn:hover {
  color: #FF4500;
  text-decoration: underline;
  text-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
  transform: scale(1.05);
}

.forgot-password-btn:active {
  transform: scale(0.98);
}

.terms-link {
  color: #FFD700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.terms-link:hover {
  color: #FF4500;
  text-decoration: underline;
  text-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
}

.auth-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FF4500 50%, #8B4513 100%);
  background-size: 200% 200%;
  color: #000000;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.auth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.auth-btn:hover:not(:disabled) {
  background-position: 100% 100%;
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(255, 215, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.auth-btn:hover:not(:disabled)::before {
  left: 100%;
}

.auth-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: rgba(255, 215, 0, 0.3);
}

/* Mensajes */
.message {
  padding: 1rem 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid;
}

.error-message {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.4);
  color: #FCA5A5;
}

.success-message {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #86EFAC;
}

.message-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 5px currentColor);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-buttons {
    top: 1rem;
    left: 1rem;
    gap: 0.5rem;
  }
  
  .nav-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
  
  .nav-btn svg {
    width: 16px;
    height: 16px;
  }

  .modal-card {
    width: 95%;
    margin: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .modal-header h3 {
    font-size: 1.4rem;
  }

  .code-input-container {
    gap: 0.5rem;
  }

  .code-digit {
    width: 40px !important;
    height: 50px;
    font-size: 1.2rem !important;
  }

  .auth-card {
    max-width: 95%;
  }

  .auth-view {
    padding: 2rem 1.5rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1rem;
  }

  .nav-buttons {
    top: 0.5rem;
    left: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-btn {
    padding: 0.5rem 0.8rem;
    border-radius: 25px;
    justify-content: center;
    min-width: 60px;
  }
  
  .nav-btn span {
    display: none; /* Ocultar texto en móvil */
  }

  .modal-card {
    width: 98%;
    margin: 0.5rem;
    border-radius: 15px;
  }

  .modal-content {
    padding: 1rem;
  }

  .modal-header {
    padding: 1rem 1rem 0.5rem;
  }

  .modal-header h3 {
    font-size: 1.2rem;
  }

  .info-icon {
    font-size: 3rem !important;
  }

  .code-input-container {
    gap: 0.3rem;
  }

  .code-digit {
    width: 35px !important;
    height: 45px;
    font-size: 1.1rem !important;
  }

  .password-strength {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .strength-text {
    text-align: left;
    min-width: auto;
  }

  .auth-card {
    max-width: 100%;
  }

  .auth-view {
    padding: 2rem 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.6rem;
  }

  .tab-btn {
    padding: 1rem;
    font-size: 0.85rem;
  }
}

/* Efectos adicionales para el tema de bar */
@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.auth-card {
  animation: subtle-glow 4s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% { 
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 215, 0, 0.1),
      0 0 0 1px rgba(255, 215, 0, 0.05);
  }
  50% { 
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 215, 0, 0.2),
      0 0 0 1px rgba(255, 215, 0, 0.1),
      0 0 20px rgba(255, 215, 0, 0.1);
  }
}
/* ========================================= */
/* ESTILOS DEL PANEL DE ADMINISTRACIÓN      */
/* ========================================= */

.admin-auth-view {
  position: relative;
}

/* Indicador visual de sección administrativa */
.admin-auth-view::before {
  content: '🔒';
  position: absolute;
  top: -1rem;
  right: -1rem;
  font-size: 4rem;
  opacity: 0.1;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5));
  animation: admin-pulse 3s ease-in-out infinite;
}

@keyframes admin-pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.15;
  }
}

/* Header del panel administrativo */
.admin-auth-view .auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  position: relative;
}

.admin-auth-view .auth-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #DC2626, transparent);
  animation: slide-glow 2s ease-in-out infinite;
}

@keyframes slide-glow {
  0%, 100% { width: 60px; opacity: 1; }
  50% { width: 100px; opacity: 0.7; }
}

.admin-auth-view .auth-header h2 {
  margin: 0 0 0.8rem 0;
  color: #DC2626;
  font-size: 2.2rem;
  font-weight: 800;
  text-shadow: 
    0 0 20px rgba(220, 38, 38, 0.6),
    0 0 40px rgba(220, 38, 38, 0.3);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #DC2626, #EF4444, #DC2626);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.admin-auth-view .auth-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Formulario administrativo */
.admin-auth-view .auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.admin-auth-view .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
}

/* Labels con estilo administrativo */
.admin-auth-view .form-group label {
  color: #DC2626;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
}

.admin-auth-view .form-group label::before {
  content: '⚠';
  font-size: 0.9rem;
  filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.5));
}

/* Inputs con tema administrativo */
.admin-auth-view .form-group input {
  padding: 1.1rem 1.3rem;
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  backdrop-filter: blur(15px);
  font-weight: 500;
  box-shadow: 
    inset 0 2px 8px rgba(220, 38, 38, 0.1),
    0 0 0 0 rgba(220, 38, 38, 0);
}

.admin-auth-view .form-group input::placeholder {
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
  font-weight: 400;
}

.admin-auth-view .form-group input:focus {
  outline: none;
  border-color: #DC2626;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 
    0 0 0 4px rgba(220, 38, 38, 0.2),
    inset 0 0 25px rgba(220, 38, 38, 0.15),
    0 0 30px rgba(220, 38, 38, 0.2);
  transform: translateY(-2px);
}

.admin-auth-view .form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.3);
}

/* Animación al hacer focus */
.admin-auth-view .form-group input:focus + label::before {
  animation: warning-blink 0.5s ease;
}

@keyframes warning-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Opciones del formulario */
.admin-auth-view .form-options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -0.5rem;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

/* Checkbox personalizado para admin */
.admin-auth-view .checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  letter-spacing: 0.3px;
  user-select: none;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 2rem;
}

.admin-auth-view .checkbox-container:hover {
  color: #FCA5A5;
}

.admin-auth-view .checkbox-container input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Checkmark personalizado */
.admin-auth-view .checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 22px;
  width: 22px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 6px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.admin-auth-view .checkbox-container:hover .checkmark {
  border-color: #DC2626;
  background: rgba(220, 38, 38, 0.1);
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
}

.admin-auth-view .checkbox-container input[type="checkbox"]:checked ~ .checkmark {
  background: linear-gradient(135deg, #DC2626, #EF4444);
  border-color: #DC2626;
  box-shadow: 
    0 0 20px rgba(220, 38, 38, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.admin-auth-view .checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
}

.admin-auth-view .checkbox-container input[type="checkbox"]:checked ~ .checkmark::after {
  display: block;
  animation: check-bounce 0.3s ease;
}

@keyframes check-bounce {
  0% { transform: rotate(45deg) scale(0); }
  50% { transform: rotate(45deg) scale(1.2); }
  100% { transform: rotate(45deg) scale(1); }
}

/* Botón de envío administrativo */
.admin-auth-view .submit-btn {
  background: linear-gradient(135deg, #DC2626 0%, #991B1B 50%, #7F1D1D 100%);
  background-size: 200% 200%;
  color: #ffffff;
  border: 2px solid rgba(220, 38, 38, 0.5);
  padding: 1.2rem 1.8rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 6px 20px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.admin-auth-view .submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.admin-auth-view .submit-btn::after {
  content: '🔐';
  font-size: 1.1rem;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}

.admin-auth-view .submit-btn:hover:not(:disabled) {
  background-position: 100% 100%;
  transform: translateY(-3px);
  box-shadow: 
    0 10px 30px rgba(220, 38, 38, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 40px rgba(220, 38, 38, 0.3);
  border-color: #DC2626;
}

.admin-auth-view .submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.admin-auth-view .submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 
    0 5px 15px rgba(220, 38, 38, 0.5),
    inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.admin-auth-view .submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: rgba(220, 38, 38, 0.3);
  animation: pulse-disabled 1.5s ease-in-out infinite;
}

@keyframes pulse-disabled {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.4; }
}

/* Efecto de carga en el botón */
.admin-auth-view .submit-btn:disabled::after {
  content: '⏳';
  animation: loading-rotate 1s linear infinite;
}

@keyframes loading-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mensaje de seguridad administrativo */
.admin-security-notice {
  margin-top: 2rem;
  padding: 1rem 1.2rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  backdrop-filter: blur(10px);
}

.admin-security-notice::before {
  content: '🛡️';
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.5));
}

.admin-security-notice p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.5;
  font-style: italic;
}

/* Responsive Design para Panel Admin */
@media (max-width: 768px) {
  .admin-auth-view .auth-header h2 {
    font-size: 1.8rem;
  }

  .admin-auth-view .auth-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }

  .admin-auth-view .form-group input {
    padding: 1rem 1.1rem;
  }

  .admin-auth-view .submit-btn {
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .admin-auth-view::before {
    font-size: 3rem;
    top: -0.5rem;
    right: -0.5rem;
  }

  .admin-auth-view .auth-header h2 {
    font-size: 1.5rem;
  }

  .admin-auth-view .form-group label {
    font-size: 0.85rem;
  }

  .admin-auth-view .form-group label::before {
    font-size: 0.8rem;
  }

  .admin-auth-view .checkbox-container {
    font-size: 0.85rem;
  }

  .admin-auth-view .submit-btn {
    padding: 0.9rem 1.2rem;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  .admin-auth-view .submit-btn::after {
    font-size: 1rem;
  }
}

/* Efecto de brillo de seguridad en toda la vista */
.admin-auth-view {
  animation: admin-security-glow 5s ease-in-out infinite;
}

@keyframes admin-security-glow {
  0%, 100% { 
    filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.1));
  }
  50% { 
    filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.2));
  }
}
/* Botón para volver al login de usuarios */
.back-to-login-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(220, 38, 38, 0.4);
  border-radius: 50px;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(220, 38, 38, 0.1);
  color: #DC2626;
  z-index: 10;
}

.back-to-login-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  transition: all 0.3s ease;
}

.back-to-login-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #DC2626;
  transform: translateY(-2px);
  box-shadow: 
    0 12px 35px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(220, 38, 38, 0.2);
}

.back-to-login-btn:hover svg {
  transform: translateX(-3px) scale(1.1);
  filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6));
}

.back-to-login-btn:active {
  transform: translateY(-1px);
}

/* Card de admin sin tabs */
.admin-card {
  position: relative;
  padding-top: 1rem;
}

.admin-card .auth-view {
  padding-top: 3.5rem;
}

/* Responsive para el botón de volver */
@media (max-width: 768px) {
  .back-to-login-btn {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
  }

  .back-to-login-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .back-to-login-btn {
    top: 0.7rem;
    left: 0.7rem;
    padding: 0.5rem 0.8rem;
    border-radius: 25px;
  }

  .back-to-login-btn span {
    display: none;
  }

  .back-to-login-btn svg {
    width: 16px;
    height: 16px;
  }

  .admin-card .auth-view {
    padding-top: 3rem;
  }
}
.authentication {
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #3d3d3d 75%, #1a1a1a 100%);
}
</style>
