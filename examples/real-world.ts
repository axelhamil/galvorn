import { Fail, match, Ok, Option, Result } from '../src/index.js';

// ============================================================
// Real-world example: User lookup with config parsing
// ============================================================

interface User {
  id: number;
  name: string;
  email: string | null;
}

// Simulated database
const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: null },
];

// --- Option: safe lookups ---
function findUser(id: number): Option<User> {
  return Option.fromNullable(users.find((u) => u.id === id));
}

function getUserEmail(id: number): Option<string> {
  return findUser(id).flatMap((u) => Option.fromNullable(u.email));
}

console.log(getUserEmail(1).unwrapOr('no email')); // "alice@example.com"
console.log(getUserEmail(2).unwrapOr('no email')); // "no email"
console.log(getUserEmail(99).unwrapOr('no email')); // "no email"

// --- Result: parsing with error recovery ---
interface Config {
  port: number;
  host: string;
}

function parseConfig(raw: string): Result<Config, string> {
  return Result.fromThrowable(() => JSON.parse(raw))
    .mapErr((e) => `JSON parse error: ${(e as Error).message}`)
    .flatMap((obj) => {
      if (typeof obj.port !== 'number') return Fail('missing port');
      if (typeof obj.host !== 'string') return Fail('missing host');
      return Ok({ port: obj.port, host: obj.host });
    });
}

const good = parseConfig('{"port": 3000, "host": "localhost"}');
const bad = parseConfig('not json');
const incomplete = parseConfig('{"port": 3000}');

console.log(good.unwrap()); // { port: 3000, host: "localhost" }
console.log(bad.unwrapErr()); // "JSON parse error: ..."
console.log(incomplete.unwrapErr()); // "missing host"

// --- Standalone match ---
function describeUser(id: number): string {
  return match(findUser(id), {
    Some: (u) =>
      match(Option.fromNullable(u.email), {
        Some: (email) => `${u.name} <${email}>`,
        None: () => `${u.name} (no email)`,
      }),
    None: () => 'User not found',
  });
}

console.log(describeUser(1)); // "Alice <alice@example.com>"
console.log(describeUser(2)); // "Bob (no email)"
console.log(describeUser(99)); // "User not found"
