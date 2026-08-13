<script setup>
defineProps({
  adult: { type: String, default: '' },
  success: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'subscribe'])
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" @click.self="emit('close')">
    <div class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <template v-if="success">
        <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-9 w-9">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-center text-xl font-bold text-slate-900 dark:text-white">Congratulations!</h2>
        <p class="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          You have successfully become a member! Dark mode is now unlocked for you.
        </p>
        <button
          type="button"
          class="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
          @click="emit('close')"
        >
          Enjoy Dark Mode
        </button>
      </template>

      <template v-else>
        <div class="mb-2 flex items-start justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>

        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Unlock Dark Mode</h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Become a premium member and enjoy the full dark mode experience.
        </p>

        <div class="mt-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-center text-white">
          <p class="text-xs font-semibold uppercase tracking-wider text-indigo-100">Premium</p>
          <p class="mt-1">
            <span class="text-4xl font-extrabold">$99.99</span>
            <span class="text-sm font-medium text-indigo-100">/month</span>
          </p>
          <p class="mt-1 text-xs text-indigo-100">Cancel anytime (not really)</p>
        </div>

        <ul class="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Full dark mode
          </li>
          <li class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Eyeballs saved from glare
          </li>
          <li class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 text-emerald-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            No real payment required
          </li>
        </ul>

        <button
          type="button"
          class="mt-6 w-full rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
          @click="emit('subscribe')"
        >
          Subscribe for {{ adult }}
        </button>
      </template>
    </div>
  </div>
</template>