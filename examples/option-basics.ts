import { None, Option, Some } from '../src/index.js';

// --- Creating Options ---
const name = Some('Alice');
const empty = None<string>();

// --- Type checks ---
console.log(name.isSome()); // true
console.log(empty.isNone()); // true

// --- Extracting values ---
console.log(name.unwrap()); // "Alice"
console.log(empty.unwrapOr('default')); // "default"

// --- Transforming ---
const upper = name.map((n) => n.toUpperCase());
console.log(upper.unwrap()); // "ALICE"

const first = name.flatMap((n) => (n.length > 0 ? Some(n[0]) : None()));
console.log(first.unwrap()); // "A"

// --- Filtering ---
const long = name.filter((n) => n.length > 10);
console.log(long.isNone()); // true (Alice is not > 10 chars)

// --- Combining ---
const a = Some(1);
const b = Some(2);
console.log(a.zip(b).unwrap()); // [1, 2]

// --- From nullable ---
const nullable: string | null = null;
const opt = Option.fromNullable(nullable);
console.log(opt.isNone()); // true

// --- Pattern matching ---
name.match({
  Some: (n) => console.log(`Hello, ${n}!`),
  None: () => console.log('No name'),
});

// --- Conversion ---
console.log(name.toUndefined()); // "Alice"
console.log(empty.toNull()); // null
