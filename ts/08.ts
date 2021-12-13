import { promises as fs } from 'fs';

class SevenSegmentDisplay {
  parse(input: string): number {
    if (input.length === 2) {
      return 1;
    }
    if (input.length === 3) {
      return 7;
    }
    if (input.length === 4) {
      return 4;
    }
    if (input.length === 7) {
      return 8;
    }

    return NaN;
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/08.txt')).toString();
  const lines = input.split('\n');
  const digits = [...Array(10)].map(() => 0);
  for (const [, value] of lines.map((line) => line.split(' | '))) {
    const display = new SevenSegmentDisplay();
    for (const candidate of value.trim().split(' ')) {
      digits[display.parse(candidate)]++;
    }
  }
  console.log(digits[1] + digits[4] + digits[7] + digits[8]);
})();
