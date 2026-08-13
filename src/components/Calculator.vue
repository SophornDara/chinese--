<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Display from "./Display.vue";
import ButtonGrid from "./ButtonGrid.vue";
import ScientificPanel from "./ScientificPanel.vue";
import CalculusPanel from "./CalculusPanel.vue";
import HistoryPanel from "./HistoryPanel.vue";
import SubscribeModal from "./SubscribeModal.vue";
import { compute, prettify, mathDeg, mathRad } from "../lib/calc.js";
import { Analytics } from "@vercel/analytics/next";
const expression = ref("");
const justEvaluated = ref(false);
const errorVisible = ref(false);
const angleMode = ref("deg");
const memory = ref(null);
const historyOpen = ref(false);
const mode = ref("basic");

const activeMath = computed(() =>
  angleMode.value === "deg" ? mathDeg : mathRad,
);

const valueEnd = /[\d.)!%]/;

function insert(text, type = "value") {
  errorVisible.value = false;
  if (justEvaluated.value && ["digit", "dot", "paren-l"].includes(type)) {
    expression.value = "";
    justEvaluated.value = false;
  }
  const expr = expression.value;
  const last = expr.slice(-1);

  if (type === "digit") {
    expression.value = last === ")" ? expr + "*" + text : expr + text;
    justEvaluated.value = false;
    return;
  }
  if (type === "dot") {
    if (last === ".") return;
    const token = expr.split(/[+*/(^\-]/).pop();
    if (token.includes(".")) return;
    if (!expr || /[/+*^(]$/.test(last)) expression.value = expr + "0.";
    else expression.value = expr + ".";
    justEvaluated.value = false;
    return;
  }
  if (type === "op") {
    if (!expr) {
      if (text === "-") expression.value = "-";
      justEvaluated.value = false;
      return;
    }
    if (text === "-") {
      if (last === "-") return;
      expression.value = expr + "-";
    } else if (/[/+*^]$/.test(last)) {
      expression.value = expr.slice(0, -1) + text;
    } else {
      expression.value = expr + text;
    }
    justEvaluated.value = false;
    return;
  }
  if (type === "exponent") {
    if (expr && /[\d.)ei%]$/.test(last)) expression.value = expr + text;
    justEvaluated.value = false;
    return;
  }
  if (type === "percent") {
    if (expr && valueEnd.test(last)) expression.value = expr + "%";
    justEvaluated.value = false;
    return;
  }
  if (type === "factorial") {
    if (expr && /[\d.)%]$/.test(last) && last !== "%")
      expression.value = expr + "!";
    else if (expr && last === ")") expression.value = expr + "!";
    justEvaluated.value = false;
    return;
  }
  if (type === "paren-l") {
    if (/[\d.)!%ei]$/.test(last)) expression.value = expr + "*(";
    else expression.value = expr + "(";
    justEvaluated.value = false;
    return;
  }
  if (type === "paren-r") {
    const open = (expr.match(/\(/g) || []).length;
    const closed = (expr.match(/\)/g) || []).length;
    if (open > closed) expression.value = expr + ")";
    justEvaluated.value = false;
    return;
  }
  if (type === "fn" || type === "value") {
    if (expr && /[\d.)!%ei]$/.test(last)) expression.value = expr + "*";
    expression.value += text;
    justEvaluated.value = false;
  }
}

function equals() {
  if (justEvaluated.value || !expression.value) return;
  if (!subscribed.value && calcUses.value >= FREE_RESULT_LIMIT) {
    openSubscribe();
    return;
  }
  const res = compute(expression.value, { math: activeMath.value });
  if (res.ok) {
    addHistory(prettify(res.normalized), res.formatted);
    expression.value = res.formatted;
    justEvaluated.value = true;
    errorVisible.value = false;
    if (!subscribed.value) {
      calcUses.value += 1;
    }
  } else {
    errorVisible.value = true;
    justEvaluated.value = false;
  }
}

function ac() {
  expression.value = "";
  justEvaluated.value = false;
  errorVisible.value = false;
}

function ce() {
  ac();
}

function back() {
  if (!expression.value) return;
  expression.value = expression.value.slice(0, -1);
  justEvaluated.value = false;
  errorVisible.value = false;
}

function negate() {
  const expr = expression.value;
  if (!expr || expr === "-") {
    expression.value = expr === "-" ? "" : "-";
    justEvaluated.value = false;
    return;
  }
  expression.value = expr.startsWith("-") ? expr.slice(1) : "-" + expr;
  justEvaluated.value = false;
  errorVisible.value = false;
}

function currentValue() {
  if (!expression.value) return null;
  const res = compute(expression.value, { math: activeMath.value });
  if (!res.ok || typeof res.value !== "number") return null;
  return res.value;
}

