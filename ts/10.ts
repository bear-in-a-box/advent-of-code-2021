import { promises as fs } from 'fs';

const points: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const openings = '([{<';
const correspondings: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

function calculateSyntaxErrorScore(line: string): number {
  const stack: string[] = [];
  for (const c of line) {
    if (openings.includes(c)) {
      stack.push(c);
      continue;
    }
    const opening = stack.pop();
    if (correspondings[opening!] !== c) {
      return points[c];
    }
  }
  return 0;
}

const sumReducer = [(acc: number, v: number) => acc + v, 0] as const;

(async () => {
  const input = (await fs.readFile('../inputs/10.txt')).toString();
  const lines = input.split('\n').map((line) => line.trim());
  const result = lines.map(calculateSyntaxErrorScore).reduce(...sumReducer);
  console.log(result);
})();
