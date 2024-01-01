<script setup lang="ts">
import { DialogTrigger } from 'radix-vue'
</script>

<template>
  <DialogTrigger>
    <slot>
      Trigger
    </slot>
  </DialogTrigger>
</template>