function mPlus() {
  const v = currentValue();
  if (v === null) return;
  memory.value = (memory.value ?? 0) + v;
}

function mMinus() {
  const v = currentValue();
  if (v === null) return;
  memory.value = (memory.value ?? 0) - v;
}

function mRecall() {
  if (memory.value === null) return;
  errorVisible.value = false;
  if (!expression.value || justEvaluated.value) {
    expression.value = String(memory.value);
    justEvaluated.value = false;
  } else {
    insert(String(memory.value), "value");
  }
}

function mClear() {
  memory.value = null;
}

function toggleAngle() {
  angleMode.value = angleMode.value === "deg" ? "rad" : "deg";
}

function handlePress(key) {
  if (/^[0-9]$/.test(key)) return insert(key, "digit");
  switch (key) {
    case "dot":
      insert(".", "dot");
      break;
    case "add":
      insert("+", "op");
      break;
    case "sub":
      insert("-", "op");
      break;
    case "mul":
      insert("*", "op");
      break;
    case "div":
      insert("/", "op");
      break;
    case "power":
      insert("^", "op");
      break;
    case "pow2":
      insert("^2", "exponent");
      break;
    case "pow3":
      insert("^3", "exponent");
      break;
    case "percent":
      insert("%", "percent");
      break;
    case "paren-l":
      insert("(", "paren-l");
      break;
    case "paren-r":
      insert(")", "paren-r");
      break;
    case "factorial":
      insert("!", "factorial");
      break;
    case "equals":
      equals();
      break;
    case "ac":
      ac();
      break;
    case "ce":
      ce();
      break;
    case "back":
      back();
      break;
    case "neg":
      negate();
      break;
    case "m+":
      mPlus();
      break;
    case "m-":
      mMinus();
      break;
    case "mr":
      mRecall();
      break;
    case "mc":
      mClear();
      break;
    case "sin":
      insert("sin(", "fn");
      break;
    case "cos":
      insert("cos(", "fn");
      break;
    case "tan":
      insert("tan(", "fn");
      break;
    case "asin":
      insert("asin(", "fn");
      break;
    case "acos":
      insert("acos(", "fn");
      break;
    case "atan":
      insert("atan(", "fn");
      break;
    case "ln":
      insert("log(", "fn");
      break;
    case "log":
      insert("log10(", "fn");
      break;
    case "exp":
      insert("exp(", "fn");
      break;
    case "pow10":
      insert("10^", "fn");
      break;
    case "sqrt":
      insert("sqrt(", "fn");
      break;
    case "cbrt":
      insert("cbrt(", "fn");
      break;
    case "pi":
      insert("pi", "value");
      break;
    case "e":
      insert("e", "value");
      break;
    default:
      break;
  }
}

const preview = computed(() => {
  if (!expression.value) return { text: "", error: false };
  const res = compute(expression.value, { math: activeMath.value });
  if (!res.ok) return { text: "Error", error: true };
  return { text: res.formatted, error: false };
});

const HISTORY_KEY = "calc-history";
const MAX_HISTORY = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.expr === "string" &&
          typeof item.result === "string",
      )
      .slice(0, MAX_HISTORY);
  } catch (err) {
    return [];
  }
}

const history = ref(loadHistory());

watch(
  history,
  (items) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (err) {}
  },
  { deep: true },
);

function addHistory(expr, result) {
  history.value.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    expr,
    result,
  });
  if (history.value.length > MAX_HISTORY) history.value.pop();
}

function reuseHistory(item) {
  expression.value = item.result;
  justEvaluated.value = true;
  errorVisible.value = false;
  historyOpen.value = false;
}

function clearHistory() {
  history.value = [];
}

const dispExpression = computed(() => prettify(expression.value));

const dark = ref(false);
const subscribed = ref(false);
const subscribeOpen = ref(false);
const subscribeSuccess = ref(false);

const FREE_RESULT_LIMIT = 3;
const calcUses = ref(0);

function openSubscribe() {
  subscribeSuccess.value = false;
  subscribeOpen.value = true;
}

function closeSubscribe() {
  subscribeOpen.value = false;
}

function completeSubscribe() {
  subscribed.value = true;
  subscribeSuccess.value = true;
  dark.value = true;
}

function handleThemeClick() {
  if (subscribed.value) {
    dark.value = !dark.value;
  } else {
    openSubscribe();
  }
}

function applyTheme() {
  document.documentElement.classList.toggle("dark", dark.value);
}

const savedTheme = localStorage.getItem("calc-theme");
if (savedTheme) {
  dark.value = savedTheme === "dark";
} else {
  dark.value =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
}

