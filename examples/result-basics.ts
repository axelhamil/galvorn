import { Fail, Ok, Result } from '../src/index.js';

// --- Creating Results ---
const success = Ok(42);
const failure = Fail<number, string>('not found');

// --- Type checks ---
console.log(success.isOk()); // true
console.log(failure.isErr()); // true

// --- Extracting values ---
console.log(success.unwrap()); // 42
console.log(failure.unwrapOr(0)); // 0
console.log(failure.unwrapErr()); // "not found"

// --- Transforming ---
const doubled = success.map((n) => n * 2);
console.log(doubled.unwrap()); // 84

const mapped = failure.mapErr((e) => `Error: ${e}`);
console.log(mapped.unwrapErr()); // "Error: not found"

// --- Chaining ---
const parsed = Ok('42').flatMap((s) => {
  const n = Number(s);
  return Number.isNaN(n) ? Fail('not a number') : Ok(n);
});
console.log(parsed.unwrap()); // 42

// --- From throwable ---
const safe = Result.fromThrowable(() => JSON.parse('{"ok": true}'));
console.log(safe.unwrap()); // { ok: true }

const unsafe = Result.fromThrowable(() => JSON.parse('invalid'));
console.log(unsafe.isErr()); // true

// --- Combining ---
const combined = Result.combine([Ok(1), Ok(2), Ok(3)]);
console.log(combined.unwrap()); // [1, 2, 3]

const withError = Result.combine([Ok(1), Fail('oops'), Ok(3)]);
console.log(withError.unwrapErr()); // "oops"

// --- Pattern matching ---
success.match({
  Ok: (v) => console.log(`Success: ${v}`),
  Err: (e) => console.error(`Error: ${e}`),
});
