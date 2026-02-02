
<template>
<div class="game-screen">
   <div
  v-if="showLimitReached"
  class="limit-reached"
>
  <div class="limit-card">

    <div class="limit-icon">
      ⚠️
    </div>

    <div class="limit-text">
      <h2>{{ $t('limitReachedTitle') }}</h2>
      <p>{{ $t('limitReachedDescription') }}</p>
    </div>

    <button
      class="limit-action"
      @click="toggleGuessInput"
    >
      {{ $t('limitReachedCta') }}
    </button>

  </div>
</div>

    <!-- Header -->
    <div class="game-header">
  

     <transition v-if="!isMobile" name="level-badge-appear">
  <div v-if="state.selectedLevel" class="level-badge-container">
    <div 
      class="level-badge" 
      :class="`level-${state.selectedLevel?.name?.en?.toLowerCase() || 'easy'}`"
    >
      <div class="level-badge-glow"></div>
      <div class="level-badge-particles">
        <div class="particle" v-for="i in 6" :key="i" :style="{ '--i': i }"></div>
      </div>
      
      <div class="level-badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>

      <div class="level-badge-content">
        <span class="level-badge-label">المستوى</span>
        <span class="level-badge-name">{{ state.selectedLevel?.name?.ar }}</span>
      </div>

      <div class="level-badge-shine"></div>
    </div>
  </div>
</transition>

      <div v-if="isMobile" class="game-mobile-header-container">
   

          <transition  name="level-badge-appear">
        <div v-if="state.selectedLevel" class="level-badge-container">
          <div class="level-badge">
            <div class="level-badge-glow"></div>
            <div class="level-badge-particles">
              <div class="particle" v-for="i in 6" :key="i" :style="{ '--i': i }"></div>
            </div>
            
            <div class="level-badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>

            <div class="level-badge-content">
              <span class="level-badge-label">المستوى</span>
              <span class="level-badge-name">{{ state.selectedLevel?.name?.ar }}</span>
            </div>

            <div class="level-badge-shine"></div>
          </div>
        </div>
      </transition>
            <transition  name="back-button-slide">
        <button
          v-if="!showCategories && !isLoadingQuestions && (currentStep === 'subCategories' || currentStep === 'question')"
          @click="goBackToCategories"
          class="back-to-categories-button"
          :aria-label="$t('backToCategories') || 'العودة للتصنيفات'"
        >
          <span class="back-button-glow"></span>
          <span class="back-button-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </span>
          <span class="back-button-text">{{ $t('backToCategories') || 'العودة للتصنيفات' }}</span>
          <span class="back-button-ripple"></span>
        </button>
      </transition>
      </div>

      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">{{$t('categories')}}</span>
  <span class="stat-value" style="display: flex; align-items: center;">
  <template v-if="categoriesRemaining === null">
    <svg 
      style="width: 30px; height: 30px; stroke-width: 1.5; opacity: 0.9;" 
      class="infinity-icon"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18.5 6.5c-2.7 0-5.6 2.1-6.5 5-0.9-2.9-3.8-5-6.5-5s-4.5 2.2-4.5 5 2 5 4.5 5c2.7 0 5.6-2.1 6.5-5 0.9 2.9 3.8 5 6.5 5s4.5-2.2 4.5-5-2-5-4.5-5z"/>
    </svg>
  </template>

  <template v-else>
    {{ categoriesRemaining }}
  </template>
</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ $t('time') }}</span>
          <span class="stat-value timer" :class="{ warning: isTimeLow  }">
            {{ formatTime(state.timeRemaining) }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ $t('theme') }}</span>
          <span class="stat-value">{{ state.selectedTheme?.name?.ar }}</span>
        </div>
      </div>
     <button 
  @click="handleGiveUp" 
  v-if="!isMobile" 
  class="give-up-button"
  :class="{ 'shifted-right': isSidebarOpen && isWideLayout }"
>
  {{$t('giveUp')}}
</button>

<transition v-if="!isMobile" name="back-button-slide">
  <button
    v-if="!showCategories && !isLoadingQuestions && (currentStep === 'subCategories' || currentStep === 'question')"
    @click="goBackToCategories"
    class="back-to-categories-button"
    :class="{ 'shifted-right': isSidebarOpen && isWideLayout }"
    :aria-label="$t('back')"
  >
    <span class="back-button-glow"></span>
    <span class="back-button-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </span>
    <span class="back-button-text">{{ $t('back') }}</span>
    <span class="back-button-ripple"></span>
  </button>
</transition>
      <button @click="handleGiveUp" class="give-up-button-mobile" v-if="isMobile">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
  <span>{{$t('giveUp')}}</span>
</button>
    </div>

    <div class="game-content">
      <!-- Chat History Sidebar -->
<aside
  v-if="(state.conversation.length > 0)"
  class="chat-sidebar"
  :class="{ 'sidebar-open': isSidebarOpen }"
>
        <button

  class="sidebar-toggle"
  @click="isSidebarOpen = !isSidebarOpen"
