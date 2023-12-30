<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { useInjectDrawer } from './'

const drawer = useInjectDrawer()
</script>

<template>
  <DialogOverlay
    vaul-overlay=""
    :vaul-drawer-visible="drawer?.isOpen ? 'true' : 'false'"
  >
    <slot />
  </DialogOverlay>
</template>
