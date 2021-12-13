import { promises as fs } from 'fs';

const points: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const openings = '([{<';
const correspondings: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

function isLineCorrupted(line: string): boolean {
  const stack: string[] = [];
  for (const c of line) {
    if (openings.includes(c)) {
      stack.push(c);
      continue;
    }
    const opening = stack.pop();
    if (correspondings[opening!] !== c) {
      return true;
    }
  }
  return false;
}

function calculateSyntaxErrorScore(line: string): number {
  const stack: string[] = [];
  for (const c of line) {
    if (openings.includes(c)) {
      stack.push(c);
      continue;
    }
    stack.pop();
  }
  let score = 0;
  let c: string | undefined;
  while ((c = stack.pop())) {
    score *= 5;
    score += points[correspondings[c]];
  }
  return score;
}

(async () => {
  const input = (await fs.readFile('../inputs/10.txt')).toString();
  const lines = input.split('\n').map((line) => line.trim());
  const notCorruptedLines = (line: string) => !isLineCorrupted(line);
  const results = lines
    .filter(notCorruptedLines)
    .map(calculateSyntaxErrorScore)
    .sort((a, b) => a - b);
  const index = Math.floor(results.length / 2);
  console.log(results[index]);
})();
