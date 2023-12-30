<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import { DialogContent } from 'radix-vue'
import { useInjectDrawer } from './'

const { drawerRef, ...drawer } = useInjectDrawer()

// console.log('hello')
// watchEffect(() => {
//   console.log('watchEffect')
//   drawer.isVisible.value = true
// })
// onMounted(() => {
//   console.log('onMounted')
//   drawer.isVisible.value = true
// })
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="drawer.isOpen ? 'true' : 'false'"
    ref="drawerRef"
    @pointerdown="drawer.handlePointerDown"
    @pointermove="drawer.handlePointerMove"
    @pointerup="drawer.handlePointerUp"
  >
    <slot />
  </DialogContent>
</template>
