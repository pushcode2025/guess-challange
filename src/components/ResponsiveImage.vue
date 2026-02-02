<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  src: string | null
  alt?: string
  quality?: number
  fit?: 'cover' | 'contain' | 'fill'
}>()

const imageRef = ref<HTMLElement | null>(null)
const width = ref<number | null>(null)
const height = ref<number | null>(null)

let observer: ResizeObserver | null = null
let timeout: number | null = null

onMounted(() => {
  observer = new ResizeObserver(entries => {
    const rect = entries[0].contentRect

    if (timeout) clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      width.value = Math.round(rect.width)
      height.value = Math.round(rect.height)
    }, 120)
  })

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <div ref="imageRef" class="responsive-image-wrapper">
    <img
      v-if="src && width"
      class="responsive-image"
      :src="$image(src, {
        width,
        height,
        quality: quality ?? 80,
        fit: fit ?? 'cover'
      })"
      :alt="alt ?? ''"
    />
  </div>
</template>

<style scoped>
.responsive-image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
