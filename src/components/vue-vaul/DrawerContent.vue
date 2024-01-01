<script setup lang="ts">
import { computed, useAttrs } from 'vue'
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
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="drawer.isOpen ? 'true' : 'false'"
    ref="drawerRef"
    :style="[attrs.style, { '--snap-point-height': snapPointHeight }]"
    @pointerdown="drawer.handlePointerDown"
    @pointermove="drawer.handlePointerMove"
    @pointerup="drawer.handlePointerUp"
  >
    <slot />
  </DialogContent>
</template>
