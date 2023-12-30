import { ref, provide, inject } from 'vue'
import type { Ref } from 'vue'
export type Drawer = {
  isOpen: Ref<boolean>
}

const isOpen = ref(false)

export function useProvideDrawer () {
  provide<Drawer>('drawer', {
    isOpen,
  })

  return {
    isOpen,
  }
}

export function useInjectDrawer () {
  const drawer = inject<Drawer>('drawer')

  if (!drawer) {
    throw new Error('useInjectDrawer() is called without provider.')
  }

  return drawer
}
