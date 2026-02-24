declare module 'vue-virtual-scroller' {
  import type { DefineComponent } from 'vue'

  export const RecycleScroller: DefineComponent<{
    items: unknown[]
    itemSize: number
    keyField?: string
    direction?: 'vertical' | 'horizontal'
    [key: string]: unknown
  }>

  export const DynamicScroller: DefineComponent<{
    items: unknown[]
    minItemSize: number
    keyField?: string
    [key: string]: unknown
  }>

  export const DynamicScrollerItem: DefineComponent<{
    item: unknown
    active: boolean
    sizeDependencies?: unknown[]
    [key: string]: unknown
  }>
}
