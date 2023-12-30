<script setup lang="ts">
import { DialogTrigger } from 'radix-vue'
import { useInjectDrawer } from './'

const drawer = useInjectDrawer()
</script>

<template>
  <DialogTrigger>
    <slot>
      Click me I'm {{ drawer.isOpen.value ? 'open' : 'closed' }}
    </slot>
  </DialogTrigger>
</template>
