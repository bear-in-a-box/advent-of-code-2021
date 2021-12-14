import { promises as fs } from 'fs';

const debug = false;
const steps = 40;

(async () => {
  const input = (await fs.readFile('../inputs/14.txt')).toString();
  const lines = input.split('\n');
  let [template] = lines;
  const letters: Record<string, bigint> = {};
  const ensureLetter = (letter: string) => {
    if (letters[letter] === undefined) letters[letter] = 0n;
  };
  for (const c of template) {
    ensureLetter(c);
    ++letters[c];
  }
  const rules = lines
    .slice(2)
    .map((line) => line.split(' -> '))
    .map(([key, insertion]) => [key, insertion, key[0] + insertion + key[1]]);
  const rulesByKey = Object.fromEntries(
    rules.map((rule) => [rule[0], rule.slice(1)])
  ) as Record<string, [string, string]>;
  const counters = Object.fromEntries(rules.map(([key]) => [key, 0n]));
  const ensure = (pair: string) => {
    if (counters[pair] === undefined) counters[pair] = 0n;
  };
  for (let c = 0; c < template.length - 1; c++) {
    const pair = template.slice(c, c + 2);
    ensure(pair);
    counters[pair]++;
  }
  for (let step = 1; step <= steps; step++) {
    debug && console.log('# Step', step);
    const pairs = Object.keys(counters).filter(
      (key) => counters[key] > 0n && rulesByKey[key]
    );
    const countersSnapshot = Object.fromEntries(Object.entries(counters));
    for (const pair of pairs) {
      ensure(pair);
      const [insertion] = rulesByKey[pair];
      const occurrences = countersSnapshot[pair];
      counters[pair] -= occurrences;
      ensureLetter(insertion);
      letters[insertion] += occurrences;
      const pairsToAdd = [pair[0] + insertion, insertion + pair[1]];
      debug &&
        console.log(
          `Expanding ${pair} (x${occurrences}) to ${pairsToAdd.join(' and ')}`
        );
      for (const toAdd of pairsToAdd) {
        ensure(toAdd);
        counters[toAdd] += occurrences;
      }
    }
  }
  debug && console.log(counters);
  debug && console.log(letters);
  debug &&
    console.log(
      'Total length:',
      Object.values(letters).reduce((acc, v) => acc + v, 0n)
    );
  const rank = Object.values(letters).sort((a, b) => (a < b ? 1 : -1));
  console.log('Result:', (rank.shift()! - rank.pop()!).toString());
})();
