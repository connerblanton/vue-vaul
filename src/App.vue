<script setup lang="ts">
import Drawer from './components/Drawer.vue';
// import { ref } from 'vue'

// const top = ref(0)
// const isDragging = ref(false)
// const mouseStart = ref({ x: 0, y: 0 })

// const startDrag = (e: MouseEvent) => {
//   isDragging.value = true
//   mouseStart.value = { x: e.clientX, y: e.clientY }
// }

// const stopDrag = () => {
//   isDragging.value = false
// }

// const drag = (e: MouseEvent) => {
//   if (isDragging.value) {
//     top.value = top.value + e.clientY - mouseStart.value.y
//     mouseStart.value = { x: e.clientX, y: e.clientY }
//   }
// }
</script>

<template>
  <!-- <div
    id="vue-vaul"
    :style="{ top: top + 'px' }"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @mousemove="drag"
  >
    <slot></slot>
  </div> -->
  <Drawer />
</template>

<style scoped>
  #vue-vaul {
    position: absolute;
    width: 300px;
    height: 300px;
    background-color: #f5f5f5;
  }
</style>
