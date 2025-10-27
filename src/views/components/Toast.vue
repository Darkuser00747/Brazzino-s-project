<template>
  <transition name="toast-slide">
    <div v-if="isVisible" class="toast" :class="`toast-${type}`">
      <span class="toast-icon">{{ getIcon() }}</span>
      <p class="toast-message">{{ message }}</p>
      <button @click="closeToast" class="toast-close">&times;</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'info', validator: (value) => ['success', 'error', 'warning', 'info'].includes(value) },
  duration: { type: Number, default: 3000 }
})

const isVisible = ref(true)
const timer = ref(null)

const emit = defineEmits(['close'])

const getIcon = () => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[props.type] || 'ℹ️'
}

const closeToast = () => {
  isVisible.value = false
  emit('close')
}

onMounted(() => {
  timer.value = setTimeout(() => {
    closeToast()
  }, props.duration)
})

onUnmounted(() => {
  if (timer.value) clearTimeout(timer.value)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid;
  padding: 15px 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  max-width: 400px;
  color: #e0e0e0;
}

.toast-success {
  border-color: rgba(76, 175, 80, 0.5);
  background: rgba(76, 175, 80, 0.1);
}

.toast-error {
  border-color: rgba(244, 67, 54, 0.5);
  background: rgba(244, 67, 54, 0.1);
}

.toast-warning {
  border-color: rgba(255, 152, 0, 0.5);
  background: rgba(255, 152, 0, 0.1);
}

.toast-info {
  border-color: rgba(33, 150, 243, 0.5);
  background: rgba(33, 150, 243, 0.1);
}

.toast-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.toast-message {
  margin: 0;
  font-size: 1rem;
  flex-grow: 1;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 215, 0, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 10px;
}

.toast-close:hover {
  color: #FFD700;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>