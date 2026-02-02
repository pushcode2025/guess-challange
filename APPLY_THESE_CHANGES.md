# Complete Category Design Changes - Copy These to Your Project

## Location: `C:\wamp64\www\guess-vue-lates\src\components\GameScreen.vue`

---

## STEP 1: Find and Replace the Category Template (around lines 95-130)

Find this old section:
```vue
<div v-if="showCategories" class="categories-grid"...
```

Replace the ENTIRE category grid section with:

```vue
<!-- 🔹 عرض الكاتيجوري أولاً -->
<div v-if="showCategories" class="categories-grid" :class="{ 'has-sidebar': state.conversation.length > 0 && !isLoadingQuestions }">
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
        <div class="category-image" :style="{
          backgroundImage: `url(${category.image || getCategoryPlaceholderImage(index)})`
        }">
          <div class="category-image-overlay"></div>
        </div>
      </div>

      <!-- Glassmorphic Content Container -->
      <div class="category-content-wrapper">
        <div class="category-content">
          <div class="category-icon-ring">
            <div class="category-icon-inner">
              {{ getCategoryIcon(index) }}
            </div>
            <div class="category-icon-glow"></div>
          </div>
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
```

---

## STEP 2: Add Helper Functions in Script Section

Find the `getImageUrl` function (around line 325), and add these TWO new functions right after it:

```typescript
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

const getCategoryIcon = (index: number) => {
  const icons = ['🎯', '🎮', '🏆', '⚡', '🌟', '🎨', '🚀', '💎', '🎪', '🎭'];
  return icons[index % icons.length];
};
```

---

## STEP 3: Replace Category CSS Styles

This is the biggest change. In the `<style>` section, find ALL these class names and REPLACE them with the new styles below:

**Classes to find and replace:**
- `.category-card`
- `.category-image`
- `.category-overlay` or `.category-image-overlay`
- `.category-content`
- `.category-icon-wrapper` or similar
- `.category-name` or `.category-title`
- `.category-desc` or `.category-description`
- `.used-badge` or `.category-used-badge`
- Any related animations

**Replace with this complete CSS (copy ALL of it):**

```css
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

.category-card:hover::before {
  opacity: 1;
}

.category-image-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: 28px;
}

.category-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1.1);
}

.category-card:hover .category-image {
  transform: scale(1.25) rotate(2deg);
}

.category-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 212, 255, 0.4) 50%,
    rgba(248, 201, 0, 0.4) 100%
  );
  transition: all 0.5s ease;
  backdrop-filter: blur(0px);
}

.category-card:hover .category-image-overlay {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 212, 255, 0.5) 50%,
    rgba(248, 201, 0, 0.5) 100%
  );
  backdrop-filter: blur(2px);
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

/* Transition Animations */
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

/* Mobile Responsive */
@media (max-width: 768px) {
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
```

---

## Summary

After making these 3 changes:
1. ✅ Updated template with new HTML structure
2. ✅ Added helper functions for images and icons
3. ✅ Replaced all CSS styles with modern design

Your category cards will have:
- Modern glassmorphism design
- Smooth animations and transitions
- Beautiful hover effects
- Responsive design for all devices
- Professional look with stock images

Save the file and test your application!