watch(dark, (value) => {
  localStorage.setItem("calc-theme", value ? "dark" : "light");
  applyTheme();
});

function onKeydown(event) {
  const target = event.target;
  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
  ) {
    return;
  }
  const k = event.key;
  if (/^[0-9]$/.test(k)) {
    insert(k, "digit");
    event.preventDefault();
    return;
  }
  switch (k) {
    case ".":
      insert(".", "dot");
      event.preventDefault();
      break;
    case "+":
      insert("+", "op");
      event.preventDefault();
      break;
    case "-":
      insert("-", "op");
      event.preventDefault();
      break;
    case "*":
      insert("*", "op");
      event.preventDefault();
      break;
    case "/":
      insert("/", "op");
      event.preventDefault();
      break;
    case "^":
      insert("^", "op");
      event.preventDefault();
      break;
    case "%":
      insert("%", "percent");
      event.preventDefault();
      break;
    case "(":
      insert("(", "paren-l");
      event.preventDefault();
      break;
    case ")":
      insert(")", "paren-r");
      event.preventDefault();
      break;
    case "!":
      insert("!", "factorial");
      event.preventDefault();
      break;
    case "=":
    case "Enter":
      equals();
      event.preventDefault();
      break;
    case "Escape":
      ac();
      event.preventDefault();
      break;
    case "Backspace":
      back();
      event.preventDefault();
      break;
    case "Delete":
      ce();
      event.preventDefault();
      break;
    default:
      if (mode.value !== "calculus") {
        if (k === "p") {
          insert("pi", "value");
          event.preventDefault();
        } else if (k === "e") {
          insert("e", "value");
          event.preventDefault();
        } else if (k === "s") {
          insert("sin(", "fn");
          event.preventDefault();
        } else if (k === "c") {
          insert("cos(", "fn");
          event.preventDefault();
        } else if (k === "t") {
          insert("tan(", "fn");
          event.preventDefault();
        } else if (k === "n") {
          insert("log(", "fn");
          event.preventDefault();
        } else if (k === "l") {
          insert("log10(", "fn");
          event.preventDefault();
        } else if (k === "a") {
          insert("sqrt(", "fn");
          event.preventDefault();
        }
      }
  }
}

onMounted(() => {
  applyTheme();
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});

const tabs = [
  { key: "basic", label: "Basic" },
  { key: "scientific", label: "Scientific" },
  { key: "calculus", label: "Calculus" },
];
</script>

<template>
  <div
    class="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 font-sans text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
  >
    <div class="mx-auto w-full max-w-3xl px-4 py-6">
      <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold tracking-tight">計算器</h1>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
            :aria-pressed="historyOpen"
            @click="historyOpen = !historyOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="sr-only">Toggle history</span>
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
            @click="handleThemeClick"
          >
            <svg
              v-if="dark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <span class="sr-only">Toggle theme</span>
          </button>
        </div>
      </header>

      <div class="flex flex-col gap-5 md:flex-row md:items-start">
        <div
          class="w-full max-w-lg flex-1 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
        >
          <nav
            class="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900"
          >
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="rounded-xl py-2 text-sm font-semibold transition active:scale-95"
              :class="
                mode === tab.key
                  ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              "
              @click="mode = tab.key"
            >
              {{ tab.label }}
            </button>
          </nav>

          <Display
            :expression="dispExpression"
            :result="preview.text"
            :error="preview.error || errorVisible"
            :evaluated="justEvaluated"
            :memory="memory !== null"
          />

          <Transition name="fade" mode="out-in">
            <ScientificPanel
              v-if="mode === 'scientific'"
              :key="'sci'"
              :angle-mode="angleMode"
              @press="handlePress"
              @toggle-angle="toggleAngle"
            />
            <CalculusPanel v-else-if="mode === 'calculus'" :key="'calc'" />
          </Transition>

          <ButtonGrid v-if="mode !== 'calculus'" @press="handlePress" />
        </div>

        <div
          v-if="historyOpen"
          class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          @click="historyOpen = false"
        ></div>
        <div
          v-if="historyOpen"
          class="fixed inset-y-0 right-0 z-40 w-full max-w-xs overflow-y-auto bg-slate-100 p-4 dark:bg-slate-900 md:z-auto md:sticky md:top-6 md:w-72 md:shrink-0 md:overflow-visible md:bg-transparent md:p-0 md:dark:bg-transparent"
        >
          <HistoryPanel
            :items="history"
            @reuse="reuseHistory"
            @clear="clearHistory"
          />
        </div>
      </div>
    </div>

    <SubscribeModal
      v-if="subscribeOpen"
      adult="$99.99/月"
      :success="subscribeSuccess"
      @close="closeSubscribe"
      @subscribe="completeSubscribe"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
