import { create, all } from 'mathjs'

const D2R = Math.PI / 180

export const mathRad = create(all)

export const mathDeg = create(all, {})
mathDeg.import(
  {
    sin: (x) => Math.sin(Number(x) * D2R),
    cos: (x) => Math.cos(Number(x) * D2R),
    tan: (x) => Math.tan(Number(x) * D2R),
    asin: (x) => (Math.asin(Number(x)) / D2R),
    acos: (x) => (Math.acos(Number(x)) / D2R),
    atan: (x) => (Math.atan(Number(x)) / D2R)
  },
  { override: true }
)

export const PRETTY_MAP = [
  { from: 'asin(', to: 'sin⁻¹(' },
  { from: 'acos(', to: 'cos⁻¹(' },
  { from: 'atan(', to: 'tan⁻¹(' },
  { from: 'log10(', to: 'log(' },
  { from: 'log(', to: 'ln(' },
  { from: 'exp(', to: 'e^(' },
  { from: 'sqrt(', to: '√(' },
  { from: 'cbrt(', to: '∛(' },
  { from: 'pi', to: 'π' },
  { from: '*', to: '×' },
  { from: '/', to: '÷' },
  { from: '-', to: '−' }
]

export function prettify(source) {
  const pattern = new RegExp(
    'asin\\(|acos\\(|atan\\(|log10\\(|log\\(|exp\\(|sqrt\\(|cbrt\\(|\\bpi\\b|\\*|\\/|\\-',
    'g'
  )
  return source.replace(pattern, (token) => {
    const match = PRETTY_MAP.find((entry) => token.startsWith(entry.from))
    return match ? match.to : token
  })
}

export function formatNumber(num) {
  if (typeof num !== 'number' || Number.isNaN(num)) return null
  if (!Number.isFinite(num)) return null
  if (Object.is(num, -0)) num = 0
  if (Math.abs(num) >= 1e15 || (num !== 0 && Math.abs(num) < 1e-9)) {
    return num
      .toExponential(8)
      .replace(/(\.\d*?)0+e/, '$1e')
      .replace(/\.e/, 'e')
  }
  const rounded = Number(num.toPrecision(12))
  return String(rounded)
}

function stripTrailingOperators(source) {
  let out = source
  while (/[+*/^(\-]$/.test(out)) out = out.slice(0, -1)
  return out
}

function closeParens(source) {
  let open = 0
  let closed = 0
  for (const ch of source) {
    if (ch === '(') open++
    else if (ch === ')') closed++
  }
  return open > closed ? source + ')'.repeat(open - closed) : source
}

export function normalizeSource(source) {
  let out = closeParens(stripTrailingOperators(source.trim()))
  out = out.replace(/%/g, '/100')
  return out
}

export function compute(source, options = {}) {
  const normalized = normalizeSource(source)
  if (!normalized) return { ok: false, value: null, normalized: '' }
  const engine = options.math || mathDeg
  try {
    const value = options.scope
      ? engine.evaluate(normalized, options.scope)
      : engine.evaluate(normalized)
    const formatted = formatNumber(value)
    if (formatted === null) return { ok: false, value, normalized }
    return { ok: true, value, formatted, normalized }
  } catch (err) {
    return { ok: false, value: null, normalized }
  }
}

export function derivativeOf(expression, variable = 'x') {
  const node = mathRad.derivative(expression, variable)
  return node.toString({ implicit: 'hide' })
}

export function evaluateInRadians(expression, scope) {
  return mathRad.evaluate(expression, scope)
}

export function integrate(f, a, b, n = 1000) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Invalid bounds')
  }
  if (a === b) return 0
  if (n % 2 !== 0) n += 1
  const h = (b - a) / n
  let sum = f(a) + f(b)
  for (let i = 1; i < n; i++) {
    const x = a + i * h
    sum += (i % 2 === 1 ? 4 : 2) * f(x)
  }
  return (h / 3) * sum
}