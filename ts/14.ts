import { promises as fs } from 'fs';

const steps = 10;

(async () => {
  const input = (await fs.readFile('../inputs/14.txt')).toString();
  const lines = input.split('\n');
  let [template] = lines;
  const letters: Record<string, number> = {};
  for (const c of template) {
    if (!letters[c]) letters[c] = 0;
    ++letters[c];
  }
  const rules = lines
    .slice(2)
    .map((line) => line.split(' -> '))
    .map(([key, insertion]) => [key, insertion, key[0] + insertion + key[1]]);
  // console.log('Template:    ', template);
  for (let step = 1; step <= steps; step++) {
    for (let c = 0; c < template.length; ) {
      const pair = template.slice(c, c + 2);
      const match = rules.find(([key]) => pair === key);
      if (match) {
        const [, whatsNew, insertion] = match;
        template = template
          .slice(0, c)
          .concat(insertion)
          .concat(template.slice(c + 2));
        c += 2;
        if (!letters[whatsNew]) letters[whatsNew] = 0;
        ++letters[whatsNew];
      } else {
        c += 1;
      }
    }
    // console.log(`After step ${step}:`, template);
  }
  console.log('Polymer length:', template.length);
  const sortedByOccurrencies = Object.entries(letters).sort(
    ([, occA], [, occB]) => occB - occA
  );
  const [
    [mostCommonLetter, mostOccurrences],
    [leastCommonLetter, leastOccurrences],
  ] = [
    sortedByOccurrencies[0],
    sortedByOccurrencies[sortedByOccurrencies.length - 1],
  ];
  console.log(
    'Most common letter:',
    mostCommonLetter,
    '=>',
    mostOccurrences,
    'time(s)'
  );
  console.log(
    'Least common letter:',
    leastCommonLetter,
    '=>',
    leastOccurrences,
    'time(s)'
  );
  console.log(
    `Result: ${mostOccurrences} - ${leastOccurrences} = ${
      mostOccurrences - leastOccurrences
    }`
  );
})();
