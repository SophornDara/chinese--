<script setup>
import { ref, reactive } from 'vue'
import {
  mathRad,
  derivativeOf,
  integrate,
  evaluateInRadians,
  formatNumber,
  prettify
} from '../lib/calc.js'

const mode = ref('derivative')
const inputStyle =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20'

const derivative = reactive({
  expr: 'x^2 + sin(x)',
  at: '',
  steps: '',
  error: ''
})

const integral = reactive({
  expr: '',
  a: '',
  b: '',
  steps: '',
  error: ''
})

function parseFn(expr) {
  if (!expr || !/x/.test(expr)) throw new Error('Please enter a function of x')
  const compiled = mathRad.compile(expr)
  return (value) => compiled.evaluate({ x: value })
}

function computeDerivative() {
  derivative.steps = ''
  derivative.error = ''
  try {
    const deriv = derivativeOf(derivative.expr)
    let output = `d/dx ${prettify(derivative.expr)} = ${deriv}`
    if (derivative.at.trim() !== '') {
      const point = Number(derivative.at)
      if (!Number.isFinite(point)) throw new Error('Invalid evaluation point')
      const value = evaluateInRadians(deriv, { x: point })
      const formatted = formatNumber(value)
      if (formatted === null) throw new Error('Derivative is not finite at this point')
      output += `\nAt x = ${point}: f′(x) = ${formatted}`
    }
    derivative.steps = output
  } catch (err) {
    derivative.error = err.message || 'Invalid expression'
  }
}

function computeIntegral() {
  integral.steps = ''
  integral.error = ''
  try {
    const a = Number(integral.a)
    const b = Number(integral.b)
    if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Enter valid bounds a and b')
    const fn = parseFn(integral.expr)
    const n = 2000
    const result = integrate(fn, a, b, n)
    const formatted = formatNumber(result)
    if (formatted === null) throw new Error('Integral is not finite (check for singularities)')
    const h = (Math.abs(b - a) / n).toPrecision(4)
    integral.steps = `∫ₐᵇ f(x) dx ≈ ${formatted}\nSimpson's rule with N = ${n} subintervals, step h = ${h}`
  } catch (err) {
    integral.error = err.message || 'Invalid expression'
  }
}
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex gap-2">
      <button
        type="button"
        class="flex-1 rounded-xl py-2 text-sm font-semibold transition active:scale-[0.98]"
        :class="mode === 'derivative'
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
        @click="mode = 'derivative'"
      >
        Derivative
      </button>
      <button
        type="button"
        class="flex-1 rounded-xl py-2 text-sm font-semibold transition active:scale-[0.98]"
        :class="mode === 'integral'
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
        @click="mode = 'integral'"
      >
        Integral
      </button>
    </div>

    <form v-if="mode === 'derivative'" class="space-y-3" @submit.prevent="computeDerivative">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          f(x)
        </label>
        <input v-model="derivative.expr" type="text" class="w-full" :class="inputStyle" placeholder="e.g. x^2 + sin(x)" />
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Evaluate at x = (optional)
        </label>
        <input v-model="derivative.at" type="text" inputmode="decimal" class="w-full" :class="inputStyle" placeholder="e.g. 2" />
      </div>
      <button
        type="submit"
        class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
      >
        Differentiate
      </button>
      <p v-if="derivative.error" class="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
        {{ derivative.error }}
      </p>
      <pre
        v-if="derivative.steps"
        class="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-100 p-3 font-mono text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      >{{ derivative.steps }}</pre>
    </form>

    <form v-else class="space-y-3" @submit.prevent="computeIntegral">
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          f(x)
        </label>
        <input v-model="integral.expr" type="text" class="w-full" :class="inputStyle" placeholder="e.g. x^2 + sin(x)" />
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Bounds a and b
        </label>
        <div class="flex gap-2">
          <div class="flex items-center gap-2">
            <span class="font-mono text-slate-500 dark:text-slate-400">a =</span>
            <input v-model="integral.a" type="text" inputmode="decimal" class="w-24" :class="inputStyle" placeholder="0" />
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-slate-500 dark:text-slate-400">b =</span>
            <input v-model="integral.b" type="text" inputmode="decimal" class="w-24" :class="inputStyle" placeholder="3" />
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
      >
        Integrate
      </button>
      <p v-if="integral.error" class="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
        {{ integral.error }}
      </p>
      <pre
        v-if="integral.steps"
        class="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-100 p-3 font-mono text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      >{{ integral.steps }}</pre>
    </form>
  </div>
</template>