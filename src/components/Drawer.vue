<script setup lang="ts">
import DrawerRoot from './vue-vaul/DrawerRoot.vue'
import DrawerTrigger from './vue-vaul/DrawerTrigger.vue'
import DrawerOverlay from './vue-vaul/DrawerOverlay.vue'
import DrawerContent from './vue-vaul/DrawerContent.vue'
import DrawerPortal from './vue-vaul/DrawerPortal.vue'
import { DialogTitle } from 'radix-vue'
</script>

<template>
  <!-- <DrawerRoot> -->
  <DrawerRoot :snap-points="[0.25, 1]" should-scale-background>
    <DrawerTrigger />
    <DrawerPortal>
      <DrawerOverlay class="fixed bg-black/40 inset-0" />
      <DrawerContent class="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 vaul-dragging p-4">
        <DialogTitle class="text-xl font-bold">Drawer</DialogTitle>
        <div class="mt-4">
          <p class="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
