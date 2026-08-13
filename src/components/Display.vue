<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  expression: { type: String, default: '' },
  result: { type: String, default: '' },
  error: { type: Boolean, default: false },
  evaluated: { type: Boolean, default: false },
  memory: { type: Boolean, default: false }
})

const exprEl = ref(null)

watch(
  () => props.expression,
  async () => {
    await nextTick()
    if (exprEl.value) exprEl.value.scrollLeft = exprEl.value.scrollWidth
  }
)
</script>

<template>
  <div
    class="mb-3 w-full rounded-2xl bg-slate-100 px-4 py-3 font-mono dark:bg-slate-900/70 sm:px-5 sm:py-4"
  >
    <div class="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <span class="uppercase tracking-wider">Expression</span>
      <span
        v-if="memory"
        class="rounded bg-indigo-100 px-1.5 py-0.5 font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300"
      >
        M
      </span>
    </div>
    <div
      ref="exprEl"
      class="flex max-w-full items-center overflow-x-auto whitespace-nowrap pb-0.5 text-right text-lg text-slate-700 dark:text-slate-300 sm:text-xl"
      :class="expression === '' && 'text-slate-400 dark:text-slate-500'"
    >
      <span class="ml-auto">{{ expression || '0' }}</span>
    </div>
    <div class="mt-1 min-h-[2.25rem]">
      <div
        class="flex max-w-full items-center justify-end overflow-x-auto whitespace-nowrap text-2xl font-semibold tabular-nums sm:text-3xl"
        :class="error ? 'text-rose-500' : evaluated ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'"
      >
        <span class="ml-auto">{{ result }}</span>
      </div>
    </div>
  </div>
</template>