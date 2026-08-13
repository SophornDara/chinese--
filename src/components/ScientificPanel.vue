<script setup>
defineProps({
  angleMode: { type: String, default: 'deg' }
})

const emit = defineEmits(['press', 'toggle-angle'])

const base =
  'select-none rounded-xl px-1 py-2 text-sm font-semibold transition duration-75 active:scale-[0.96] focus:outline-none'

const fnCls =
  'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'

const buttons = [
  { key: 'sin', label: 'sin' },
  { key: 'cos', label: 'cos' },
  { key: 'tan', label: 'tan' },
  { key: 'pi', label: 'π' },
  { key: 'e', label: 'e' },
  { key: 'asin', label: 'sin⁻¹' },
  { key: 'acos', label: 'cos⁻¹' },
  { key: 'atan', label: 'tan⁻¹' },
  { key: 'factorial', label: 'n!' },
  { key: 'ln', label: 'ln' },
  { key: 'log', label: 'log' },
  { key: 'exp', label: 'eˣ' },
  { key: 'pow10', label: '10ˣ' },
  { key: 'pow2', label: 'x²' },
  { key: 'pow3', label: 'x³' },
  { key: 'power', label: 'xʸ' },
  { key: 'sqrt', label: '√x' },
  { key: 'cbrt', label: '∛x' }
]
</script>

<template>
  <div class="mb-4 w-full space-y-2">
    <div class="grid grid-cols-4 gap-2 sm:grid-cols-5">
      <button
        v-for="btn in buttons"
        :key="btn.key"
        type="button"
        class="flex items-center justify-center"
        :class="[base, fnCls]"
        @click="emit('press', btn.key)"
      >
        {{ btn.label }}
      </button>
    </div>
    <button
      type="button"
      class="flex w-full items-center justify-center rounded-xl py-2 text-sm font-bold uppercase tracking-wide transition duration-75 active:scale-[0.98]"
      :class="angleMode === 'deg'
        ? 'bg-emerald-500 text-white hover:bg-emerald-400'
        : 'bg-amber-500 text-white hover:bg-amber-400'"
      @click="emit('toggle-angle')"
    >
      {{ angleMode === 'deg' ? 'Degrees' : 'Radians' }}
    </button>
  </div>
</template>