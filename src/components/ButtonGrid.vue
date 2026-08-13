<script setup>
const emit = defineEmits(['press'])

const base =
  'select-none rounded-xl text-base font-semibold transition duration-75 active:scale-[0.96] focus:outline-none'

const memoryBtns = [
  { key: 'mc', label: 'MC' },
  { key: 'mr', label: 'MR' },
  { key: 'm+', label: 'M+' },
  { key: 'm-', label: 'M−' }
]

const buttons = [
  { key: 'ac', label: 'AC', cls: 'bg-rose-500 text-white hover:bg-rose-400' },
  { key: 'ce', label: 'CE', cls: 'bg-rose-400 text-white hover:bg-rose-300' },
  { key: 'back', label: '⌫', cls: 'bg-slate-300 text-slate-800 hover:bg-slate-200 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500' },
  { key: 'div', label: '÷', cls: 'bg-violet-500 text-white hover:bg-violet-400' },
  { key: 'paren-l', label: '(', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'paren-r', label: ')', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'percent', label: '%', cls: 'bg-violet-500 text-white hover:bg-violet-400' },
  { key: 'mul', label: '×', cls: 'bg-violet-500 text-white hover:bg-violet-400' },
  { key: '7', label: '7', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '8', label: '8', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '9', label: '9', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'sub', label: '−', cls: 'bg-violet-500 text-white hover:bg-violet-400' },
  { key: '4', label: '4', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '5', label: '5', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '6', label: '6', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'add', label: '+', cls: 'bg-violet-500 text-white hover:bg-violet-400' },
  { key: '1', label: '1', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '2', label: '2', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: '3', label: '3', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'equals', label: '=', cls: 'bg-indigo-600 text-white hover:bg-indigo-500' },
  { key: '0', label: '0', span: 'col-span-2', cls: 'flex justify-center bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'dot', label: '.', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' },
  { key: 'neg', label: '±', cls: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' }
]
</script>

<template>
  <div class="w-full">
    <div class="mb-2 grid grid-cols-4 gap-2">
      <button
        v-for="btn in memoryBtns"
        :key="btn.key"
        type="button"
        class="select-none rounded-lg bg-slate-200 px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-300 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        @click="emit('press', btn.key)"
      >
        {{ btn.label }}
      </button>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="btn in buttons"
        :key="btn.key"
        type="button"
        class="flex h-14 items-center rounded-xl py-2"
        :class="[base, btn.cls, btn.span || 'justify-center']"
        @click="emit('press', btn.key)"
      >
        {{ btn.label }}
      </button>
    </div>
  </div>
</template>