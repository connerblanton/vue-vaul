<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue'
import { DialogContent } from 'radix-vue'
import { useInjectDrawer } from './'

const { drawerRef, ...drawer } = useInjectDrawer()

const attrs = useAttrs()

const snapPointHeight = computed(() => {
  if (drawer.snapPointsOffset.value && drawer.snapPointsOffset.value.length > 0) {
    return `${drawer.snapPointsOffset.value[0]}px`
  }
  return '0'
})

watch(() => drawer.isOpen.value, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      drawer.isVisible.value = true
    }, 100)
  }
})
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="drawer.isVisible.value ? 'true' : 'false'"
    ref="drawerRef"
    :style="[attrs.style, { '--snap-point-height': snapPointHeight }]"
    @pointerdown="drawer.handlePointerDown"
    @pointermove="drawer.handlePointerMove"
    @pointerup="drawer.handlePointerUp"
  >
    <slot />
  </DialogContent>
</template>
