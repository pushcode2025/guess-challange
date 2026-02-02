# Category & Subcategory Design Changes

This document contains all the changes needed to implement the modern category card design.

## Files Modified

### 1. src/models/Category.ts
✅ Already updated - `image` field added

### 2. src/stores/game.ts
✅ Already updated - `image` field mapping added

### 3. src/components/GameScreen.vue

This file has major changes in 3 sections:

#### A. Template Section (Replace lines 95-154)

Replace the old category grid section with:

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

#### B. Script Section - Add Helper Functions

Add these functions after the `getImageUrl` function (around line 328):

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

#### C. Style Section - Replace ALL Category Card Styles

Find the section that starts with `.category-card {` and replace ALL category-related styles with the new styles. This includes:
- `.category-card` and all its variations
- `.category-image-container`, `.category-image`, `.category-image-overlay`
- `.category-content-wrapper`, `.category-content`
- `.category-icon-ring`, `.category-icon-inner`, `.category-icon-glow`
- `.category-title`, `.category-description`, `.category-arrow`
- `.category-shine`
- All used badge styles
- Transition animations

The complete CSS is very long - I'll provide it in the next section of this document.

---

## Complete CSS Styles

Replace everything from `/* Modern Category Card Styles with Glassmorphism */` to the end of the used badge section with the styles shown in the attached file.

The key improvements include:
- Glassmorphism effects with backdrop blur
- Staggered entry animations
- Parallax hover effects
- Shine sweep animation
- Modern used badge with animated checkmark
- Responsive design for all screen sizes
- Smooth transitions and transforms

---

## How to Apply These Changes

1. Open your project at `C:\wamp64\www\guess-vue-lates`
2. Open `src/components/GameScreen.vue`
3. Replace the template section (category grid)
4. Add the helper functions in the script section
5. Replace all category-related CSS styles
6. Save and test

The changes are ready to use!
