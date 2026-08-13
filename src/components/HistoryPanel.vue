<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['reuse', 'clear'])
</script>

<template>
  <aside class="flex h-full w-full flex-col rounded-2xl bg-white p-4 shadow-lg dark:bg-slate-800 md:shadow-none md:ring-1 md:ring-slate-200 dark:md:ring-slate-700">
    <header class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        History
      </h2>
      <button
        v-if="items.length"
        type="button"
        class="rounded-md px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
        @click="emit('clear')"
      >
        Clear
      </button>
    </header>

    <p
      v-if="!items.length"
      class="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500"
    >
      No calculations yet.
      <br />
      Results will appear here.
    </p>

    <ul v-else class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="group w-full rounded-xl bg-slate-50 px-3 py-2 text-left transition hover:bg-indigo-50 active:scale-[0.98] dark:bg-slate-700/60 dark:hover:bg-indigo-500/10"
          @click="emit('reuse', item)"
        >
          <span class="block truncate font-mono text-xs text-slate-500 dark:text-slate-400">
            {{ item.expr }}
          </span>
          <span class="block truncate font-mono text-base font-semibold tabular-nums text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            = {{ item.result }}
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>