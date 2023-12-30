<script setup lang="ts">
import { DialogContent } from 'radix-vue'
import { useInjectDrawer } from './'

const drawer = useInjectDrawer()
</script>

<template>
  <DialogContent
    vaul-drawer=""
    :vaul-drawer-visible="drawer.isOpen ? 'true' : 'false'"
  >
    <slot />
  </DialogContent>
</template>