>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>

             <!-- 🎯 Hint Badge - يظهر فقط لما يكون الـ sidebar مسكر -->
          <span v-if="!isSidebarOpen" class="sidebar-toggle-hint">
            المحادثات السابقة 💬
          </span>
          
          <!-- 🌊 Wave Animations -->
          <span v-if="!isSidebarOpen" class="sidebar-toggle-wave"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-wave"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-wave"></span>
          
          <!-- ✨ Sparkle Particles -->
          <span v-if="!isSidebarOpen" class="sidebar-toggle-sparkle"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-sparkle"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-sparkle"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-sparkle"></span>
          <span v-if="!isSidebarOpen" class="sidebar-toggle-sparkle"></span>
        </button>
        <div class="sidebar-content">
          <h3 class="sidebar-title">{{ $t('previousConversation') }}</h3>
          <div class="sidebar-history" ref="conversationRef">
            <div
              v-for="(conv, index) in state.conversation"
              :key="index"
              class="sidebar-item"
            >
              <div class="sidebar-question">
                <span class="sidebar-icon">❓</span>
              <span class="sidebar-text">{{ conv.option.text?.ar }}</span>
              </div>
              <div class="sidebar-answer" :class="{ yes: conv.answer, no: !conv.answer }">
                <span class="sidebar-icon">{{ conv.answer ? '✓' : '✗' }}</span>
                <span class="sidebar-text">{{ conv.answer ? $t('yes') : $t('no') }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="main-game-area" :class="{ 'has-sidebar': state.conversation.length > 0 && !isLoadingQuestions }">

<div v-if="!showCategories && !isLoadingQuestions && currentStep === 'question' && state.questions.length >0" class="question-area">

  <div class="question-title-wrapper">
    <div class="question-icon-ring">
      <div class="question-icon">❓</div>
    </div>
    <h2 class="questions-title">{{ state.questions[0].text?.ar }}</h2>
  </div>

<transition-group name="stagger-slide" tag="div" class="options-grid-modern">
  <div
    v-for="(opt, index) in state.questions[0].options"
    :key="opt.id"
    class="option-card"
    :style="{ '--index': index }"
    @click="handleOption(opt)"
    :class="{ disabled: !canAskQuestion || isAsking }"
  >
    <div class="option-card-inner">
      <!-- Image Section - Top -->
      <div v-if="opt.image" class="option-image-container">
        <div class="option-image-wrapper">
          <div class="option-image-glow"></div>
          <ResponsiveImage
            :src="opt.image"
            fit="contain"
            :quality="90"
            class="option-image"
          />
        </div>
      </div>

      <!-- Text Section - Bottom -->
      <div class="option-content">
        <p class="option-text">{{ opt.text?.ar }}</p>
        <div class="option-accent-line"></div>
      </div>

      <!-- Interactive Elements -->
      <div class="option-shine"></div>
      <div class="option-border-glow"></div>
    </div>
  </div>
</transition-group>


</div>
      
      <!-- 🔹 عرض الكاتيجوري أولاً -->
      <div v-if="showCategories && currentStep === 'categories'" class="categories-grid" :class="{ 'has-sidebar': hasSidebar }">
        <h3 class="section-title">في أي تصنيف تريد أن تسأل؟ 🎮</h3>

        <transition-group name="category-stagger" tag="div" class="categories-wrapper">
          <div
            v-for="(category, index) in state.categories"
            :key="category.id"
            class="category-card"
            :class="{ used: category.used }"
            :style="{ '--card-index': index }"
            @click="!category.used && selectCategory(category)"
          >
            <!-- Card Image Background with Parallax Effect -->
            <div class="category-image-container">
             <div class="category-image">
  <ResponsiveImage
    v-if="category.image"
    :src="category.image"
    fit="contain"
    :quality="80"
  />

  <img
    v-else
    :src="getCategoryPlaceholderImage(index)"
    class="category-placeholder"
  />

  <div class="category-image-overlay"></div>
</div>
            </div>

            <!-- Glassmorphic Content Container -->
            <div class="category-content-wrapper">
              <div class="category-content">
                <!-- <div class="category-icon-ring">
                  <div class="category-icon-inner">
                    {{ getCategoryIcon(index) }}
                  </div>
                  <div class="category-icon-glow"></div>
                </div> -->
                <h4 class="category-title">{{ category.name?.ar || category.name }}</h4>
                <p class="category-description">{{ category.description?.ar || category.description || 'اختر هذا التصنيف لبدء الأسئلة' }}</p>
                <div class="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Shine Effect -->
            <div class="category-shine"></div>

            <!-- Used Badge with Animation -->
            <transition name="badge-appear">
              <div v-if="category.used" class="category-used-badge">
                <div class="used-badge-inner">
                  <div class="used-checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span class="used-label">تم الاختيار</span>
                </div>
              </div>
            </transition>
          </div>
        </transition-group>
      </div>

       <div v-if="currentStep === 'subCategories'" class="categories-grid" :class="{ 'has-sidebar': hasSidebar }">
  <h3 class="section-title">اختر تصنيف فرعي 🔍</h3>

        <transition-group name="category-stagger" tag="div" class="categories-wrapper">
          <div
           v-for="(sub,index) in state.selectedCategory?.sub_categories"
            :key="sub.id"
            class="category-card"
            :class="{ used: sub.used }"
            :style="{ '--card-index': index }"
            @click="!sub.used && selectSubCategory(sub)"
          >
            <!-- Card Image Background with Parallax Effect -->
            <div class="category-image-container">
             <div class="category-image">
  <ResponsiveImage
    v-if="sub.image"
    :src="sub.image"
    fit="contain"
    :quality="80"
  />

  <img
    v-else
    :src="getCategoryPlaceholderImage(index)"
    class="category-placeholder"
  />

  <div class="category-image-overlay"></div>
</div>

            </div>

            <!-- Glassmorphic Content Container -->
            <div class="category-content-wrapper">
              <div class="category-content">
              
                <h4 class="category-title">{{ sub.name?.ar || sub.name }}</h4>
                <p class="category-description">{{ sub.description?.ar || sub.description || 'اختر هذا التصنيف لبدء الأسئلة' }}</p>
                <div class="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Shine Effect -->
            <div class="category-shine"></div>

            <!-- Used Badge with Animation -->
            <transition name="badge-appear">
              <div v-if="sub.used" class="category-used-badge">
                <div class="used-badge-inner">
                  <div class="used-checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span class="used-label">تم الاختيار</span>
                </div>
              </div>
            </transition>
          </div>
        </transition-group>
      </div>
</div>
      <!-- 🔹 AI Thinking Loader Overlay -->
      <transition name="fade-overlay">
        <div v-if="isLoadingQuestions" class="question-loader-overlay">
          <div class="loader-backdrop"></div>
          <div class="loader-card">
            <div class="orb-wrapper-large">
              <div class="orb-large"></div>
              <div class="orb-ring-large"></div>
              <div class="orb-pulse-large"></div>
              <div class="particle" v-for="i in 8" :key="i" :style="{ '--i': i }"></div>
            </div>
            <h3 class="loader-title">{{ $t('thinkingQuestion') }}</h3>
            <p class="loader-subtitle">جاري تحضير السؤال لك...</p>
            <div class="loader-progress">
              <div class="loader-progress-bar"></div>
            </div>
          </div>
        </div>
      </transition>

<transition name="fade">
 <div 
v-if="isSidebarOpen && !isWideLayout && !isLoadingQuestions && !isAsking"
  class="sidebar-backdrop"
  @click="isSidebarOpen = false"
/>
</transition>
         <!-- 🔹 AI Thinking Loader Overlay -->
      <transition name="fade-overlay">
        <div v-if="isAsking" class="question-loader-overlay">
          <div class="loader-backdrop"></div>
          <div class="loader-card">
            <div class="orb-wrapper-large">
              <div class="orb-large"></div>
              <div class="orb-ring-large"></div>
              <div class="orb-pulse-large"></div>
              <div class="particle" v-for="i in 8" :key="i" :style="{ '--i': i }"></div>
            </div>
            <h3 class="loader-title">{{ $t('thinkingAnswer') }}</h3>
            <p class="loader-subtitle">{{ $t('thinkingAnswerDescription') }}</p>
            <div class="loader-progress">
              <div class="loader-progress-bar"></div>
            </div>
          </div>
        </div>
      </transition>





    </div>

<!-- 
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(state.questionsAsked / state.maxQuestions) * 100}%` }"></div>
    </div>
-->
 <!-- <transition name="overlay-slide"> -->

  <transition name="fade">
  <div
    v-if="showSelectEntityWarning"
    class="guess-warning"
  >
    ⚠️ {{ $t('pleaseSelectFromSuggestions') }}
  </div>
</transition>
  <transition>
    <div 
      v-show="showAnswerOverlay && currentAnswer" 
      class="answer-overlay" 
      :class="{ correct: currentAnswer?.isCorrect, incorrect: !currentAnswer?.isCorrect }"
    >
      <div class="answer-content">
        <div class="answer-icon-wrapper">
          <div class="answer-icon">{{ currentAnswer?.isCorrect ? '✓' : '✗' }}</div>
          <div class="answer-ripple"></div>
        </div>
        <h2 class="answer-title">{{ currentAnswer?.isCorrect ? $t('correctAnswer') : $t('incorrectAnswer') }}</h2>
        <p class="answer-text">{{ currentAnswer?.isCorrect ? $t('answerYes') : $t('answerNo') }}</p>
      </div>
    </div>
  </transition>
    <!-- 🔹 Letter Guess Component at Bottom -->
    <transition name="guess-slide-up">
  <LetterGuess
  v-if="showGuessInput"
  ref="letterGuessRef"
  placeholder="اختر الحروف لبناء تخمينك..."
  :disabled="isAsking"
  :is-submitting="isAsking"
  @submit="onGuessSubmit"
  @toggleGuess="toggleGuessInput"
/>
</transition>
<ConfirmGuessModal
  :open="showConfirmGuess"
  :guess="pendingEntity?.name || ''"
  @confirm="confirmGuess"
  @cancel="cancelGuess"
/>

    <!-- 🔹 Verifying Guess Loader Overlay -->
    <transition name="fade-scale">
      <div v-if="isVerifyingGuess" class="verification-overlay">
        <div class="verification-loader">
          <div class="orb-wrapper-verification">
            <div class="orb-verification"></div>
            <div class="orb-ring-verification"></div>
            <div class="orb-pulse-verification"></div>
            <div class="particle-verification" v-for="i in 10" :key="i" :style="{ '--i': i }"></div>
          </div>
          <h2 class="verification-title">{{ $t('verifyingGuessTitle') }}</h2>
          <p class="verification-subtitle">{{ $t('verifyingGuessSubtitle') }}</p>
          <div class="verification-progress">
            <div class="verification-progress-bar"></div>
          </div>
        </div>
      </div>
    </transition>

 




    <transition name="fab-fade">
<button
  v-if="!isVerifyingGuess && !verificationResult"
  class="floating-guess-button"
  :style="{
    bottom: fabOffset ? `${fabOffset}px` : '2rem'
  }"
  @click="toggleGuessInput"
>
    <span v-if="!showGuessInput">✍️ {{ $t('startGuess') }}</span>
    <span v-else>💭 {{ $t('thinkAgain') }}</span>
  </button>
</transition>
    
      <transition name="fade-overlay">
        <div v-if="isStartingGame" class="full-page-loader">
          <div class="loader-backdrop-animated"></div>
          <div class="loader-content">
            <div class="orb-wrapper-xl">
              <div class="orb-xl"></div>
              <div class="orb-ring-xl"></div>
              <div class="orb-pulse-xl"></div>
              <div class="particle-xl" v-for="i in 12" :key="i" :style="{ '--i': i }"></div>
            </div>
            <h2 class="loader-title-xl">{{ $t('loadingStartGame') }}</h2>
            <div class="loader-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </transition>

   <div v-if="showGiveUpConfirm" class="confirm-overlay">
  <div class="confirm-box">
    
    <h3 class="confirm-title">هل أنت متأكد من الاستسلام؟</h3>
    <p class="confirm-text">سيتم الكشف عن الجواب الصحيح وإنهاء اللعبة.</p>

    <div v-if="!loadingGiveUp" class="confirm-actions">
      <button class="btn cancel" @click="showGiveUpConfirm = false">
        إلغاء
      </button>

      <button class="btn confirm" @click="confirmGiveUp">
        نعم، استسلم
      </button>
    </div>

    <!-- Loader يظهر بعد الضغط على الزر -->
    <div v-else class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">جارٍ إحضار الجواب الصحيح...</p>
    </div>

  </div>
</div>


  </div>
  
</template>



<script setup lang="ts">
import { useRouter,useRoute  } from 'vue-router';
import { ref, nextTick, watch, onMounted,computed,onBeforeUnmount,onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../stores/game';
import { useThemeStore } from '../stores/theme';
import { onUpdated } from 'vue';
import type { Theme } from '../models/Theme';
import type { Level } from '../models/Level';
import type { Category } from '../models/Category';
import ResultScreen from './ResultScreen.vue';
import LetterGuess from './LetterGuess.vue';
import ResponsiveImage from './ResponsiveImage.vue';
import ConfirmGuessModal from './ConfirmGuessModal.vue';
const showGuessInput = ref(false);
const isStartingGame = ref(true);
const router = useRouter();
const route = useRoute();
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches;
};
const showGiveUpConfirm = ref(false);
const fabOffset = ref(0);
const loadingGiveUp = ref(false);
let resizeObserver = <any>(null);

function updateFabOffset() {
  const el = letterGuessRef.value?.$el;
  if (el) {
    fabOffset.value = el.offsetHeight + 20;
  }
}
const isLargeScreen = ref(window.innerWidth > 1200);
const windowWidth = ref(window.innerWidth);


watch(showGuessInput, async (value) => {
  if (value) {
    await nextTick();
    updateFabOffset();

    const el = letterGuessRef.value?.$el;
    if (el) {
      resizeObserver = new ResizeObserver(() => {
        updateFabOffset();
      });
      resizeObserver.observe(el);
    }
  } else {
    fabOffset.value = 0;

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }
});
const canSelectSubCategory = computed(() => {
  if (state.value.subCategoriesLimit === null) return true;

  return state.value.subCategoriesLimit > 0;
});
onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
 window.removeEventListener('resize', handleResize);
});

const hasSidebar = computed(() => {
  return state.value.conversation.length > 0 && 
         !isLoadingQuestions.value && 
         isLargeScreen.value;
});
const emit = defineEmits<{ endGame: [] }>();
const gameStore = useGameStore();
const themeStore = useThemeStore();
const { playSound } = themeStore;
const { state, categoriesRemaining, canAskQuestion ,timeElapsed } = storeToRefs(gameStore);
const gameReady = ref(false);
const isTimeLow = computed(() => {
  if (!gameReady.value) return false;
  return state.value.timeRemaining <= 30;
});
const showConversationAccordion = computed(() => showCategories.value);
const showCategories = ref(true);
const isConversationAccordion = computed(() => showCategories.value);
const isConversationOpen = ref(false);
const isSidebarOpen = ref(false);

const showAnswerOverlay = ref(false);
const currentAnswer = ref<{ isCorrect: boolean; text: string } | null>(null);
const isAsking = ref(false);
const conversationRef = ref<HTMLElement | null>(null);
const isLoadingQuestions = ref(false);
const letterGuessRef = ref<InstanceType<typeof LetterGuess> | null>(null);
const isVerifyingGuess = ref(false);
const verificationResult = ref<{ match: boolean; message: string } | null>(null);
const isLoadingCategories = ref(true);


const storageUrl = import.meta.env.VITE_STORAGE_URL;



const getCategoryPlaceholderImage = (index: number) => {
  const images = [
    'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1557251/pexels-photo-1557251.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ];
  return images[index % images.length];
};
const showLimitReached = ref(false);
const getCategoryIcon = (index: number) => {
  const icons = ['🎯', '🎮', '🏆', '⚡', '🌟', '🎨', '🚀', '💎', '🎪', '🎭'];
  return icons[index % icons.length];
};
type Step = 'categories' | 'subCategories' | 'question';

const currentStep = ref<Step>('categories');
watch(showCategories, (val) => {

  isConversationOpen.value = !val;
});
function toggleGuessInput() {
  showGuessInput.value = !showGuessInput.value;
  playSound('click');
}
async function initializeGame() {
  const themeId = route.query.theme_id;
  const levelId = route.query.level_id;
  const userId  = route.query.user_id;

  if (!themeId || !levelId || !userId) {
    console.error("Missing URL parameters");
    return;
  }

  const theme = await gameStore.fetchThemeById(themeId);
  const level = await gameStore.fetchLevelById(levelId);
  const user  = await gameStore.fetchUserById(userId);



  await gameStore.startGame(theme, level);

  await new Promise(r => setTimeout(r, 2000));
  isStartingGame.value = false;
}
const isWideLayout = ref(
  window.matchMedia('(min-width: 1400px)').matches
);


console.log('isWideLayout',isWideLayout.value)


onMounted(async () => {
 await initializeGame();


 
  
window.addEventListener('resize', handleResize);
 checkMobile();
  window.addEventListener('resize', checkMobile);
 gameReady.value = true;
});
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
console.log('isSideBarOpen',isSidebarOpen.value)
function handleResize() {
  isWideLayout.value = window.matchMedia('(min-width: 1400px)').matches;

  if (!isWideLayout.value) {
    isSidebarOpen.value = false;
  }
}
async function selectSubCategory(subCategory: SubCategory) {

  // 🚫 إذا ما في فرص
  if (!canSelectSubCategory.value || subCategory.used) {
    playSound('warning');
    showGuessInput.value = true;
    return;
  }

  playSound('click');

 


  state.value.selectedSubCategory = subCategory;

  isLoadingQuestions.value = true;
  const questions = await gameStore.fetchQuestionsBySubCategory(subCategory.id);
  isLoadingQuestions.value = false;

  if (questions.length) {
    currentStep.value = 'question';
    state.value.status = 'playing';
    
   
  }
}

async function selectCategory(category: Category) {
  playSound('click');
  showCategories.value = false;
 

  

  state.value.selectedCategory = category;
  currentStep.value = 'subCategories';
 
}

function goBackToCategories() {
  playSound('click');

  if (currentStep.value === 'question') {
    currentStep.value = 'subCategories';

    // gameStore.state.questions = [];
    // gameStore.state.selectedSubCategory = null;
    // gameStore.stopTimer?.();

    return;
  }

  if (currentStep.value === 'subCategories') {
    currentStep.value = 'categories';
    showCategories.value = true;

    gameStore.state.subCategories = [];
    gameStore.state.selectedCategory = null;
    // gameStore.stopTimer?.();

    return;
  }

  // currentStep.value = 'categories';
  // showCategories.value = true;
  
}
watch(
  () => state.value.timeUp,
  async (timeUp) => {
    if (!timeUp) return;

    isAsking.value = false;
    isLoadingQuestions.value = false;
    showGuessInput.value = false;

    await new Promise(r => setTimeout(r, 800));

    router.push({
      name: 'result',
      query: {
        lost: 1,
        reason: 'time_up',
      },
    });
  }
);
watch(
  () => state.value.conversation.length,
  async () => {
    await nextTick();

    const el = conversationRef.value;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }
)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}



async function handleOption(option: any) {
  if (!canAskQuestion.value || isAsking.value) return;

  isAsking.value = true;
  playSound('click');

  const answer = await gameStore.askQuestion(option);


  
  // ⬇️ هنا الاستهلاك الحقيقي


  if (answer !== null) {
   
    currentAnswer.value = {
      isCorrect: answer,
      text: answer ? 'yes' : 'no',
    };

 isAsking.value = false;
    
    showAnswerOverlay.value = true;
    
 
    
    await nextTick();
    
  

    await new Promise(resolve => requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    }));

    playSound(answer ? 'correct' : 'wrong');

    await new Promise(resolve => setTimeout(resolve, 2500));

    showAnswerOverlay.value = false;

    await new Promise(resolve => setTimeout(resolve, 300));

  

    await new Promise(resolve => setTimeout(resolve, 600));

    currentStep.value = 'categories';
    showCategories.value = true;
    state.value.status = 'playing';

      if (gameStore.state.subCategoriesLimit !== null) {
    gameStore.state.subCategoriesLimit--;
  }

    if (isWideLayout.value &&gameStore.state.conversation.length > 0) {
    isSidebarOpen.value = true;
 }


  
  }

  
}

watch(
  () => gameStore.isCategoriesLimitReached,
  (reached) => {
    if (!reached) return;

    gameStore.state.status = 'awaiting_guess';

    showLimitReached.value = true;

    playSound('warning');
  }
);

const showSelectEntityWarning = ref(false);


async function handleGuess() {
  const selected = gameStore.state.selectedGuessEntity;
  console.log('selected',selected);
  console.log('isAsking',isAsking.value);
  if (!selected) {
    showSelectEntityWarning.value = true;

    setTimeout(() => {
      showSelectEntityWarning.value = false;
    }, 2000);

    return;
  }



  if (isAsking.value) return;

  showGuessInput.value = false;
  isVerifyingGuess.value = true;

  const result = await gameStore.verifyGuess(selected.id);

  isVerifyingGuess.value = false;

  if (!result) return;

  router.push({ name: 'result' });
}



function handleViewLeaderboard(){
  
}
function handleBackToMenu(){

}
function handlePlayAgain() {
  verificationResult.value = null;
  letterGuessRef.value?.clear();

  gameStore.resetGame?.();

  router.push({ name: 'home' });
}


function handleGiveUp() {
  playSound('click');
  showGiveUpConfirm.value = true;
}

async function confirmGiveUp() {
  loadingGiveUp.value = true;

  const entity = await gameStore.giveUp();    

  loadingGiveUp.value = false;
  showGiveUpConfirm.value = false;



  router.push({
    name: "result",
    query: {
      lost: 1,
      entity: entity?.name ?? ''
    }
  });
}
const showConfirmGuess = ref(false)
const pendingEntity = ref<any | null>(null)

function onGuessSubmit(entity: any) {
  pendingEntity.value = entity
  showConfirmGuess.value = true
}

async function confirmGuess() {
  showConfirmGuess.value = false
  await handleGuess()
}

function cancelGuess() {
  showConfirmGuess.value = false
  pendingEntity.value = null
}

</script>

<style>

.back-to-categories-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg,
    rgba(var(--accent-rgb), 0.95),
    rgba(var(--primary-rgb), 0.95));
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(var(--accent-rgb), 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  z-index: 10;
}

.back-to-categories-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.back-to-categories-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.2),
    0 6px 16px rgba(var(--accent-rgb), 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}

.back-to-categories-button:hover::before {
  opacity: 1;
}

.back-to-categories-button:active {
  transform: translateY(0) scale(0.98);
}

.back-button-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 16px;
  opacity: 0;
  filter: blur(12px);
  transition: opacity 0.4s ease;
  z-index: -1;
}

.back-to-categories-button:hover .back-button-glow {
  opacity: 0.7;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.back-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

.back-to-categories-button:hover .back-button-icon {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-4px) rotate(-5deg);
}

.back-button-icon svg {
  transition: transform 0.3s ease;
}

.back-to-categories-button:hover .back-button-icon svg {
  transform: translateX(-2px);
  animation: arrowBounce 0.6s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(-6px);
  }
}

.back-button-text {
  position: relative;
  z-index: 2;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button-ripple {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.back-to-categories-button:active .back-button-ripple {
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}

.back-button-slide-enter-active,
.back-button-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back-button-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.8);
}

.back-button-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.8);
}

@media (max-width: 768px) {
  .back-to-categories-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    gap: 0.5rem;
    max-width: 50px;
    align-self: center;
  }

  .game-mobile-header-container{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-content: center;
    margin-bottom: 8px;
  }

  .back-button-text {
    display: none;
  }

  .back-button-icon {
    width: 32px;
    height: 32px;
  }
}

.full-page-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loader-backdrop-animated {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  animation: backdropPulse 3s ease-in-out infinite;
}

@keyframes backdropPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}

.loader-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  animation: loaderContentAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes loaderContentAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.orb-wrapper-xl {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-xl {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 50%;
  position: relative;
  z-index: 3;
  box-shadow:
    0 0 60px var(--primary-glow),
    0 0 120px var(--primary-glow),
    inset 0 0 40px rgba(255, 255, 255, 0.3);
  animation: orbFloatXL 3s ease-in-out infinite;
}

@keyframes orbFloatXL {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow:
      0 0 60px var(--primary-glow),
      0 0 120px var(--primary-glow),
      inset 0 0 40px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    box-shadow:
      0 0 80px var(--primary-glow),
      0 0 140px var(--primary-glow),
      inset 0 0 50px rgba(255, 255, 255, 0.4);
  }
}

.orb-ring-xl {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 5px solid var(--accent-color);
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
  z-index: 2;
  animation: orbRingRotate 2s linear infinite;
}

.orb-pulse-xl {
  position: absolute;
  width: 170px;
  height: 170px;
  border: 4px solid var(--accent-color);
  border-radius: 50%;
  z-index: 1;
  animation: orbPulse 2s ease-out infinite;
  opacity: 0;
}

.particle-xl {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-color);
  animation: particleOrbitXL 4s linear infinite;
  animation-delay: calc(var(--i) * -0.333s);
  transform-origin: 100px;
}

@keyframes particleOrbitXL {
  from {
    transform: rotate(0deg) translateX(100px) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(100px) rotate(-360deg);
    opacity: 0.3;
  }
}

.loader-title-xl {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  text-align: center;
  max-width: 700px;
  line-height: 1.4;
  animation: titlePulseXL 2s ease-in-out infinite;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

@keyframes titlePulseXL {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.loader-dots {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
}

.loader-dots span {
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.loader-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loader-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loader-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-15px);
    opacity: 1;
  }
}
/* 🔹 عام */
.game-screen {
  min-height: 100vh;
  /* height: 100vh; */
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  padding-bottom: 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  position: relative;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .game-screen {
    padding: 1.5rem;
    padding-bottom: 7rem;
  }
}

@media (max-width: 480px) {
  .game-screen {
    padding: 1rem;
    padding-bottom: 6rem;
  }
}
/* Header */
.game-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;

  flex-wrap: wrap;
  gap: 3rem;
  position: relative;
  z-index: 50;
}

@media (max-width: 768px) {
  .game-header {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .game-header {
    margin-bottom: 1rem;
    gap: 0.5rem;
  }
}

.header-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-weight: 700;
  color: var(--text-primary);
}

.timer.warning {
  color: #ff4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.give-up-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  border: 2px solid #ff4444;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  margin-right: auto;
}

.give-up-button:hover {
  background: #ff4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

/* Game Content */
.game-content {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

.game-main-content {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}


/* Questions Container */
.questions-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.questions-section {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.questions-title {
  font-weight: 700;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 1.5rem;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.question-button {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  line-height: 1.5;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInUp calc(0.1s * var(--index)) ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-button:hover:not(:disabled) {
  border-color: var(--accent-color);
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--primary-glow);
}

.question-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Letter Guess Component Styles - Handled by Component */

/* Category grid */
.categories-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  transition: margin-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.3s ease;
}

.categories-grid.has-sidebar {
  margin-left: 175px;
  padding: 1rem 1.5rem;
}


@media (min-width: 1400px) {
  .categories-grid.has-sidebar {
    margin-left: 175px;
    padding: 1.5rem 2rem;
  }
}

.section-title {
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
}

.categories-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 100%;
  margin-top: 1rem;
  box-sizing: border-box;
}

@media (min-width: 1200px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    max-width: 1000px;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 767px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }
}

/* Modern Category Card Styles with Glassmorphism */
.category-card {
  position: relative;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 280px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: categoryFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--card-index) * 0.08s);
  transform-style: preserve-3d;
  perspective: 1000px;
}

@keyframes categoryFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.category-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 2px;
  background: linear-gradient(135deg,
    rgba(0, 212, 255, 0.5),
    rgba(248, 201, 0, 0.5),
    rgba(0, 168, 232, 0.5)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.6;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.category-card:hover {
  transform: translateY(-16px) scale(1.05);
  box-shadow:
    0 20px 60px rgba(0, 212, 255, 0.3),
    0 0 80px rgba(248, 201, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.category-image-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 28px;
}

/* الصورة نفسها */
.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;        /* لا فراغ */
  transition: transform 0.7s ease;
}

/* hover خفيف */
.category-card:hover .category-image {
  transform: scale(1.05);
}


.category-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.22) 0%,
    rgba(0, 212, 255, 0.22) 50%,
    rgba(248, 201, 0, 0.22) 100%
  );
  transition: all 0.4s ease;
  backdrop-filter: blur(0px);
}

.category-card:hover .category-image-overlay {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.30) 0%,
    rgba(0, 212, 255, 0.30) 50%,
    rgba(248, 201, 0, 0.30) 100%
  );
  backdrop-filter: blur(1px);
}



.category-content-wrapper {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.8rem 1.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 40%,
    transparent 100%
  );
  transition: all 0.4s ease;
}

.category-card:hover .category-content-wrapper {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.8) 50%,
    transparent 100%
  );
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: right;
}

.category-icon-ring {
  position: relative;
  width: 70px;
  height: 70px;
  align-self: flex-start;
  margin-bottom: 0.5rem;
}

.category-icon-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    rgba(0, 212, 255, 0.15),
    rgba(248, 201, 0, 0.15)
  );
  backdrop-filter: blur(20px) saturate(180%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 8px 32px rgba(0, 212, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.category-card:hover .category-icon-inner {
  transform: scale(1.2) rotate(10deg);
  background: linear-gradient(135deg,
    rgba(0, 212, 255, 0.3),
    rgba(248, 201, 0, 0.3)
  );
  box-shadow:
    0 12px 48px rgba(248, 201, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.category-icon-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(0, 212, 255, 0.4),
    rgba(248, 201, 0, 0.4)
  );
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.category-card:hover .category-icon-glow {
  opacity: 1;
}

.category-title {
  font-weight: 900;
  font-size: 1.5rem;
  color: white;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 212, 255, 0.3);
  line-height: 1.3;
  margin: 0;
  transition: all 0.3s ease;
}

.category-card:hover .category-title {
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.7),
    0 0 30px rgba(248, 201, 0, 0.6);
  transform: translateX(-8px);
}

.category-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.category-card:hover .category-description {
  opacity: 1;
  color: rgba(255, 255, 255, 0.95);
  transform: translateX(-8px);
}

.category-arrow {
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.7);
  align-self: flex-start;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateX(-10px);
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
  color: rgba(248, 201, 0, 1);
}

.category-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 4;
  pointer-events: none;
}

.category-card:hover .category-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* Progress Bar */
.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 2rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
  border-radius: 10px;
  transition: width 0.5s ease;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.category-stagger-enter-active,
.category-stagger-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.category-stagger-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}

.category-stagger-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.9);
}

.category-stagger-move {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.question-list-move,
.question-list-enter-active {
  transition: all 0.4s ease;
}

.question-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.question-list-leave-active {
  position: absolute;
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .question-area {
    padding: 1rem;
  }

  .questions-title {
    font-size: 1.8rem;
  }

  .question-icon-ring {
    width: 80px;
    height: 80px;
  }

  .question-icon {
    font-size: 2.5rem;
  }

  .options-grid-modern {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }


.option-text {
  font-size: clamp(0.95rem, 2vw, 1.25rem);  /* Instead of fixed 1.1rem */
  line-height: 1.6;  /* was 1.5 */
  letter-spacing: 0.01em;  /* NEW */
}

  .orb-wrapper-xl {
    width: 150px;
    height: 150px;
  }

  .orb-xl {
    width: 75px;
    height: 75px;
  }

  .orb-ring-xl {
    width: 110px;
    height: 110px;
  }

  .orb-pulse-xl {
    width: 130px;
    height: 130px;
  }

  .loader-title-xl {
    font-size: 1.8rem;
  }

  .orb-wrapper-large {
    width: 120px;
    height: 120px;
  }

  .orb-large {
    width: 60px;
    height: 60px;
  }

  .loader-card {
    padding: 2rem 1.5rem;
  }

  .loader-title {
    font-size: 1.5rem;
  }


  .game-screen {
    padding: 1rem;
    padding-bottom: 8rem;
  }

  .header-stats {
    gap: 1rem;
  }



  .game-main-content,
  .conversation-container,
  .questions-container {
    max-width: 100%;
  }

  .conversation-history {
    max-height: 300px;
  }

  .question-bubble,
  .answer-bubble {
    max-width: 85%;
  }

  .questions-grid {
    grid-template-columns: 1fr;
  }

  .categories-wrapper {
    grid-template-columns: 1fr;
  }

  .categories-grid.has-sidebar {
    /* margin-left: 0; */
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .category-card {
    min-height: 240px;
  }

  .category-icon-ring {
    width: 60px;
    height: 60px;
  }

  .category-icon-inner {
    font-size: 2rem;
  }

  .category-title {
    font-size: 1.3rem;
  }

  .category-description {
    font-size: 0.9rem;
  }

  .used-checkmark {
    width: 70px;
    height: 70px;
  }

  .used-checkmark svg {
    width: 40px;
    height: 40px;
  }

  .used-label {
    font-size: 1.2rem;
  }
}

/* Modern Used Badge */
.category-used-badge {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.96) 0%,
    rgba(248, 201, 0, 0.96) 50%,
    rgba(0, 168, 232, 0.96) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 28px;
}

.used-badge-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: usedBadgeScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes usedBadgeScale {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.used-checkmark {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 255, 255, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.5);
  animation: checkmarkBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 4px solid rgba(248, 201, 0, 1);
}

@keyframes checkmarkBounce {
  0% {
    transform: scale(0) rotate(-180deg);
  }
  50% {
    transform: scale(1.3) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.used-checkmark svg {
  width: 48px;
  height: 48px;
  color: #00d4ff;
  stroke-width: 4;
  animation: checkmarkDraw 0.5s ease 0.3s backwards;
}

@keyframes checkmarkDraw {
  from {
    stroke-dasharray: 0 100;
  }
  to {
    stroke-dasharray: 100 0;
  }
}

.used-label {
  color: white;
  font-weight: 900;
  font-size: 1.4rem;
  text-shadow:
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  animation: labelFadeIn 0.4s ease 0.4s backwards;
}

@keyframes labelFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card.used {
  cursor: not-allowed;
  opacity: 0.95;
  filter: saturate(0.8);
}

.category-card.used:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.2);
}

.badge-appear-enter-active {
  animation: badgeAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badgeAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Removed old used-overlay styles - now using used-badge */

@keyframes slideUpOverlay {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}




/* Question Loader Overlay */
.question-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loader-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

.loader-card {
  position: relative;
  z-index: 2;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 30px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(139, 92, 246, 0.2);
  animation: cardSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.orb-wrapper-large {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 50%;
  position: relative;
  z-index: 3;
  box-shadow:
    0 0 40px var(--primary-glow),
    0 0 80px var(--primary-glow),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  animation: orbFloatLarge 3s ease-in-out infinite;
}

@keyframes orbFloatLarge {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.1);
  }
}

.orb-ring-large {
  position: absolute;
  width: 110px;
  height: 110px;
  border: 4px solid var(--accent-color);
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
  z-index: 2;
  animation: orbRingRotate 2s linear infinite;
}

.orb-pulse-large {
  position: absolute;
  width: 130px;
  height: 130px;
  border: 3px solid var(--accent-color);
  border-radius: 50%;
  z-index: 1;
  animation: orbPulse 2s ease-out infinite;
  opacity: 0;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: particleOrbit 3s linear infinite;
  animation-delay: calc(var(--i) * -0.375s);
  transform-origin: 75px;
}

@keyframes particleOrbit {
  from {
    transform: rotate(0deg) translateX(75px) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(75px) rotate(-360deg);
    opacity: 0.2;
  }
}

.loader-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin: 0;
}

.loader-subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  margin: 0;
}

.loader-progress {
  width: 100%;
  height: 6px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.loader-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
  border-radius: 10px;
  animation: progressIndeterminate 1.5s ease-in-out infinite;
}

@keyframes progressIndeterminate {
  0% {
    width: 0%;
    margin-left: 0;
  }
  50% {
    width: 40%;
    margin-left: 30%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}



@keyframes orbRingRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


@keyframes orbPulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* Fade Overlay Transition */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

@keyframes textFade {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}


/* Verification Overlay */
.verification-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.92), rgba(20, 0, 40, 0.95));
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.verification-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  animation: fadeInUp 0.6s ease;
  background: rgba(255, 255, 255, 0.03);
  padding: 4rem 3rem;
  border-radius: 30px;
  border: 2px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
              0 0 100px rgba(139, 92, 246, 0.15);
}

.orb-wrapper-verification {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-verification {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 50%;
  position: relative;
  z-index: 3;
  box-shadow:
    0 0 60px var(--primary-glow),
    0 0 120px var(--primary-glow),
    inset 0 0 40px rgba(255, 255, 255, 0.3);
  animation: orbFloatVerification 2.5s ease-in-out infinite;
}

@keyframes orbFloatVerification {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow:
      0 0 60px var(--primary-glow),
      0 0 120px var(--primary-glow),
      inset 0 0 40px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: translateY(-25px) scale(1.15);
    box-shadow:
      0 0 90px var(--primary-glow),
      0 0 160px var(--primary-glow),
      inset 0 0 50px rgba(255, 255, 255, 0.4);
  }
}

.orb-ring-verification {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 5px solid var(--accent-color);
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
  z-index: 2;
  animation: orbRingRotate 2s linear infinite;
}

.orb-pulse-verification {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 4px solid var(--accent-color);
  border-radius: 50%;
  z-index: 1;
  animation: orbPulse 2s ease-out infinite;
  opacity: 0;
}

.particle-verification {
  position: absolute;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 50%;
  box-shadow: 0 0 15px var(--accent-color);
  animation: particleOrbitVerification 4s linear infinite;
  animation-delay: calc(var(--i) * -0.4s);
  transform-origin: 90px;
}

@keyframes particleOrbitVerification {
  from {
    transform: rotate(0deg) translateX(90px) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(90px) rotate(-360deg);
    opacity: 0.2;
  }
}

.verification-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: titlePulseVerification 2s ease-in-out infinite;
}

@keyframes titlePulseVerification {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.03);
  }
}

.verification-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.verification-progress {
  width: 100%;
  max-width: 400px;
  height: 8px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.verification-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--primary-color), #00c9ff, #92fe9d);
  background-size: 300% 100%;
  border-radius: 10px;
  animation: progressFlowVerification 2s ease-in-out infinite;
  box-shadow: 0 0 20px var(--primary-glow);
}

@keyframes progressFlowVerification {
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  50% {
    width: 70%;
    background-position: 100% 50%;
  }
  100% {
    width: 100%;
    background-position: 200% 50%;
  }
}

/* Result Overlays */
.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.result-overlay.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95));
}

.result-overlay.fail {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Success Icon */
.success-icon-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #10b981;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5),
              0 0 80px rgba(255, 255, 255, 0.3);
  animation: successPulse 1.5s ease infinite;
  position: relative;
  z-index: 2;
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.5),
                0 0 80px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.7),
                0 0 100px rgba(255, 255, 255, 0.5);
  }
}

.success-particles {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: particleExpand 2s ease-out infinite;
  z-index: 1;
}

@keyframes particleExpand {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Fail Icon */
.fail-icon-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fail-icon {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #ef4444;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5),
              0 0 80px rgba(255, 255, 255, 0.3);
  animation: failShake 0.8s ease;
  position: relative;
  z-index: 2;
}

@keyframes failShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.fail-particles {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: particlePulse 1.5s ease infinite;
  z-index: 1;
}

@keyframes particlePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.2;
  }
}

/* Result Text */
.result-title {
  font-weight: 900;
  color: white;
  text-align: center;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s 0.2s ease backwards;
}

.result-subtitle {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;

  line-height: 1.6;

  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s 0.4s ease backwards;
}

/* Result Buttons */
.result-button {
  padding: 1.25rem 3rem;
  font-weight: 700;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s 0.6s ease backwards;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.success-button {
  background: white;
  color: #10b981;
}

.success-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.fail-button {
  background: white;
  color: #ef4444;
}

.fail-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

/* Fade Scale Transition */
.fade-scale-enter-active {
  transition: all 0.5s ease;
}

.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Responsive for overlays */
@media (max-width: 768px) {
  

  .success-icon-wrapper,
  .fail-icon-wrapper {
    width: 120px;
    height: 120px;
  }

  .success-icon,
  .fail-icon {
    width: 100px;
    height: 100px;
  }

  .result-button {
    padding: 1rem 2rem;
  }
}

/* Shimmer Loading for Categories */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer-category-card {
  pointer-events: none !important;
  cursor: default !important;
  animation: shimmer-fade-in 0.4s ease;
}

@keyframes shimmer-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.shimmer-category-icon,
.shimmer-category-name,
.shimmer-category-desc {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 8px;
}

.shimmer-category-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
}

.shimmer-category-name {
  width: 70%;
  height: 20px;
  margin: 0 auto 0.5rem;
}

.shimmer-category-desc {
  width: 90%;
  height: 16px;
  margin: 0 auto;
}
.floating-guess-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10000;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  background: linear-gradient(135deg, #7b2ff7, #f107a3, #00c9ff, #92fe9d);
  background-size: 400% 400%;
  animation: gradientShift 6s ease infinite, glowPulse 2.5s ease-in-out infinite;
  box-shadow:
    0 0 20px rgba(241, 7, 163, 0.6),
    0 0 40px rgba(0, 201, 255, 0.4);
  backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ✨ تدرج لوني متغير */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 💫 نبض الضوء */
@keyframes glowPulse {
  0%, 100% {
    box-shadow:
      0 0 20px rgba(241, 7, 163, 0.6),
      0 0 40px rgba(0, 201, 255, 0.4),
      0 0 60px rgba(146, 254, 157, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow:
      0 0 35px rgba(241, 7, 163, 0.9),
      0 0 70px rgba(0, 201, 255, 0.8),
      0 0 90px rgba(146, 254, 157, 0.6);
    transform: scale(1.05);
  }
}

/* ✍️ التأثير عند التحويم */
.floating-guess-button:hover {
  transform: translateY(-6px) scale(1.08);
  box-shadow:
    0 0 40px rgba(241, 7, 163, 0.9),
    0 0 80px rgba(0, 201, 255, 0.7),
    0 0 120px rgba(146, 254, 157, 0.5);
  filter: brightness(1.2);
}

/* 💨 انيميشن الظهور */
.fab-fade-enter-active,
.fab-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fab-fade-enter-from,
.fab-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}


/* Animation لمكون التخمين */
.guess-slide-up-enter-active,
.guess-slide-up-leave-active {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.45s ease;
}
.guess-slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.guess-slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.guess-slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.guess-slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.floating-guess-button.moved-up {
  bottom: 12rem; 
}

@media (max-height: 700px) {
  .floating-guess-button.moved-up {
    bottom: 35rem;
  }
}

@media (max-width: 768px) {
  .floating-guess-button.moved-up {
    bottom: 35rem;
    right: 1rem;
  }
}

/* Accordion effect for conversation */
.accordion {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* عندما تُفتح القائمة */
.accordion-fade-enter-active,
.accordion-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.accordion-fade-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px) scale(0.96);
}
.accordion-fade-enter-to {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0) scale(1);
}
.accordion-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}
.accordion-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.category-name{
  font-size: 1rem;
}
.category-desc{
  font-size: 0.9rem;
}


@media (max-width: 768px) {
.category-name{
  font-size: 1.3rem;
}
.category-desc{
  font-size: 1.2rem;
}
.section-title{
  font-size: 1.5rem;
}
}

/* Chat Sidebar Styles */
.chat-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background: var(--card-bg);
  border-right: 2px solid var(--border-color);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 1001;

  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-sidebar.sidebar-open {
  transform: translateX(0);
}



.sidebar-toggle {
  position: absolute;
  right: -48px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-left: none;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.3s ease;
  z-index: 101;
}

.sidebar-toggle:hover {
  background: var(--accent-color);
  color: white;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 1.5rem;
  overflow: hidden;
}

.sidebar-title {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  text-align: center;
}

.sidebar-history {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 0.5rem;
}

.sidebar-history::-webkit-scrollbar {
  width: 6px;
}

.sidebar-history::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.sidebar-history::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

.sidebar-history::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: slideInLeft 0.4s ease;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-question {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 12px 2px;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-answer {
  padding: 0.75rem 1rem;
  border-radius: 12px 12px 2px 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
}

.sidebar-answer.yes {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.sidebar-answer.no {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.sidebar-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-text {
  flex: 1;
  word-wrap: break-word;
}

.main-game-area {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.3s ease;
}

.main-game-area.has-sidebar {
  /* margin-left: 350px; */
  padding-right: 1rem;
}

@media (min-width: 1400px) {
  .main-game-area.has-sidebar {
    margin-left: 175px;
    padding-right: 2rem;
  }
}

/* Answer Overlay Styles */
.answer-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.answer-overlay.correct {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.98));
  animation: correctPulse 0.6s ease-out;
}

.answer-overlay.incorrect {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.98));
  animation: incorrectShake 0.5s ease-out;
}

@keyframes correctPulse {
  0% {
    background-color: rgba(16, 185, 129, 0);
  }
  50% {
    background-color: rgba(16, 185, 129, 1);
  }
  100% {
    background-color: rgba(16, 185, 129, 0.95);
  }
}

@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.answer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: answerBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes answerBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-100px);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.answer-icon-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.answer-icon {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: 900;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.6),
              0 0 100px rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 2;
  animation: iconPulse 1.5s ease-in-out infinite;
}

.answer-overlay.correct .answer-icon {
  color: #10b981;
}

.answer-overlay.incorrect .answer-icon {
  color: #ef4444;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.6),
                0 0 100px rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 80px rgba(255, 255, 255, 0.8),
                0 0 120px rgba(255, 255, 255, 0.6);
  }
}

.answer-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  animation: rippleExpand 1.5s ease-out infinite;
  z-index: 1;
}

@keyframes rippleExpand {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.answer-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  text-align: center;
  margin: 0;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  animation: titleFadeIn 0.8s 0.3s ease backwards;
}

.answer-text {
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  animation: textFadeIn 0.8s 0.5s ease backwards;
}

@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.chat-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background: var(--card-bg);
  border-right: 2px solid var(--border-color);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 1001;

  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
/* Overlay Slide Transition */
.overlay-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.overlay-slide-leave-active {
  transition: all 0.4s ease;
}

.overlay-slide-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.overlay-slide-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1200px) {
  .chat-sidebar {
    width: 320px;
  }

  .main-game-area.has-sidebar {
    margin-left: 0;
    padding-right: 0;
  }

  .main-game-area.has-sidebar .question-area {
    padding: 1.5rem 1rem;
  }


  .categories-grid.has-sidebar {
    margin-left: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 968px) {
  .chat-sidebar {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .chat-sidebar {
    width: 260px;
  }

  .sidebar-title {
    font-size: 1.1rem;
  }

  .sidebar-question,
  .sidebar-answer {
    font-size: 0.85rem;
  }

  .answer-icon-wrapper {
    width: 140px;
    height: 140px;
  }

  .answer-icon {
    width: 100px;
    height: 100px;
    font-size: 3.5rem;
  }

  .answer-title {
    font-size: 2.5rem;
  }

  .answer-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .chat-sidebar {
    width: 260px;
  }

  .answer-title {
    font-size: 2rem;
  }

  .answer-text {
    font-size: 1.2rem;
  }
}

/* Modern Question Area */
.question-area {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: padding 0.3s ease;
  box-sizing: border-box;
}

.main-game-area.has-sidebar .question-area {
  padding: 1.5rem 1.5rem;
}

@media (min-width: 1200px) {
  .question-area {
    padding: 2rem 2rem;
  }

  .main-game-area.has-sidebar .question-area {
    padding: 2rem 2.5rem;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.question-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (min-width: 1200px) {
  .question-title-wrapper {
    gap: 2rem;
    margin-bottom: 3rem;
  }
}

@media (max-width: 767px) {
  .question-title-wrapper {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-icon-ring {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotateRing 20s linear infinite;
}

@keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.question-icon-ring::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(45deg, var(--accent-color), var(--primary-color), #00c9ff, #92fe9d);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: gradientRotate 3s linear infinite;
}

@keyframes gradientRotate {
  to { transform: rotate(360deg); }
}

.question-icon {
  font-size: 3rem;
  z-index: 2;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.questions-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.4;
  max-width: 100%;
  position: relative;
  padding: 0 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (min-width: 1200px) {
  .questions-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .questions-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 767px) {
  .questions-title {
    font-size: 1.5rem;
    padding: 0 0.5rem;
  }
}


.questions-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
  border-radius: 2px;
  animation: widthPulse 2s ease-in-out infinite;
}

@keyframes widthPulse {
  0%, 100% { width: 100px; opacity: 0.6; }
  50% { width: 150px; opacity: 1; }
}

/* Modern Options Grid */
.options-grid-modern {
   display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); */

    grid-template-columns: repeat(auto-fit, 260px);
  gap: 1.25rem;


  justify-content: center;

  padding: 0.5rem;
  margin: 0 auto;
  width: 100%;
  /* max-width: 1100px; */

  perspective: 1000px;
  box-sizing: border-box;
}

/* Large Desktops (1600px+) */


/* Desktop (1200px - 1599px) */
@media (min-width: 1200px) and (max-width: 1400px) {
  .options-grid-modern {
     grid-template-columns: repeat(auto-fit, 280px);
    gap: 1.25rem;
  }
  
}

/* Small Desktop / Large Laptop (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px) {
  .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Laptop (900px - 1023px) */
@media (min-width: 900px) and (max-width: 1023px) {
  .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Tablet (768px - 899px) */
@media (min-width: 768px) and (max-width: 899px) {
  .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

/* Small Tablet / Large Phone (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }
}

/* Mobile (max 479px) */
@media (max-width: 479px) {
  .options-grid-modern {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.25rem;
  }
}

.option-card {
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: staggerSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--index) * 0.1s);
}

@keyframes staggerSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(-20deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.option-card:hover:not(.disabled) {
  transform: translateY(-8px) scale(1.02);
  z-index: 10;
}

@media (max-width: 1199px) {
  .option-card:hover:not(.disabled) {
    transform: translateY(-6px) scale(1.015);
  }
}

.option-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}










.option-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.5;
  margin: 0;
  z-index: 2;
  transition: all 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  width: 100%;
  max-width: 100%;
}

@media (min-width: 1600px) {
  .option-text {
    font-size: 1.2rem;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .option-text {
    font-size: 1.05rem;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .option-text {
    font-size: 1rem;
  }
}

@media (max-width: 899px) {
  .option-text {
    font-size: 0.95rem;
  }
}

.option-card:hover:not(.disabled) .option-text {
  color: var(--accent-color);
  transform: scale(1.05);
}

.option-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.option-card:hover:not(.disabled) .option-shine {
  transform: translateX(100%);
}

/* Stagger Slide Transition */
.stagger-slide-enter-active,
.stagger-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stagger-slide-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
}

.stagger-slide-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.9);
}
.option-image {
  width: 120px;
  height: 120px;
  max-width: 100%;

  margin-top: 0.5rem;
  padding: 8px;

  border-radius: 14px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 3px solid rgba(255, 255, 255, 0.9);

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);

  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.15));
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  position: relative;
}



@media (min-width: 1600px) {
  .option-image {
    width: 140px;
    height: 140px;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .option-image {
    width: 130px;
    height: 130px;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .option-image {
    width: 110px;
    height: 110px;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .option-image {
    width: 100px;
    height: 100px;
  }
}

@media (min-width: 1400px) {
  .option-image {
    width: 120px;
    height: 120px;
  }
}

.option-image::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.option-card:hover:not(.disabled) .option-image {
  transform: scale(1.1) translateY(-8px) rotate(2deg);
  border-color: var(--accent-color);
  background: linear-gradient(135deg, #ffffff, #faf5ff);
  box-shadow:
    0 16px 48px rgba(139, 92, 246, 0.3),
    0 8px 24px rgba(139, 92, 246, 0.2),
    0 0 0 4px rgba(139, 92, 246, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
}

.option-card:hover:not(.disabled) .option-image::before {
  opacity: 0.15;
}

@media (max-width: 768px) {
  .option-image {
    width: 140px;
    height: 140px;
  }

  .verification-loader {
    padding: 3rem 2rem;
  }

  .verification-title {
    font-size: 2rem;
  }

  .verification-subtitle {
    font-size: 1.1rem;
  }

  .orb-wrapper-verification {
    width: 140px;
    height: 140px;
  }

  .orb-verification {
    width: 80px;
    height: 80px;
  }

  .orb-ring-verification {
    width: 120px;
    height: 120px;
  }

  .orb-pulse-verification {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .option-image {
    width: 120px;
    height: 120px;
  }

  .verification-loader {
    padding: 2rem 1.5rem;
  }

  .verification-title {
    font-size: 1.8rem;
  }

  .verification-subtitle {
    font-size: 1rem;
  }
}
/* Special optimization for 1366x656 and below screen heights */
@media (max-width: 1400px) and (max-height: 700px) {
  .game-screen {
    padding: 0.75rem 1.5rem 0.5rem;
    height: 100vh;
    overflow-y: auto;
  }

  .game-header {
    margin-bottom: 0.75rem;
  }

  .header-stats {
    gap: 1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-value {
    font-size: 0.85rem;
  }

  .give-up-button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .question-area {
    padding: 0.5rem 1rem !important;
  }

  .question-title-wrapper {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .question-icon-ring {
    width: 50px;
    height: 50px;
  }

  .question-icon {
    font-size: 1.75rem;
  }

  .questions-title {
    font-size: 1.25rem;
    line-height: 1.3;
    padding: 0 0.5rem;
  }

  .question-title-wrapper {
    gap: 0.875rem;
    margin-bottom: 1.25rem;
  }

  .question-area {
    padding: 1rem 0.75rem;
  }

  .options-grid-modern {
    gap: 0.75rem;
    padding: 0.25rem;
    grid-template-columns: 1fr !important;
  }


 

  .option-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .option-image {
    width: 80px;
    height: 80px;
    margin-top: 0.25rem;
  }

  .category-card {
    min-height: 180px;
  }

  .category-content {
    padding: 1rem 0.75rem;
  }

  .category-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-name {
    font-size: 1rem;
  }

  .category-desc {
    font-size: 0.85rem;
  }

  .categories-wrapper {
    /* grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); */
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.5rem;

  justify-content: center;
  width: 100%;
  
  }

  .section-title {
    font-size: 1.25rem;
  }

  .chat-sidebar {
    width: 260px;
  }



  .categories-grid.has-sidebar {
   
    padding: 1rem 0.75rem;
  }

  .sidebar-title {
    font-size: 1rem;
    padding: 1rem;
  }

  .sidebar-history {
    padding: 0.5rem;
  }

  .sidebar-item {
    padding: 0.65rem;
    margin-bottom: 0.5rem;
  }

  .sidebar-question,
  .sidebar-answer {
    font-size: 0.8rem;
  }

  .answer-overlay {
    padding: 0.5rem;
  }

  .answer-icon-wrapper {
    width: 120px;
    height: 120px;
  }

  .answer-icon {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }

  .answer-title {
    font-size: 2rem;
  }

  .answer-text {
    font-size: 1.25rem;
  }

  .loader-card {
    padding: 2rem 1.5rem;
  }

  .loader-title {
    font-size: 1.5rem;
  }

  .orb-wrapper-large {
    width: 120px;
    height: 120px;
  }

  .orb-large {
    width: 60px;
    height: 60px;
  }

  .verification-loader {
    padding: 2.5rem 1.5rem;
  }

  .verification-title {
    font-size: 1.8rem;
  }

  .verification-subtitle {
    font-size: 1rem;
  }

  .orb-wrapper-verification {
    width: 120px;
    height: 120px;
  }

  .orb-verification {
    width: 70px;
    height: 70px;
  }
}

/* .categories-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  box-sizing: border-box;
  margin: 0 auto;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
} */

.categories-grid.has-sidebar {
  padding-left: calc(350px + 1rem);
  max-width: 100%;
}

@media (min-width: 1400px) {
  .categories-grid.has-sidebar {
    max-width: 1400px;
  }
  
  .categories-grid.has-sidebar {
    padding-left: calc(350px + 2rem);
  }
}

@media (max-width: 768px) {
  .categories-grid.has-sidebar {
    padding-left: 1rem;
  }
}

/* new changes options */

/* .options-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  padding: 0.5rem;
  perspective: 1000px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
} */

/* When sidebar is open - reduce columns to prevent overlap */
.main-game-area.has-sidebar .options-grid-modern {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: calc(100% - 2rem);
}

/* Large Desktops (1600px+) */
@media (min-width: 1600px) {
 
  
  /* With sidebar open, reduce to 3 columns */
  .main-game-area.has-sidebar .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop (1200px - 1599px) */
@media (min-width: 1200px) and (max-width: 1599px) {
 .options-grid-modern {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
  
  /* With sidebar open, reduce to 3 columns */
  .main-game-area.has-sidebar .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Small Desktop / Large Laptop (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px) {
  .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  /* With sidebar open, reduce to 2 columns */
  .main-game-area.has-sidebar .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Laptop (900px - 1023px) */
@media (min-width: 900px) and (max-width: 1023px) {
  .options-grid-modern {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  /* With sidebar open, reduce to 2 columns */
  .main-game-area.has-sidebar .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet (768px - 899px) */
@media (min-width: 768px) and (max-width: 899px) {
  .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  /* With sidebar open, single column */
  .main-game-area.has-sidebar .options-grid-modern {
    grid-template-columns: 1fr;
  }
}

/* Small Tablet / Large Phone (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }
}

/* Mobile (max 479px) */
@media (max-width: 479px) {
  .options-grid-modern {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.25rem;
  }
}


.question-area {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: padding 0.3s ease;
  box-sizing: border-box;
}

.main-game-area.has-sidebar .question-area {
  padding: 1.5rem 1.5rem;
  /* margin-left: 350px; */
  width: 100%;
}

@media (min-width: 1200px) {
  .question-area {
    padding: 2rem 2rem;
  }

  .main-game-area.has-sidebar .question-area {
    padding: 2rem 2.5rem;
    /* margin-left: 350px; */
    width: calc(100% - 350px);
  }
}.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: fadeIn 0.25s ease-out;
}

/* خلفية غامقة واضحة */
.confirm-box {
  background: #1e1e1e;
  padding: 30px;
  width: 340px;
  color: white;            /* النص أبيض */
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  text-align: center;
  animation: scaleIn 0.25s ease-out;
}

.confirm-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.confirm-text {
  color: #dddddd;
  font-size: 14px;
}

.confirm-actions {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}

.confirm-actions .btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.confirm-actions .cancel {
  background: #555;
  color: white;
}

.confirm-actions .confirm {
  background: #ff3b3b;
  color: white;
}

.confirm-actions .confirm:hover {
  background: #ff1e1e;
}

/* Loader */
.loading-container {
  margin-top: 20px;
}

.loader {
  width: 38px;
  height: 38px;
  border: 4px solid #ffffff33;
  border-top-color: white;
  border-radius: 50%;
  margin: 0 auto 10px auto;
  animation: spin 0.7s linear infinite;
}

.loading-text {
  color: #fff;
  font-size: 14px;
  opacity: 0.85;
}

@keyframes spin {
  to { transform: rotate(360deg);}
}

@keyframes fadeIn {
  from { opacity: 0 }
  to   { opacity: 1 }
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0 }
  to   { transform: scale(1); opacity: 1 }
}
/* ===== تحسين Categories Grid ===== */
.categories-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  /* إزالة margin-left تماماً */
  margin: 0 auto;
  transition: padding 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* إزالة التأثير السابق للـ sidebar */
.categories-grid.has-sidebar {
  /* ما في margin-left */
  padding: 1rem 1.5rem;
}

@media (min-width: 1400px) {
  .categories-grid.has-sidebar {
    padding: 1.5rem 2rem;
  }
}

/* ===== Categories Wrapper - استغلال كامل المساحة ===== */
.categories-wrapper {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 🎯 Desktop كبير (1600px+) */
@media (min-width: 1600px) {
  .categories-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.5rem;

  justify-content: center;
  width: 100%;
  }
}

/* 🎯 Desktop (1200px - 1599px) */
@media (min-width: 1200px) and (max-width: 1599px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.35rem;
    max-width: 1200px;
  }
}

/* 🎯 Laptop (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
    max-width: 1000px;
  }
}

/* 🎯 Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .categories-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
    max-width: 750px;
  }
}

/* 🎯 Mobile (max 767px) */
@media (max-width: 767px) {
  .categories-wrapper {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 550px;
  }
  
  .categories-grid.has-sidebar {
    padding: 1rem;
  }
}

/* ===== إخفاء Sidebar في الشاشات الصغيرة ===== */
@media (max-width: 1200px) {
  .chat-sidebar {
    transform: translateX(-100%);
  }
  
  .chat-sidebar.sidebar-open {
    transform: translateX(0);
  }
  
 
  
  /* إزالة margin للـ main-game-area */
  .main-game-area.has-sidebar {
    margin-left: 0;
    padding-right: 0;
  }
}

/* ===== تحسين Main Game Area ===== */
.main-game-area {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* في الشاشات الكبيرة فقط - إضافة margin للـ sidebar */
@media (min-width: 1201px) {
  .main-game-area.has-sidebar {
    /* margin-left: 350px; */
    width: calc(100% - 350px);
  }
  
  .categories-grid {
    padding: 1rem 2rem;
  }
}

/* ===== Category Card - تحسين الحجم ===== */
.category-card {
  position: relative;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: categoryFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--card-index) * 0.08s);
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* 🎯 أحجام مختلفة حسب الشاشة */
@media (min-width: 1600px) {
  .category-card {
    min-height: 320px;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .category-card {
    min-height: 300px;
  }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .category-card {
    min-height: 280px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .category-card {
    min-height: 260px;
  }
}

@media (max-width: 767px) {
  .category-card {
    min-height: 240px;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.question-area {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: padding 0.3s ease;
  box-sizing: border-box;
}

/* إزالة التأثير السابق */
@media (min-width: 1201px) {
  .main-game-area.has-sidebar .question-area {
    padding: 2rem 2.5rem;
  }
}

@media (max-width: 1200px) {
  .question-area {
    padding: 1.5rem 1rem;
  }
}
/* ===== Categories Grid - حل نهائي ===== */
.categories-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  margin: 0 auto;
  /* إزالة أي margin-left تماماً */
  transition: padding 0.4s ease;
}

/* إزالة التأثير للـ sidebar تماماً */
.categories-grid.has-sidebar {

  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

/* ===== Categories Wrapper - Responsive ذكي ===== */
.categories-wrapper {
  display: grid;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0;
}

/* 🖥️ شاشات كبيرة جداً (1920px+) */
@media (min-width: 1920px) {
.categories-wrapper {
  /* display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto; */

   display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.5rem;

  justify-content: center;
  width: 100%;
}
  
  .category-card {
    min-height: 350px;
  }
}

/* 🖥️ شاشات كبيرة (1600px - 1919px) */
@media (min-width: 1600px) and (max-width: 1919px) {
  .categories-wrapper {
    /* grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.75rem;
    max-width: 1400px; */

     display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.5rem;

  justify-content: center;
  width: 100%;
  }
  
  .category-card {
    min-height: 320px;
  }
}

/* 💻 Desktop (1366px - 1599px) - الأكثر شيوعاً */
@media (min-width: 1366px) and (max-width: 1599px) {
  .categories-wrapper {
    /* grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    max-width: 1200px; */

     display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 1.5rem;

  justify-content: center;
  width: 100%;
  }
  
  .category-card {
    min-height: 300px;
  }
}

/* 💻 Laptop (1200px - 1365px) */
@media (min-width: 1200px) and (max-width: 1365px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.35rem;
    max-width: 1100px;
  }
  
  .category-card {
    min-height: 285px;
  }
}

/* 💻 Laptop صغير (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px) {
  .categories-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1.25rem;
    max-width: 950px;
  }
  
  .category-card {
    min-height: 270px;
  }
}

/* 📱 Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .categories-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
    max-width: 100%;
  }
  
  .category-card {
    min-height: 250px;
  }
}

/* 📱 Tablet صغير (640px - 767px) */
@media (min-width: 640px) and (max-width: 767px) {
  .categories-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    max-width: 100%;
  }
  
  .category-card {
    min-height: 230px;
  }
}

/* 📱 Mobile (480px - 639px) */
@media (min-width: 480px) and (max-width: 639px) {
  .categories-wrapper {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 500px;
  }
  
  .category-card {
    min-height: 220px;
  }
}

/* 📱 Mobile صغير (max 479px) */
@media (max-width: 479px) {
  .categories-wrapper {
    grid-template-columns: 1fr;
    gap: 0.875rem;
    max-width: 100%;
  }
  
  .category-card {
    min-height: 250px;
  }
}

/* ===== إخفاء تأثير Sidebar في الشاشات الصغيرة ===== */
@media (max-width: 1366px) {

  
  /* إزالة أي تأثير على main-game-area */
  .main-game-area.has-sidebar {
   
    width: 100% !important;
  }
  
  /* إزالة أي تأثير على categories-grid */
  .categories-grid.has-sidebar {
   
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}

/* ===== تأثير Sidebar فقط في الشاشات الكبيرة ===== */
@media (min-width: 1367px) {
  .main-game-area.has-sidebar {
    /* margin-left: 350px; */
    width: calc(100% - 350px);
    transition: all 0.4s ease;
  }
  
  .categories-grid {
    max-width: 100%;
  }
  
  .categories-wrapper {
    /* استخدام calc لطرح عرض الـ sidebar */
    max-width: 100%;
  }
}

/* ===== Category Card - أحجام نصوص responsive ===== */
.category-title {
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.3);
  line-height: 1.3;
  margin: 0;
  transition: all 0.3s ease;
}

/* أحجام نصوص مختلفة حسب الشاشة */
@media (min-width: 1920px) {
  .category-title {
    font-size: 1.75rem;
  }
  
  .category-description {
    font-size: 1.1rem;
  }
}

@media (min-width: 1600px) and (max-width: 1919px) {
  .category-title {
    font-size: 1.6rem;
  }
  
  .category-description {
    font-size: 1.05rem;
  }
}

@media (min-width: 1366px) and (max-width: 1599px) {
  .category-title {
    font-size: 1.5rem;
  }
  
  .category-description {
    font-size: 1rem;
  }
}

@media (min-width: 1200px) and (max-width: 1365px) {
  .category-title {
    font-size: 1.4rem;
  }
  
  .category-description {
    font-size: 0.95rem;
  }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .category-title {
    font-size: 1.35rem;
  }
  
  .category-description {
    font-size: 0.925rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .category-title {
    font-size: 1.3rem;
  }
  
  .category-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 767px) {
  .category-title {
    font-size: 1.25rem;
  }
  
  .category-description {
    font-size: 0.875rem;
  }
}

/* ===== Section Title - Responsive ===== */
.section-title {
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1rem;
}

@media (min-width: 1600px) {
  .section-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1366px) and (max-width: 1599px) {
  .section-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1200px) and (max-width: 1365px) {
  .section-title {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .section-title {
    font-size: 1.85rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .section-title {
    font-size: 1.65rem;
  }
}

@media (max-width: 767px) {
  .section-title {
    font-size: 1.5rem;
  }
}

/* ===== Game Content - إصلاح العرض ===== */
.game-content {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ===== Main Game Area ===== */
.main-game-area {
  width: 100%;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ===== Overlay للـ Sidebar في الشاشات الصغيرة ===== */


.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  backdrop-filter: blur(8px);
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.open-sidebar-fab {
  position: fixed;
  left: 1rem;
  bottom: 6rem;
  z-index: 1002;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: white;

  background: linear-gradient(
    135deg,
    var(--accent-color),
    var(--primary-color)
  );

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(var(--accent-rgb), 0.6);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.open-sidebar-fab:hover {
  transform: scale(1.1);
  box-shadow:
    0 12px 36px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(var(--accent-rgb), 0.9);
}
.guess-warning {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  font-weight: 700;
  border-radius: 12px;
  text-align: center;
}

/* ============================
   📱 MOBILE RESPONSIVE OPTIMIZATIONS
   ============================*/

/* ===== Base Game Screen ===== */
@media (max-width: 768px) {
  .game-screen {
    padding: 1rem 0.75rem;
    padding-bottom: 7rem;
    padding-top: 1rem;
  }

  /* Header */
  .game-header {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .header-stats {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  .stat-item {
    padding: 0.35rem 0.5rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    min-width: auto;
  }

  .stat-label {
    display: none; /* 🔥 أهم سطر */
  }

  .stat-value {
    font-size: 0.85rem;
    font-weight: 700;
  }

   .give-up-button {
    padding: 0.45rem;
    font-size: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .give-up-button::before {
    content: "✖";
    font-size: 1rem;
  }

  /* Back Button */
  .back-to-categories-button {
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
    width: 100%;
    justify-content: center;
  }

  .back-button-text {
    font-size: 0.85rem;
  }

  .back-button-icon {
    width: 24px;
    height: 24px;
  }

  /* Question Area */
  .question-area {
    padding: 1rem 0.5rem;
  }

  .question-title-wrapper {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .question-icon-ring {
    width: 80px;
    height: 80px;
  }

  .question-icon {
    font-size: 2.5rem;
  }

  .questions-title {
    font-size: 1.5rem;
    padding: 0 0.5rem;
    line-height: 1.4;
  }

  /* Options Grid */
  .options-grid-modern {
    grid-template-columns: 1fr !important;
    gap: 1rem;
    padding: 0.25rem;
  }


  .option-text {
    font-size: 1.05rem;
    line-height: 1.5;
  }

  .option-image {
    width: 120px;
    height: 120px;
  }

  /* Categories Grid */
  .categories-grid {
    padding: 1rem 0.5rem;
  }

  .categories-grid.has-sidebar {
    margin-left: 0;
    padding: 1rem 0.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .categories-wrapper {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .category-card {
    min-height: 240px;
  }

  .category-title {
    font-size: 1.35rem;
  }

  .category-description {
    font-size: 0.95rem;
  }

  /* Sidebar */
  .chat-sidebar {
    width: 280px;
  }

  .sidebar-title {
    font-size: 1.1rem;
  }

  .sidebar-question,
  .sidebar-answer {
    font-size: 0.875rem;
    padding: 0.625rem 0.875rem;
  }

  /* Answer Overlay */
  .answer-icon-wrapper {
    width: 140px;
    height: 140px;
  }

  .answer-icon {
    width: 100px;
    height: 100px;
    font-size: 3.5rem;
  }

  .answer-title {
    font-size: 2.5rem;
  }

  .answer-text {
    font-size: 1.5rem;
  }

  /* Loader */
  .loader-card {
    padding: 2rem 1.5rem;
  }

  .loader-title {
    font-size: 1.5rem;
  }

  .orb-wrapper-large {
    width: 120px;
    height: 120px;
  }

  .orb-large {
    width: 60px;
    height: 60px;
  }

  /* Verification */
  .verification-loader {
    padding: 2.5rem 1.5rem;
  }

  .verification-title {
    font-size: 2rem;
  }

  .verification-subtitle {
    font-size: 1.1rem;
  }

  .orb-wrapper-verification {
    width: 140px;
    height: 140px;
  }

  .orb-verification {
    width: 80px;
    height: 80px;
  }

  /* Floating Button */
  .floating-guess-button {
    bottom: 1.5rem;
    right: 1rem;
    left: 1rem;
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }



  /* Confirm Overlay */
  .confirm-box {
    width: 90%;
    max-width: 340px;
    padding: 1.5rem;
  }

  .confirm-title {
    font-size: 1.25rem;
  }

  .confirm-text {
    font-size: 0.9rem;
  }

   .game-content {
    padding-top: 0;
  }

  .question-area,
  .categories-grid {
    padding-top: 0.25rem;
  }

    .categories-wrapper {
    gap: 1.25rem;
  }

  .category-card {
    min-height: 260px;
  }

  .category-title {
    font-size: 1.45rem;
  }

  .category-description {
    font-size: 1rem;
  }

  .options-grid-modern {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }


  .option-text {
    font-size: 1.15rem;
    line-height: 1.6;
  }
}

/* ===== Mobile Small (480px - 640px) ===== */
@media (max-width: 640px) {
  .game-screen {
    padding: 0.75rem 0.5rem;
    padding-bottom: 6rem;
  }

  .game-header {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .header-stats {
    gap: 0.5rem;
  }

  .stat-item {
    padding: 0.625rem 0.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-value {
    font-size: 0.9rem;
  }

  .give-up-button {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .back-to-categories-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }

  .question-area {
    padding: 0.75rem 0.375rem;
  }

  .question-title-wrapper {
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .question-icon-ring {
    width: 70px;
    height: 70px;
  }

  .question-icon {
    font-size: 2rem;
  }

  .questions-title {
    font-size: 1.35rem;
    padding: 0 0.25rem;
  }

  .options-grid-modern {
    gap: 0.875rem;
  }


  .option-text {
    font-size: 1rem;
  }

  .option-image {
    width: 110px;
    height: 110px;
  }

  .categories-grid {
    padding: 0.75rem 0.375rem;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .categories-wrapper {
    gap: 0.875rem;
  }

  .category-card {
    min-height: 220px;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .category-description {
    font-size: 0.9rem;
  }

  .chat-sidebar {
    width: 260px;
  }

  .answer-title {
    font-size: 2.25rem;
  }

  .answer-text {
    font-size: 1.35rem;
  }

  .loader-title {
    font-size: 1.35rem;
  }

  .verification-title {
    font-size: 1.85rem;
  }

  .verification-subtitle {
    font-size: 1rem;
  }

  .floating-guess-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}

/* ===== Mobile Extra Small (max 480px) ===== */
@media (max-width: 480px) {
  .game-screen {
    padding: 0.5rem 0.375rem;
    padding-bottom: 5.5rem;
  }

  .game-header {
    gap: 0.5rem;
    margin-bottom: 0.625rem;
  }

  .header-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0.875rem;
  }

  .stat-label,
  .stat-value {
    display: inline;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 800;
  }

  .give-up-button {
    padding: 0.675rem;
    font-size: 0.85rem;
  }

  .back-to-categories-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .back-button-icon {
    width: 22px;
    height: 22px;
  }

  .question-area {
    padding: 0.5rem 0.25rem;
  }

  .question-title-wrapper {
    gap: 0.625rem;
    margin-bottom: 1rem;
  }

  .question-icon-ring {
    width: 60px;
    height: 60px;
  }

  .question-icon {
    font-size: 1.75rem;
  }

  .questions-title {
    font-size: 1.2rem;
    padding: 0;
  }

  .options-grid-modern {
    gap: 0.75rem;
    padding: 0;
  }


  .option-text {
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .option-image {
    width: 100px;
    height: 100px;
  }

  .categories-grid {
    padding: 0.5rem 0.25rem;
  }

  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .categories-wrapper {
    gap: 0.75rem;
  }

  .category-card {
    min-height: 250px;
    border-radius: 24px;
  }

  .category-content-wrapper {
    padding: 1.5rem 1.25rem;
  }

  .category-title {
    font-size: 1.15rem;
  }

  .category-description {
    font-size: 0.85rem;
    line-height: 1.5;
  }



  .sidebar-content {
    padding: 1.5rem 1rem;
  }

  .sidebar-title {
    font-size: 1rem;
  }

  .sidebar-question,
  .sidebar-answer {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  .answer-icon-wrapper {
    width: 120px;
    height: 120px;
  }

  .answer-icon {
    width: 90px;
    height: 90px;
    font-size: 3rem;
  }

  .answer-title {
    font-size: 2rem;
  }

  .answer-text {
    font-size: 1.25rem;
  }

  .loader-card {
    padding: 1.75rem 1.25rem;
  }

  .loader-title {
    font-size: 1.25rem;
  }

  .loader-subtitle {
    font-size: 0.95rem;
  }

  .orb-wrapper-large {
    width: 100px;
    height: 100px;
  }

  .orb-large {
    width: 50px;
    height: 50px;
  }

  .orb-ring-large {
    width: 80px;
    height: 80px;
  }

  .verification-loader {
    padding: 2rem 1.25rem;
  }

  .verification-title {
    font-size: 1.65rem;
  }

  .verification-subtitle {
    font-size: 0.95rem;
  }

  .orb-wrapper-verification {
    width: 120px;
    height: 120px;
  }

  .orb-verification {
    width: 70px;
    height: 70px;
  }

  .orb-ring-verification {
    width: 100px;
    height: 100px;
  }

  .floating-guess-button {
    bottom: 1rem;
    right: 0.75rem;
    left: 0.75rem;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }



  .confirm-box {
    padding: 1.25rem;
  }

  .confirm-title {
    font-size: 1.15rem;
  }

  .confirm-text {
    font-size: 0.85rem;
  }

  .confirm-actions .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  .loader {
    width: 32px;
    height: 32px;
  }

  .loading-text {
    font-size: 0.8rem;
  }
}

/* ===== Mobile Tiny (max 360px) ===== */
@media (max-width: 360px) {
  .game-screen {
    padding: 0.375rem 0.25rem;
    padding-bottom: 5rem;
  }

  .game-header {
    gap: 0.375rem;
  }

  .stat-item {
    padding: 0.5rem 0.75rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 0.9rem;
  }

  .give-up-button {
    padding: 0.625rem;
    font-size: 0.8rem;
  }

  .question-icon-ring {
    width: 50px;
    height: 50px;
  }

  .question-icon {
    font-size: 1.5rem;
  }

  .questions-title {
    font-size: 1.1rem;
  }


  .option-text {
    font-size: 0.9rem;
  }

  .option-image {
    width: 90px;
    height: 90px;
  }

  .section-title {
    font-size: 1.15rem;
  }

  .category-card {
    min-height: 185px;
  }

  .category-title {
    font-size: 1.1rem;
  }

  .category-description {
    font-size: 0.8rem;
  }

  .answer-title {
    font-size: 1.85rem;
  }

  .answer-text {
    font-size: 1.15rem;
  }

  .verification-title {
    font-size: 1.5rem;
  }

  .floating-guess-button {
    padding: 0.675rem 0.875rem;
    font-size: 0.8rem;
  }
}

/* ===== Landscape Mode على الموبايل ===== */
@media (max-width: 960px) and (orientation: landscape) {
  .game-screen {
    padding: 0.5rem;
    padding-bottom: 4rem;
  }

  .game-header {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .header-stats {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 120px;
  }

  .question-area {
    padding: 0.75rem;
  }

  .options-grid-modern {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .categories-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  .question-title-wrapper {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .question-icon-ring {
    width: 60px;
    height: 60px;
  }

  .questions-title {
    font-size: 1.25rem;
  }
}

/* ===== تحسينات للـ Sidebar على الموبايل ===== */
@media (max-width: 768px) {
  .sidebar-backdrop {
    display: block;
  }

  .chat-sidebar {
    transform: translateX(-100%);
    z-index: 1001;
  }

  .chat-sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.3);
  }

  .sidebar-toggle {
    right: -40px;
    width: 40px;
    height: 40px;
  }

  .sidebar-toggle svg {
    width: 20px;
    height: 20px;
  }
}

/* ===== تحسينات للـ Used Badge ===== */
@media (max-width: 768px) {
  .used-checkmark {
    width: 70px;
    height: 70px;
  }

  .used-checkmark svg {
    width: 40px;
    height: 40px;
  }

  .used-label {
    font-size: 1.2rem;
  }

  .category-card{
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .used-checkmark {
    width: 60px;
    height: 60px;
  }

  .used-checkmark svg {
    width: 35px;
    height: 35px;
  }

  .used-label {
    font-size: 1.1rem;
  }
}

/* ===== Fix للـ Main Game Area ===== */
@media (max-width: 1200px) {
  .main-game-area.has-sidebar {
    margin-left: 0 !important;
    width: 100% !important;
  }

  .categories-grid.has-sidebar {
    margin-left: 0 !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}

/* ===== تحسين الأزرار في الـ Overlay ===== */
@media (max-width: 480px) {
  .result-button {
    padding: 1rem 2rem;
    font-size: 0.95rem;
  }

  .success-button,
  .fail-button {
    width: 100%;
    max-width: 280px;
  }
}

/* ===== تحسين Progress Bar ===== */
@media (max-width: 768px) {
  .loader-progress,
  .verification-progress {
    max-width: 100%;
    height: 6px;
  }
}

/* ===== تحسين الـ Particles ===== */
@media (max-width: 768px) {
  .particle,
  .particle-verification,
  .particle-xl {
    width: 6px;
    height: 6px;
  }
}

/* ===== تحسين Infinity Icon ===== */
@media (max-width: 768px) {
  .infinity-icon {
    width: 24px !important;
    height: 24px !important;
  }
}

@media (max-width: 480px) {
  .infinity-icon {
    width: 20px !important;
    height: 20px !important;
  }
}

@media (max-width: 768px) {
  .back-button-text {
    display: none;
  }

  .back-to-categories-button {
    padding: 0.4rem;
    border-radius: 12px;
  }
}
.limit-reached {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at top,
    rgba(255, 80, 80, 0.15),
    rgba(0, 0, 0, 0.65)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding:
    env(safe-area-inset-top)
    env(safe-area-inset-right)
    env(safe-area-inset-bottom)
    env(safe-area-inset-left);
  z-index: 999;
}



.limit-card {
  width: min(92%, 520px);
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  border-radius: 20px;
  padding: 28px;
  color: white;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.4),
    inset 0 0 0 1px rgba(255,255,255,0.15);
  display: grid;
  gap: 18px;
  animation: dropIn 0.35s ease-out;
}

.limit-icon {
  font-size: 48px;
  text-align: center;
  animation: pulse 1.4s infinite;
}

.limit-text h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
}

.limit-text p {
  margin: 0;
  font-size: 15px;
  opacity: 0.95;
  text-align: center;
}

.limit-action {
  margin-top: 6px;
  background: white;
  color: #ff4d4f;
  border: none;
  height: 44px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.limit-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

/* Animations */
@keyframes dropIn {
  from {
    transform: translateY(-20px) scale(0.96);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  70% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (max-width: 480px) {
  .limit-card {
    width: 92%;
    padding: 22px 18px;
    border-radius: 18px;
    gap: 14px;
  }

  .limit-icon {
    font-size: 40px;
  }

  .limit-text h2 {
    font-size: 18px;
    line-height: 1.25;
  }

  .limit-text p {
    font-size: 14px;
    line-height: 1.4;
  }

  .limit-action {
    height: 48px;             
    font-size: 16px;
  }
}

.option-image-box {
  width: 90px;
  aspect-ratio: 1 / 1;
  margin-inline: auto; /* توسيط */
}

/* Chat Sidebar Styles */


.chat-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-toggle {
  position: absolute;
  right: -48px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-left: none;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.3s ease;
  z-index: 101;
  overflow: visible;
}

/* 🎯 Hint Animations للـ Sidebar Toggle */
.sidebar-toggle::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 0 14px 14px 0;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  opacity: 0;
  filter: blur(8px);
  z-index: -1;
  animation: hintGlow 2s ease-in-out infinite;
}

.sidebar-toggle::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 0 12px 12px 0;
  border: 2px solid var(--accent-color);
  opacity: 0;
  animation: hintPulse 2s ease-in-out infinite;
}

/* 💫 Floating Hint Badge */
.sidebar-toggle-hint {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  animation: hintFloat 2s ease-in-out infinite;
  z-index: 102;
}

.sidebar-toggle-hint::before {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--primary-color);
}

/* 🌊 Wave Animation */
.sidebar-toggle-wave {
  position: absolute;
  inset: 0;
  border-radius: 0 12px 12px 0;
  border: 2px solid var(--accent-color);
  opacity: 0;
  animation: hintWave 2s ease-in-out infinite;
}

.sidebar-toggle-wave:nth-child(2) {
  animation-delay: 0.4s;
}

.sidebar-toggle-wave:nth-child(3) {
  animation-delay: 0.8s;
}

/* ✨ Sparkle Particles */
.sidebar-toggle-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent-color);
  border-radius: 50%;
  opacity: 0;
  animation: hintSparkle 2s ease-in-out infinite;
  animation-delay: calc(var(--sparkle-delay) * 0.2s);
}

.sidebar-toggle-sparkle:nth-child(1) {
  top: 10%;
  right: -20px;
  --sparkle-delay: 0;
}

.sidebar-toggle-sparkle:nth-child(2) {
  top: 30%;
  right: -25px;
  --sparkle-delay: 1;
}

.sidebar-toggle-sparkle:nth-child(3) {
  top: 50%;
  right: -30px;
  --sparkle-delay: 2;
}

.sidebar-toggle-sparkle:nth-child(4) {
  top: 70%;
  right: -25px;
  --sparkle-delay: 3;
}

.sidebar-toggle-sparkle:nth-child(5) {
  top: 90%;
  right: -20px;
  --sparkle-delay: 4;
}

/* 🎯 Animations Keyframes */
@keyframes hintGlow {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

@keyframes hintPulse {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

@keyframes hintFloat {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) translateX(-8px);
    opacity: 0.8;
  }
}

@keyframes hintWave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}

@keyframes hintSparkle {
  0%, 100% {
    opacity: 0;
    transform: translateX(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-15px) scale(1);
  }
}

/* 🎨 Hover State - إيقاف الـ Hints */
.sidebar-toggle:hover::before,
.sidebar-toggle:hover::after {
  animation: none;
  opacity: 0;
}

.sidebar-toggle:hover .sidebar-toggle-hint {
  animation: none;
  opacity: 0;
  transform: translateY(-50%) translateX(-10px);
}

.sidebar-toggle:hover .sidebar-toggle-wave {
  animation: none;
  opacity: 0;
}

.sidebar-toggle:hover .sidebar-toggle-sparkle {
  animation: none;
  opacity: 0;
}

/* Active State */
.sidebar-toggle:hover {
  background: var(--accent-color);
  color: white;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* عند فتح الـ Sidebar - إخفاء الـ Hints */
.chat-sidebar.sidebar-open .sidebar-toggle::before,
.chat-sidebar.sidebar-open .sidebar-toggle::after {
  animation: none;
  opacity: 0;
}

.chat-sidebar.sidebar-open .sidebar-toggle-hint {
  display: none;
}

.chat-sidebar.sidebar-open .sidebar-toggle-wave {
  animation: none;
  opacity: 0;
}

.chat-sidebar.sidebar-open .sidebar-toggle-sparkle {
  animation: none;
  opacity: 0;
}
@media (max-width: 768px) {
  .give-up-button {
    display: none;
  }

  .give-up-button-mobile {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.65rem;
    border-radius: 999px;
    background: rgba(255, 60, 60, 0.15);
    color: #ff4d4d;
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid rgba(255, 77, 77, 0.35);
    white-space: nowrap;
    margin-top: 10px;
  }

  .give-up-button-mobile svg {
    flex-shrink: 0;
  }
}
/* ============================
   🎮 LEVEL BADGE - MODERN DESIGN
   ============================*/

.level-badge-container {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.level-badge {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.95) 0%,
    rgba(168, 85, 247, 0.95) 50%,
    rgba(192, 132, 252, 0.95) 100%
  );
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(139, 92, 246, 0.4),
    0 4px 16px rgba(168, 85, 247, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: levelBadgeEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes levelBadgeEntrance {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.8) rotate(-5deg);
  }
  60% {
    transform: translateY(5px) scale(1.05) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* 🌟 Animated Glow */
.level-badge-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.6),
    rgba(168, 85, 247, 0.6),
    rgba(192, 132, 252, 0.6)
  );
  border-radius: 50px;
  filter: blur(16px);
  opacity: 0.7;
  animation: glowPulse 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
}

/* ✨ Floating Particles */
.level-badge-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 50px;
}

.level-badge-particles .particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent);
  border-radius: 50%;
  animation: particleFloat 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
  opacity: 0;
}

.level-badge-particles .particle:nth-child(1) { left: 10%; top: 20%; }
.level-badge-particles .particle:nth-child(2) { left: 30%; top: 70%; }
.level-badge-particles .particle:nth-child(3) { left: 50%; top: 30%; }
.level-badge-particles .particle:nth-child(4) { left: 70%; top: 60%; }
.level-badge-particles .particle:nth-child(5) { left: 85%; top: 25%; }
.level-badge-particles .particle:nth-child(6) { left: 20%; top: 80%; }

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translateY(-10px) scale(1);
  }
  80% {
    opacity: 1;
    transform: translateY(-40px) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0);
  }
}

/* 🏆 Icon Container */
.level-badge-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  animation: iconRotate 6s linear infinite;
  position: relative;
  z-index: 2;
}

.level-badge-icon svg {
  width: 20px;
  height: 20px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconRotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-5deg) scale(1.1);
  }
  50% {
    transform: rotate(0deg) scale(1);
  }
  75% {
    transform: rotate(5deg) scale(1.1);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* 📝 Content */
.level-badge-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  position: relative;
  z-index: 2;
}

.level-badge-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: labelFade 2s ease-in-out infinite;
}

@keyframes labelFade {
  0%, 100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}

.level-badge-name {
  font-size: 1.1rem;
  font-weight: 900;
  color: white;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
  animation: nameShine 4s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes nameShine {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

/* ✨ Shine Effect */
.level-badge-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  animation: shineSwipe 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shineSwipe {
  0%, 100% {
    left: -100%;
  }
  50% {
    left: 200%;
  }
}

/* 🎨 Hover Effect */
.level-badge:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.6),
    0 6px 20px rgba(168, 85, 247, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-badge:hover .level-badge-icon {
  transform: rotate(360deg) scale(1.2);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-badge:hover .level-badge-glow {
  opacity: 1;
  transform: scale(1.2);
}

/* 🎭 Entrance Animation */
.level-badge-appear-enter-active {
  animation: levelBadgeEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-badge-appear-leave-active {
  animation: levelBadgeExit 0.5s ease;
}

@keyframes levelBadgeExit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
}

/* 📱 Mobile Responsive */
@media (max-width: 768px) {
  .level-badge {
    padding: 0.625rem 1.25rem;
    gap: 0.75rem;
  }

  .level-badge-icon {
    width: 32px;
    height: 32px;
  }

  .level-badge-icon svg {
    width: 18px;
    height: 18px;
  }

  .level-badge-label {
    font-size: 0.65rem;
  }

  .level-badge-name {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .level-badge {
    padding: 0.5rem 1rem;
    gap: 0.625rem;
  }

  .level-badge-icon {
    width: 28px;
    height: 28px;
  }

  .level-badge-icon svg {
    width: 16px;
    height: 16px;
  }

  .level-badge-label {
    font-size: 0.6rem;
  }

  .level-badge-name {
    font-size: 0.9rem;
  }

  .level-badge-particles .particle {
    width: 4px;
    height: 4px;
  }
}
/* تحريك الأزرار لما الـ Sidebar يفتح */
.give-up-button,
.back-to-categories-button {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}




/* أو إذا بدك تستخدم transform بدل margin */
@media (min-width: 1201px) {
  .give-up-button.shifted-right,
  .back-to-categories-button.shifted-right {
    transform: translateX(350px);
  }
  
  /* عشان ما يتأثر الـ hover */
  .give-up-button.shifted-right:hover,
  .back-to-categories-button.shifted-right:hover {
    transform: translateX(350px) translateY(-2px) scale(1.05);
  }
}

/* 🟢 EASY - أخضر نعناعي جميل */
.level-badge.level-easy {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.95) 0%,
    rgba(5, 150, 105, 0.95) 50%,
    rgba(6, 182, 212, 0.95) 100%
  );
  border-color: rgba(167, 243, 208, 0.4);
  box-shadow:
    0 8px 32px rgba(16, 185, 129, 0.4),
    0 4px 16px rgba(5, 150, 105, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.level-badge.level-easy .level-badge-glow {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.6),
    rgba(5, 150, 105, 0.6),
    rgba(6, 182, 212, 0.6)
  );
}

.level-badge.level-easy:hover {
  box-shadow:
    0 12px 40px rgba(16, 185, 129, 0.6),
    0 6px 20px rgba(5, 150, 105, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

/* 🟠 MEDIUM - برتقالي ذهبي */
.level-badge.level-medium {
  background: linear-gradient(
    135deg,
    rgba(251, 146, 60, 0.95) 0%,
    rgba(249, 115, 22, 0.95) 50%,
    rgba(245, 158, 11, 0.95) 100%
  );
  border-color: rgba(253, 224, 71, 0.4);
  box-shadow:
    0 8px 32px rgba(251, 146, 60, 0.4),
    0 4px 16px rgba(249, 115, 22, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.level-badge.level-medium .level-badge-glow {
  background: linear-gradient(
    135deg,
    rgba(251, 146, 60, 0.6),
    rgba(249, 115, 22, 0.6),
    rgba(245, 158, 11, 0.6)
  );
}

.level-badge.level-medium:hover {
  box-shadow:
    0 12px 40px rgba(251, 146, 60, 0.6),
    0 6px 20px rgba(249, 115, 22, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.level-badge.level-hard {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.95) 0%,
    rgba(220, 38, 38, 0.95) 50%,
    rgba(248, 113, 113, 0.95) 100%
  );
  border-color: rgba(254, 202, 202, 0.4);
  box-shadow:
    0 8px 32px rgba(239, 68, 68, 0.4),
    0 4px 16px rgba(220, 38, 38, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.level-badge.level-hard .level-badge-glow {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.6),
    rgba(220, 38, 38, 0.6),
    rgba(248, 113, 113, 0.6)
  );
}

.level-badge.level-hard:hover {
  box-shadow:
    0 12px 40px rgba(239, 68, 68, 0.6),
    0 6px 20px rgba(220, 38, 38, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.level-badge:not(.level-easy):not(.level-medium):not(.level-hard) {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.95) 0%,
    rgba(168, 85, 247, 0.95) 50%,
    rgba(192, 132, 252, 0.95) 100%
  );
}

/* ===============================
   MODERN OPTION CARD DESIGN
   =============================== */

/* Card Inner Structure */
.option-card-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  overflow: hidden;
}

/* Image Container - Top Section */
.option-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.05) 0%,
    rgba(168, 85, 247, 0.08) 50%,
    rgba(192, 132, 252, 0.05) 100%
  );
}

.option-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Glowing Effect Behind Image */
.option-image-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(139, 92, 246, 0.15) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.option-card:hover:not(.disabled) .option-image-glow {
  opacity: 1;
}

/* Image Styling */
.option-image {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  z-index: 2;
  transform: scale(1);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.option-card:hover:not(.disabled) .option-image {
  transform: scale(1.08) translateY(-4px);
  filter: drop-shadow(0 12px 24px rgba(139, 92, 246, 0.3));
}

/* Content Section - Bottom */
.option-content {
  position: relative;
  padding: 1.5rem 1.25rem;
  background: var(--card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-height: 80px;
  justify-content: center;
}

.option-text {
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  color: var(--text-color);
  line-height: 1.4;
  z-index: 2;
  transition: all 0.3s ease;
  margin: 0;
}

.option-card:hover:not(.disabled) .option-text {
  color: var(--accent-color);
  transform: translateY(-2px);
}

/* Accent Line Under Text */
.option-accent-line {
  width: 40px;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent-color),
    transparent
  );
  border-radius: 2px;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.4s ease;
}

.option-card:hover:not(.disabled) .option-accent-line {
  opacity: 1;
  transform: scaleX(1);
}

/* Border Glow Effect */
.option-border-glow {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.5),
    rgba(168, 85, 247, 0.5),
    rgba(192, 132, 252, 0.5)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.option-card:hover:not(.disabled) .option-border-glow {
  opacity: 1;
}

/* Responsive Design */
@media (min-width: 1600px) {
  .option-image-container {
    height: 220px;
  }

  .option-content {
    padding: 1.75rem 1.5rem;
    min-height: 90px;
  }

  .option-text {
    font-size: 1.15rem;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .option-image-container {
    height: 200px;
  }

  .option-content {
    padding: 1.5rem 1.25rem;
    min-height: 85px;
  }

  .option-text {
    font-size: 1.1rem;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .option-image-container {
    height: 180px;
  }

  .option-content {
    padding: 1.25rem 1rem;
    min-height: 75px;
  }

  .option-text {
    font-size: 1.05rem;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .option-image-container {
    height: 170px;
  }

  .option-content {
    padding: 1.25rem 1rem;
    min-height: 70px;
  }

  .option-text {
    font-size: 1rem;
  }
}

@media (max-width: 767px) {
  .option-image-container {
    height: 160px;
  }

  .option-image-wrapper {
    padding: 1rem;
  }

  .option-content {
    padding: 1.125rem 0.875rem;
    min-height: 65px;
  }

  .option-text {
    font-size: 0.95rem;
  }

  .option-card:hover:not(.disabled) .option-image {
    transform: scale(1.05) translateY(-2px);
  }
}

@media (max-width: 480px) {
  .option-image-container {
    height: 140px;
  }

  .option-content {
    padding: 1rem 0.75rem;
    min-height: 60px;
  }

  .option-text {
    font-size: 0.9rem;
  }
}

</style>
