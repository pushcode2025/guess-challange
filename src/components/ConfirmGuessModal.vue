<template>
  <transition name="modal-fade">
    <div v-if="open" class="confirm-guess-overlay" @click.self="$emit('cancel')">
      <div class="confirm-modal">

        <div class="confirm-icon">
          <span class="icon-content">🤔</span>
        </div>

        <h3 class="confirm-title">
          {{ $t('confirm_guess_title') }}
        </h3>

        <p class="confirm-text">
          {{ $t('confirm_guess_message') }}
        </p>

        <div class="confirm-entity">
          {{ guess }}
        </div>

        <div class="confirm-actions">
          <button class="btn-cancel" @click="$emit('cancel')">
            {{ $t('confirm_guess_no') }}
          </button>

          <button class="btn-confirm" @click="$emit('confirm')">
            {{ $t('confirm_guess_yes') }}
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  guess: string
}>()

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
/* Modal Fade Animation */
.modal-fade-enter-active {
  animation: fadeIn 0.3s ease-out;
}

.modal-fade-leave-active {
  animation: fadeOut 0.25s ease-in;
}

.modal-fade-enter-active .confirm-modal {
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .confirm-modal {
  animation: slideDown 0.25s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
}

/* Icon Animation */
@keyframes bounce {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.15) rotate(-8deg);
  }
  50% {
    transform: scale(1.1) rotate(8deg);
  }
  75% {
    transform: scale(1.15) rotate(-5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.confirm-guess-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
}

.confirm-modal {
  width: 90%;
  max-width: 420px;
  background: linear-gradient(
    145deg,
    rgba(30, 30, 45, 0.98),
    rgba(18, 18, 30, 0.98)
  );
  border-radius: 26px;
  padding: 2.25rem 2rem;
  text-align: center;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.confirm-icon {

  margin-bottom: 1.2rem;
  display: inline-block;
  line-height: 1;
}

.icon-content {
      font-size: 4.5rem;
  display: inline-block;
  animation: bounce 0.8s ease-in-out 0.3s, floatUpDown 2.5s ease-in-out 1.2s infinite;
}

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 768px) {
  .icon-content {
    font-size: 4rem;
  }
}

@media (max-width: 480px) {
  .confirm-icon {
   
    margin-bottom: 1rem;
  }
  
  .icon-content {
     font-size: 3.5rem;
    animation: bounce 0.8s ease-in-out 0.3s, floatUpDown 2.5s ease-in-out 1.2s infinite;
  }
  
  @keyframes floatUpDown {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-12px);
    }
  }
}

.confirm-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
}

.confirm-text {
  margin-top: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.confirm-entity {
  margin: 1.5rem 0;
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--accent-color);
  word-break: break-word;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: none;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cancel {
  background: #374151;
  color: #ffffff;
}

.btn-cancel:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.btn-cancel:active {
  transform: translateY(0);
}

.btn-confirm {
  background: #10b981;
  color: #ffffff;
}

.btn-confirm:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .confirm-modal {
    padding: 2rem 1.5rem;
  }

  .confirm-title {
    font-size: 1.35rem;
  }

  .confirm-entity {
    font-size: 1.2rem;
  }

  .btn-cancel,
  .btn-confirm {
    font-size: 0.95rem;
    padding: 0.85rem;
  }
}
</style>