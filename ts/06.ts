import { promises as fs } from 'fs';

const days: number = Number(process.argv.pop() ?? '0');
const debug = process.env.DEBUG === '1';

function debugInfo(day: number, state: number[]) {
  console.log(
    `After ${String(day).padStart(2, ' ')} day${day > 1 ? 's' : ''}:${''.padEnd(
      day > 1 ? 1 : 2,
      ' '
    )}${state.join(',')}`
  );
}

(async () => {
  const input = (await fs.readFile('../inputs/06-example.txt')).toString();
  const initialState: number[] = input.split(',').map((v) => +v);

  const state = initialState.slice();
  for (let day = 1; day <= days; day++) {
    const length = state.length;
    for (let i = 0; i < length; i++) {
      if (state[i]-- === 0) {
        state[i] = 6;
        state.push(8);
      }
    }
    debug && debugInfo(day, state);
  }
  console.log(state.length);
})();
